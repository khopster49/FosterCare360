import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parse } from "date-fns";
import { Loader2, Plus, Trash, AlertTriangle } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEmploymentGaps } from "@/hooks/use-employment-gaps";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatDate } from "@/lib/utils";

// Create schema for an employment entry
const employmentEntrySchema = z.object({
  employer: z.string().min(1, { message: "Employer name is required" }),
  position: z.string().min(1, { message: "Position is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  duties: z.string().min(1, { message: "Duties and responsibilities are required" }),
  referenceName: z.string().min(1, { message: "Reference name is required" }),
  referenceEmail: z.string().email({ message: "Please enter a valid email address" }),
  referencePhone: z.string().min(5, { message: "Reference phone number is required" }),
  workedWithVulnerable: z.boolean().default(false),
});

// Create schema for an employment gap
const employmentGapSchema = z.object({
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  explanation: z.string().min(1, { message: "Explanation for the gap is required" }),
});

// Create schema for the entire form
const employmentFormSchema = z.object({
  applicantId: z.number(),
  employmentEntries: z.array(employmentEntrySchema).min(1, { message: "At least one employment entry is required" }),
  employmentGaps: z.array(employmentGapSchema),
});

type EmploymentFormValues = z.infer<typeof employmentFormSchema>;

interface EmploymentFormProps {
  applicantId: number;
  onSuccess: () => void;
  onBack: () => void;
}

export function EmploymentForm({ applicantId, onSuccess, onBack }: EmploymentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [employmentData, setEmploymentData] = useState<any[]>([]);
  
  // Fetch existing employment entries if any
  const { data: existingEmployment } = useQuery({
    queryKey: [`/api/applicants/${applicantId}/employment`],
    enabled: !!applicantId,
  });
  
  // Fetch existing gaps if any
  const { data: existingGaps } = useQuery({
    queryKey: [`/api/applicants/${applicantId}/gaps`],
    enabled: !!applicantId,
  });
  
  // Set up the form
  const form = useForm<EmploymentFormValues>({
    resolver: zodResolver(employmentFormSchema),
    defaultValues: {
      applicantId,
      employmentEntries: [
        {
          employer: "",
          position: "",
          startDate: "",
          endDate: "",
          isCurrent: true,
          duties: "",
          referenceName: "",
          referenceEmail: "",
          referencePhone: "",
          workedWithVulnerable: false,
        },
      ],
      employmentGaps: [],
    },
  });
  
  // Set up field array for employment entries
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "employmentEntries",
  });
  
  // Set up employment gaps hook
  const { gaps, setExplanation, getExplanation, getGapsWithExplanations } = useEmploymentGaps({
    employmentEntries: employmentData,
    gapsFromServer: existingGaps || [],
  });
  
  // Update form when entries change
  useEffect(() => {
    if (existingEmployment && existingEmployment.length > 0) {
      const formattedEntries = existingEmployment.map((entry: any) => ({
        ...entry,
        startDate: entry.startDate ? format(new Date(entry.startDate), 'yyyy-MM-dd') : '',
        endDate: entry.endDate ? format(new Date(entry.endDate), 'yyyy-MM-dd') : '',
      }));
      
      form.setValue('employmentEntries', formattedEntries);
    }
    
    if (existingGaps && existingGaps.length > 0) {
      const formattedGaps = existingGaps.map((gap: any) => ({
        ...gap,
        startDate: gap.startDate ? format(new Date(gap.startDate), 'yyyy-MM-dd') : '',
        endDate: gap.endDate ? format(new Date(gap.endDate), 'yyyy-MM-dd') : '',
      }));
      
      form.setValue('employmentGaps', formattedGaps);
    }
  }, [existingEmployment, existingGaps, form]);
  
  // Update employment data when form changes
  const watchedEmploymentEntries = form.watch('employmentEntries');
  useEffect(() => {
    // Convert form data to a format suitable for gap detection
    const entries = watchedEmploymentEntries.map(entry => {
      const formattedEntry: any = { ...entry };
      if (entry.startDate) {
        formattedEntry.startDate = parse(entry.startDate, 'yyyy-MM-dd', new Date());
      }
      if (entry.endDate && !entry.isCurrent) {
        formattedEntry.endDate = parse(entry.endDate, 'yyyy-MM-dd', new Date());
      } else if (entry.isCurrent) {
        formattedEntry.endDate = null;
      }
      return formattedEntry;
    });
    
    setEmploymentData(entries);
  }, [watchedEmploymentEntries]);
  
  // Update employment gaps in form when gaps change
  useEffect(() => {
    const gapsWithExplanations = getGapsWithExplanations();
    const formattedGaps = gapsWithExplanations.map(gap => ({
      startDate: format(gap.startDate, 'yyyy-MM-dd'),
      endDate: format(gap.endDate, 'yyyy-MM-dd'),
      explanation: gap.explanation || '',
    }));
    
    form.setValue('employmentGaps', formattedGaps);
  }, [gaps, getGapsWithExplanations, form]);
  
  // Create employment entry mutation
  const createEmploymentEntry = useMutation({
    mutationFn: async (values: any) => {
      const res = await apiRequest("POST", `/api/applicants/${applicantId}/employment`, values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/applicants/${applicantId}/employment`] });
    },
  });
  
  // Create employment gap mutation
  const createEmploymentGap = useMutation({
    mutationFn: async (values: any) => {
      const res = await apiRequest("POST", `/api/applicants/${applicantId}/gaps`, values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/applicants/${applicantId}/gaps`] });
    },
  });
  
  // Handle form submission
  async function onSubmit(values: EmploymentFormValues) {
    setSubmitting(true);
    try {
      // Submit each employment entry
      for (const entry of values.employmentEntries) {
        const entryData = { ...entry };
        // If current job, set endDate to null
        if (entryData.isCurrent) {
          entryData.endDate = undefined;
        }
        await createEmploymentEntry.mutateAsync(entryData);
      }
      
      // Submit each employment gap
      for (const gap of values.employmentGaps) {
        if (gap.explanation) {
          await createEmploymentGap.mutateAsync({
            ...gap,
            applicantId,
          });
        }
      }
      
      toast({
        title: "Employment history saved",
        description: "Your employment history has been saved successfully.",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save employment history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div 
            key={field.id}
            className="employment-entry bg-neutral-50 border border-neutral-200 rounded-md p-4 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium flex items-center">
                {index === 0 && form.watch(`employmentEntries.${index}.isCurrent`) && (
                  <span className="bg-secondary text-white text-xs px-2 py-1 rounded mr-2">Current</span>
                )}
                {index === 0 ? "Employment" : "Previous Employment"}
              </h3>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-neutral-700 hover:text-destructive"
                >
                  <Trash className="h-5 w-5" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name={`employmentEntries.${index}.employer`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="XYZ Social Services" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`employmentEntries.${index}.position`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Social Worker" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`employmentEntries.${index}.startDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col space-y-1">
                <FormField
                  control={form.control}
                  name={`employmentEntries.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <div className="flex items-center space-x-3">
                        <FormControl>
                          <Input 
                            type="date" 
                            disabled={form.watch(`employmentEntries.${index}.isCurrent`)} 
                            {...field} 
                            value={form.watch(`employmentEntries.${index}.isCurrent`) ? "" : field.value} 
                          />
                        </FormControl>
                        
                        <FormField
                          control={form.control}
                          name={`employmentEntries.${index}.isCurrent`}
                          render={({ field: checkboxField }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={checkboxField.value}
                                  onCheckedChange={checkboxField.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">Current</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name={`employmentEntries.${index}.duties`}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Duties & Responsibilities</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your main responsibilities and duties..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`employmentEntries.${index}.referenceName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`employmentEntries.${index}.referenceEmail`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="jane.smith@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`employmentEntries.${index}.referencePhone`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="07XX XXX XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`employmentEntries.${index}.workedWithVulnerable`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Did this role involve working with children or vulnerable adults?</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={(value) => field.onChange(value === "yes")}
                        defaultValue={field.value ? "yes" : "no"}
                        className="flex items-center space-x-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id={`vulnerable-yes-${index}`} />
                          <FormLabel htmlFor={`vulnerable-yes-${index}`} className="font-normal">Yes</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id={`vulnerable-no-${index}`} />
                          <FormLabel htmlFor={`vulnerable-no-${index}`} className="font-normal">No</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
        
        {/* Employment Gaps */}
        {gaps.map((gap, index) => (
          <div key={index} className="employment-gap bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
            <h3 className="text-lg font-medium mb-3 text-neutral-800 flex items-center">
              <AlertTriangle className="text-amber-500 mr-2 h-5 w-5" />
              Employment Gap Detected
            </h3>
            <p className="text-sm text-neutral-700 mb-3">
              We've detected a gap of more than 31 days between your employment periods 
              ({formatDate(gap.startDate)} to {formatDate(gap.endDate)}). 
              Please provide an explanation.
            </p>
            
            <FormField
              control={form.control}
              name={`employmentGaps.${index}.explanation`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Explanation for Gap</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please explain what you were doing during this period..."
                      rows={3}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setExplanation(gap.startDate, gap.endDate, e.target.value);
                      }}
                      value={field.value || getExplanation(gap.startDate, gap.endDate)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
        
        <div className="mb-6">
          <Button
            type="button"
            variant="outline"
            className="text-primary border-primary hover:bg-blue-50"
            onClick={() =>
              append({
                employer: "",
                position: "",
                startDate: "",
                endDate: "",
                isCurrent: false,
                duties: "",
                referenceName: "",
                referenceEmail: "",
                referencePhone: "",
                workedWithVulnerable: false,
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Another Employment
          </Button>
        </div>
        
        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back: Education History
          </Button>
          
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              "Next: References"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
