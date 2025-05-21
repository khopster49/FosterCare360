import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parse, differenceInDays, addDays, isAfter } from "date-fns";
import { Loader2, Plus, Trash, AlertTriangle, Briefcase } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";

// Create schema for an employment entry
const employmentEntrySchema = z.object({
  employer: z.string().min(1, { message: "Employer name is required" }),
  employerAddress: z.string().min(1, { message: "Employer address is required" }),
  employerPhone: z.string().min(5, { message: "Employer phone number is required" }),
  employerMobile: z.string().optional(),
  position: z.string().min(1, { message: "Position is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  duties: z.string().min(1, { message: "Duties and responsibilities are required" }),
  reasonForLeaving: z.string().optional(),
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

// Interface for employment gaps
interface Gap {
  startDate: Date;
  endDate: Date;
  days: number;
}

// Interface for gaps with associated employment
interface GapWithIndex {
  afterEmploymentIndex: number;
  gap: Gap;
}

export function EmploymentForm({ applicantId, onSuccess, onBack }: EmploymentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [potentialGaps, setPotentialGaps] = useState<GapWithIndex[]>([]);
  
  // Fetch existing employment entries if available
  const { data: existingEntries = [] } = useQuery({
    queryKey: [`/api/applicants/${applicantId}/employment`],
    enabled: !!applicantId,
  });
  
  // Fetch existing employment gaps if available
  const { data: existingGaps = [] } = useQuery({
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
          isCurrent: false,
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
  
  const { formState } = form;
  
  // Set up field array for employment entries
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "employmentEntries",
  });
  
  // Update form when entries change
  useEffect(() => {
    if (existingEntries && existingEntries.length > 0) {
      const formattedEntries = existingEntries.map((entry: any) => ({
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
  }, [existingEntries, existingGaps, form]);
  
  // Function to check for gaps between employment entries
  const checkForGaps = (entries: any[]): GapWithIndex[] => {
    if (!entries || entries.length < 2) return [];
    
    // Sort entries by start date (oldest first)
    const sortedEntries = [...entries].sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return dateA - dateB;
    });
    
    const gaps: GapWithIndex[] = [];
    
    // Check for gaps between consecutive employment periods
    for (let i = 0; i < sortedEntries.length - 1; i++) {
      const current = sortedEntries[i];
      const next = sortedEntries[i + 1];
      
      // Skip if current job is ongoing or missing end date
      if (!current.endDate || current.isCurrent) continue;
      
      const currentEndDate = new Date(current.endDate);
      const nextStartDate = new Date(next.startDate);
      
      // Check if there's a gap
      if (isAfter(nextStartDate, addDays(currentEndDate, 1))) {
        const gapStartDate = addDays(currentEndDate, 1);
        const gapDays = differenceInDays(nextStartDate, gapStartDate);
        
        // Only include gaps of 31 days or more
        if (gapDays >= 31) {
          // Find the original index of this entry in the unfiltered employment entries
          const originalIndex = fields.findIndex(f => 
            f.employer === current.employer && 
            f.position === current.position &&
            f.startDate === current.startDate
          );
          
          if (originalIndex !== -1) {
            gaps.push({
              afterEmploymentIndex: originalIndex,
              gap: {
                startDate: gapStartDate,
                endDate: nextStartDate,
                days: gapDays
              }
            });
          }
        }
      }
    }
    
    return gaps;
  };
  
  // Watch employment entries for immediate gap detection
  const watchedEmploymentEntries = form.watch('employmentEntries');
  
  // Add dummy employment gap to force displaying a gap input
  useEffect(() => {
    // Check if we have at least 2 entries with valid dates
    const entriesWithDates = watchedEmploymentEntries.filter(
      entry => entry.startDate && (entry.endDate || entry.isCurrent)
    );
    
    // Compare dates between entries to find gaps
    if (entriesWithDates.length >= 2) {
      try {
        // Sort by start date
        const sortedEntries = [...entriesWithDates].sort((a, b) => {
          const dateA = new Date(a.startDate).getTime();
          const dateB = new Date(b.startDate).getTime();
          return dateA - dateB;
        });
        
        const gaps: GapWithIndex[] = [];
        
        // Check each pair of consecutive entries
        for (let i = 0; i < sortedEntries.length - 1; i++) {
          const current = sortedEntries[i];
          const next = sortedEntries[i + 1];
          
          // Skip if current job has no end date or is marked as current
          if (!current.endDate || current.isCurrent) continue;
          
          const currentEndDate = new Date(current.endDate);
          const nextStartDate = new Date(next.startDate);
          
          // If there's a gap (next start date is after current end date)
          if (nextStartDate > addDays(currentEndDate, 1)) {
            const gapStartDate = addDays(currentEndDate, 1);
            const gapDays = differenceInDays(nextStartDate, gapStartDate);
            
            // Only include gaps of 31 days or more
            if (gapDays >= 31) {
              // Find the original index in the form array
              const originalIndex = watchedEmploymentEntries.findIndex(e => 
                e.employer === current.employer && 
                e.position === current.position && 
                e.startDate === current.startDate
              );
              
              if (originalIndex !== -1) {
                gaps.push({
                  afterEmploymentIndex: originalIndex,
                  gap: {
                    startDate: gapStartDate,
                    endDate: nextStartDate,
                    days: gapDays
                  }
                });
              }
            }
          }
        }
        
        setPotentialGaps(gaps);
        
        // Update the gap fields in the form
        const formattedGaps = gaps.map(({ gap }) => ({
          startDate: format(gap.startDate, 'yyyy-MM-dd'),
          endDate: format(gap.endDate, 'yyyy-MM-dd'),
          explanation: '',
        }));
        
        form.setValue('employmentGaps', formattedGaps);
        
      } catch (error) {
        console.error("Error processing gap detection:", error);
      }
    }
  }, [watchedEmploymentEntries, form]);
  
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
  
  // Submit handler
  const onSubmit = async (values: EmploymentFormValues) => {
    setIsSubmitting(true);
    try {
      // Submit each employment entry
      for (const entry of values.employmentEntries) {
        const entryData = { ...entry, applicantId };
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
        description: "Your employment information has been successfully saved.",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save employment history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const submitting = isSubmitting || createEmploymentEntry.isPending || createEmploymentGap.isPending;
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-medium text-primary">Employment History</h3>
            </div>
            <p className="text-sm text-neutral-600 mb-4">
              Please provide details of your employment history for the past 5 years, including any periods of unemployment. 
              This information is required to comply with fostering regulations.
            </p>
          </CardContent>
        </Card>
        
        {fields.map((field, index) => {
          // Find if there's a gap after this employment
          const gapAfterThisEntry = potentialGaps.find(g => g.afterEmploymentIndex === index);
          
          return (
            <div key={field.id}>
              <Card className="mb-5 border-primary/10 overflow-hidden">
                <div className="bg-primary/5 px-6 py-3 flex justify-between items-center">
                  <h4 className="text-md font-medium text-primary">Employment {index + 1}</h4>
                  
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
                
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      name={`employmentEntries.${index}.employerAddress`}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Employer Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Full employer address including postcode..."
                              rows={2}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`employmentEntries.${index}.employerPhone`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employer Phone (Work)</FormLabel>
                          <FormControl>
                            <Input placeholder="Work phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`employmentEntries.${index}.employerMobile`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employer Mobile</FormLabel>
                          <FormControl>
                            <Input placeholder="Mobile phone number (if available)" {...field} />
                          </FormControl>
                          <FormDescription>
                            This field is optional and can be left blank if not available.
                          </FormDescription>
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
                            <Input 
                              type="date" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                // Force immediate gap detection
                                setTimeout(() => form.trigger("employmentEntries"), 100);
                              }}
                            />
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
                                  onChange={(e) => {
                                    field.onChange(e);
                                    // Force immediate gap detection on end date change
                                    setTimeout(() => {
                                      // This forces a recalculation of the gaps
                                      const currentEndDate = e.target.value;
                                      if (currentEndDate) {
                                        const entriesWithDates = form.getValues('employmentEntries').filter(
                                          entry => entry.startDate && (entry.endDate || entry.isCurrent)
                                        );
                                        if (entriesWithDates.length >= 2) {
                                          const checkGaps = () => {
                                            try {
                                              // Sort by start date
                                              const sortedEntries = [...entriesWithDates].sort((a, b) => {
                                                return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                                              });
                                              
                                              const gaps: GapWithIndex[] = [];
                                              
                                              for (let i = 0; i < sortedEntries.length - 1; i++) {
                                                const current = sortedEntries[i];
                                                const next = sortedEntries[i + 1];
                                                
                                                if (!current.endDate || current.isCurrent) continue;
                                                
                                                const currentEndDate = new Date(current.endDate);
                                                const nextStartDate = new Date(next.startDate);
                                                
                                                if (nextStartDate > new Date(currentEndDate.getTime() + 86400000)) {
                                                  const gapDays = Math.floor((nextStartDate.getTime() - currentEndDate.getTime()) / 86400000) - 1;
                                                  
                                                  if (gapDays >= 31) {
                                                    const originalIndex = form.getValues('employmentEntries').findIndex(e => 
                                                      e.employer === current.employer && 
                                                      e.position === current.position &&
                                                      e.startDate === current.startDate
                                                    );
                                                    
                                                    if (originalIndex !== -1) {
                                                      const gapStartDate = new Date(currentEndDate.getTime() + 86400000);
                                                      
                                                      gaps.push({
                                                        afterEmploymentIndex: originalIndex,
                                                        gap: {
                                                          startDate: gapStartDate,
                                                          endDate: nextStartDate,
                                                          days: gapDays
                                                        }
                                                      });
                                                    }
                                                  }
                                                }
                                              }
                                              
                                              setPotentialGaps(gaps);
                                              
                                              const formattedGaps = gaps.map(({ gap }) => ({
                                                startDate: format(gap.startDate, 'yyyy-MM-dd'),
                                                endDate: format(gap.endDate, 'yyyy-MM-dd'),
                                                explanation: '',
                                              }));
                                              
                                              form.setValue('employmentGaps', formattedGaps);
                                            } catch (error) {
                                              console.error("Error checking gaps:", error);
                                            }
                                          };
                                          
                                          checkGaps();
                                        }
                                      }
                                    }, 100);
                                  }}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`employmentEntries.${index}.isCurrent`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  if (checked) {
                                    form.setValue(`employmentEntries.${index}.endDate`, "");
                                  }
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                This is my current job
                              </FormLabel>
                            </div>
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
                    
                    {!form.watch(`employmentEntries.${index}.isCurrent`) && (
                      <FormField
                        control={form.control}
                        name={`employmentEntries.${index}.reasonForLeaving`}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Reason for Leaving</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please explain your reason for leaving this position..."
                                rows={2}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Please provide details about why you left this position. This information helps us understand your employment history.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
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
                          <FormLabel>Reference Email</FormLabel>
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
                            <Input placeholder="+44 123 456 7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`employmentEntries.${index}.workedWithVulnerable`}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
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
                </CardContent>
              </Card>
              
              {/* Employment gap section - shown directly after the relevant employment entry */}
              {gapAfterThisEntry && (
                <Card className="mb-6 border-amber-300 -mt-2">
                  <CardContent className="pt-5">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                      <div className="w-full">
                        <h4 className="font-medium text-amber-800 mb-1">Employment Gap Detected</h4>
                        <p className="text-sm text-amber-700 mb-4">
                          We've detected a gap of {gapAfterThisEntry.gap.days} days after this employment
                          ({formatDate(gapAfterThisEntry.gap.startDate)} to {formatDate(gapAfterThisEntry.gap.endDate)}).
                          Please provide an explanation for this gap.
                        </p>
                        
                        <FormField
                          control={form.control}
                          name={`employmentGaps.${potentialGaps.indexOf(gapAfterThisEntry)}.explanation`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Explanation for Gap</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please explain what you were doing during this period..."
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
        
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
            Add Employment
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
          
          <Button 
            type="submit" 
            disabled={submitting || !formState.isValid}
            className="bg-primary hover:bg-primary/90"
          >
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