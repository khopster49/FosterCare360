import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parse, differenceInDays, addDays, isAfter } from "date-fns";
import { Plus, Trash, AlertTriangle, Briefcase } from "lucide-react";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const employmentEntrySchema = z.object({
  employer: z.string().min(1, "Employer name is required"),
  employerAddress: z.string().min(1, "Employer address is required"),
  employerPostcode: z.string().min(1, "Postcode is required"),
  employerPhone: z.string().optional(),
  employerMobile: z.string().optional(),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  duties: z.string().min(1, "Job duties are required"),
  reasonForLeaving: z.string().optional(),
  referenceName: z.string().min(1, "Reference name is required"),
  referenceEmail: z.string().email("Valid email is required"),
  referencePhone: z.string().optional(),
  workedWithVulnerable: z.boolean().default(false),
});

const employmentGapSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().min(1, "Reason for gap is required"),
});

const employmentFormSchema = z.object({
  applicantId: z.number(),
  employmentEntries: z.array(employmentEntrySchema).min(1, "At least one employment entry is required"),
  employmentGaps: z.array(employmentGapSchema).default([]),
});

type EmploymentFormValues = z.infer<typeof employmentFormSchema>;

interface EmploymentFormProps {
  applicantId: number;
  onSuccess: () => void;
  onBack: () => void;
}

interface Gap {
  startDate: Date;
  endDate: Date;
  days: number;
}

interface GapWithIndex {
  afterEmploymentIndex: number;
  gap: Gap;
}

export function EmploymentForm({ applicantId, onSuccess, onBack }: EmploymentFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [potentialGaps, setPotentialGaps] = useState<GapWithIndex[]>([]);

  // Load existing data from localStorage
  const loadFromLocalStorage = (): EmploymentFormValues => {
    try {
      const saved = localStorage.getItem(`employment_${applicantId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load employment data from localStorage:', error);
    }
    return {
      applicantId,
      employmentEntries: [
        {
          employer: "",
          employerAddress: "",
          employerPostcode: "",
          employerPhone: "",
          employerMobile: "",
          position: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          duties: "",
          reasonForLeaving: "",
          referenceName: "",
          referenceEmail: "",
          referencePhone: "",
          workedWithVulnerable: false,
        }
      ],
      employmentGaps: []
    };
  };

  // Set up the form
  const form = useForm<EmploymentFormValues>({
    resolver: zodResolver(employmentFormSchema),
    defaultValues: loadFromLocalStorage(),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "employmentEntries",
  });

  const { fields: gapFields, append: appendGap, remove: removeGap } = useFieldArray({
    control: form.control,
    name: "employmentGaps",
  });

  // Save to localStorage function
  const saveToLocalStorage = (values: EmploymentFormValues) => {
    try {
      localStorage.setItem(`employment_${applicantId}`, JSON.stringify(values));
    } catch (error) {
      console.warn('Failed to save employment data to localStorage:', error);
    }
  };

  // Gap detection function
  const detectGaps = (entries: any[]) => {
    if (entries.length < 2) return [];

    const validEntries = entries
      .filter(entry => entry.startDate && (entry.endDate || entry.isCurrent))
      .map(entry => ({
        ...entry,
        startDate: parse(entry.startDate, 'yyyy-MM-dd', new Date()),
        endDate: entry.isCurrent ? new Date() : parse(entry.endDate, 'yyyy-MM-dd', new Date()),
      }))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    const gaps: GapWithIndex[] = [];
    
    for (let i = 0; i < validEntries.length - 1; i++) {
      const currentEnd = validEntries[i].endDate;
      const nextStart = validEntries[i + 1].startDate;
      
      if (isAfter(nextStart, addDays(currentEnd, 1))) {
        const gapDays = differenceInDays(nextStart, currentEnd) - 1;
        if (gapDays > 0) {
          gaps.push({
            afterEmploymentIndex: i,
            gap: {
              startDate: addDays(currentEnd, 1),
              endDate: addDays(nextStart, -1),
              days: gapDays,
            },
          });
        }
      }
    }
    
    return gaps;
  };

  // Effect to detect gaps when employment entries change
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.employmentEntries) {
        const gaps = detectGaps(value.employmentEntries);
        setPotentialGaps(gaps);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Initial gap detection on load
  useEffect(() => {
    const currentValues = form.getValues();
    if (currentValues.employmentEntries) {
      const gaps = detectGaps(currentValues.employmentEntries);
      setPotentialGaps(gaps);
    }
  }, []);

  // Submit handler
  const onSubmit = async (values: EmploymentFormValues) => {
    setIsSubmitting(true);
    try {
      saveToLocalStorage(values);
      toast({
        title: "Employment History Saved",
        description: "Your employment information has been saved successfully.",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save employment information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEmploymentEntry = () => {
    append({
      employer: "",
      employerAddress: "",
      employerPostcode: "",
      employerPhone: "",
      employerMobile: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      duties: "",
      reasonForLeaving: "",
      referenceName: "",
      referenceEmail: "",
      referencePhone: "",
      workedWithVulnerable: false,
    });
  };

  const addEmploymentGap = () => {
    appendGap({
      startDate: "",
      endDate: "",
      reason: "",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="text-center mb-8">
          <Briefcase className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-3xl font-bold text-primary mb-2">Employment History</h2>
          <p className="text-gray-600">
            Please provide details of your employment history for the last 10 years.
          </p>
        </div>

        {/* Employment Entries with Embedded Gaps */}
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4">
              <Card className="border-2">
                <CardHeader className="bg-orange-50">
                  <CardTitle className="flex items-center justify-between text-primary">
                    <span>Employment Entry {index + 1}</span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`employmentEntries.${index}.employer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employer Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Company name" {...field} />
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
                        <FormLabel>Position/Job Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your job title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`employmentEntries.${index}.employerAddress`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employer Address *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Full address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`employmentEntries.${index}.employerPostcode`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postcode *</FormLabel>
                        <FormControl>
                          <Input placeholder="Postcode" {...field} />
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
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
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
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`employmentEntries.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`employmentEntries.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            disabled={form.watch(`employmentEntries.${index}.isCurrent`)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`employmentEntries.${index}.isCurrent`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>This is my current position</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`employmentEntries.${index}.duties`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Duties and Responsibilities *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your main duties and responsibilities"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`employmentEntries.${index}.reasonForLeaving`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Leaving</FormLabel>
                      <FormControl>
                        <Input placeholder="Why did you leave this position?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t pt-4">
                  <h4 className="font-medium text-primary mb-3">Reference Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`employmentEntries.${index}.referenceName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reference Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name" {...field} />
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
                          <FormLabel>Reference Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Email address" {...field} />
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
                          <FormLabel>Reference Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name={`employmentEntries.${index}.workedWithVulnerable`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Did this role involve working with children or vulnerable adults?
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Show gap after this employment entry if one exists */}
            {potentialGaps
              .filter(gapInfo => gapInfo.afterEmploymentIndex === index)
              .map((gapInfo, gapIndex) => {
                // Create a unique key for this specific gap
                const gapKey = `${format(gapInfo.gap.startDate, "yyyy-MM-dd")}-${format(gapInfo.gap.endDate, "yyyy-MM-dd")}`;
                
                // Find existing gap field that matches this gap's dates
                const matchingGapIndex = gapFields.findIndex(gapField => {
                  const fieldStartDate = form.getValues(`employmentGaps.${gapFields.indexOf(gapField)}.startDate`);
                  const fieldEndDate = form.getValues(`employmentGaps.${gapFields.indexOf(gapField)}.endDate`);
                  return fieldStartDate === format(gapInfo.gap.startDate, "yyyy-MM-dd") && 
                         fieldEndDate === format(gapInfo.gap.endDate, "yyyy-MM-dd");
                });

                return (
                  <Card key={gapKey} className="border-orange-200 bg-orange-50">
                    <CardHeader className="bg-orange-100">
                      <CardTitle className="flex items-center justify-between text-orange-800">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5" />
                          <span>Employment Gap Detected</span>
                        </div>
                        <div className="text-sm font-normal">
                          {gapInfo.gap.days} days ({format(gapInfo.gap.startDate, "dd/MM/yyyy")} - {format(gapInfo.gap.endDate, "dd/MM/yyyy")})
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {matchingGapIndex >= 0 ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`employmentGaps.${matchingGapIndex}.startDate`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Gap Start Date *</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="date" 
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`employmentGaps.${matchingGapIndex}.endDate`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Gap End Date *</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="date" 
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name={`employmentGaps.${matchingGapIndex}.reason`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Reason for Gap *</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Please explain the reason for this employment gap"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeGap(matchingGapIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Remove Gap Entry
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-orange-700 mb-3">
                            Please explain this employment gap of {gapInfo.gap.days} days
                          </p>
                          <Button
                            type="button"
                            onClick={() => {
                              appendGap({
                                startDate: format(gapInfo.gap.startDate, "yyyy-MM-dd"),
                                endDate: format(gapInfo.gap.endDate, "yyyy-MM-dd"),
                                reason: "",
                              });
                            }}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Gap Explanation
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addEmploymentEntry}
            className="w-full border-dashed border-2 border-primary text-primary hover:bg-orange-50"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Employment Entry
          </Button>
        </div>

        {/* Gap Detection Alert */}
        {potentialGaps.length > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="space-y-2">
                <p className="font-semibold">Employment gaps detected:</p>
                {potentialGaps.map((gapInfo, index) => (
                  <div key={index} className="text-sm">
                    Gap of {gapInfo.gap.days} days from{" "}
                    {format(gapInfo.gap.startDate, "dd/MM/yyyy")} to{" "}
                    {format(gapInfo.gap.endDate, "dd/MM/yyyy")}
                  </div>
                ))}
                <p className="text-sm mt-2">
                  Please add employment gap entries below to explain these periods.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Manual Add Employment Gap Button */}
        <Button
          type="button"
          variant="outline"
          onClick={addEmploymentGap}
          className="w-full border-dashed border-2 border-yellow-500 text-yellow-700 hover:bg-yellow-50"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Manual Employment Gap
        </Button>

        <div className="mt-8 flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back: Education
          </Button>
          
          <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
            {isSubmitting ? "Saving..." : "Next: Skills & Experience"}
          </Button>
        </div>
      </form>
    </Form>
  );
}