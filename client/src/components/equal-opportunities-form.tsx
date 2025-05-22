import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Scale } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Create schema for the equal opportunities form
const equalOpportunitiesSchema = z.object({
  applicantId: z.number(),
  position: z.string().optional(),
  maritalStatus: z.string().optional(),
  gender: z.string().optional(),
  genderCustom: z.string().optional(),
  pronouns: z.string().optional(),
  sexualOrientation: z.string().optional(),
  sexualOrientationCustom: z.string().optional(),
  age: z.string().optional(),
  ethnicity: z.string().optional(),
  ethnicityCustomBlack: z.string().optional(),
  ethnicityCustomAsian: z.string().optional(),
  ethnicityCustomWhite: z.string().optional(),
  ethnicityCustomOther: z.string().optional(),
  religion: z.string().optional(),
  religionCustom: z.string().optional(),
});

type EqualOpportunitiesFormValues = z.infer<typeof equalOpportunitiesSchema>;

interface EqualOpportunitiesFormProps {
  applicantId: number;
  onSuccess: () => void;
  onBack: () => void;
}

export function EqualOpportunitiesForm({ applicantId, onSuccess, onBack }: EqualOpportunitiesFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Format the current date
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  // Set up the form
  const form = useForm<EqualOpportunitiesFormValues>({
    resolver: zodResolver(equalOpportunitiesSchema),
    defaultValues: {
      applicantId,
      position: "Foster Carer",
      maritalStatus: "",
      gender: "",
      genderCustom: "",
      pronouns: "",
      sexualOrientation: "",
      sexualOrientationCustom: "",
      age: "",
      ethnicity: "",
      ethnicityCustomBlack: "",
      ethnicityCustomAsian: "",
      ethnicityCustomWhite: "",
      ethnicityCustomOther: "",
      religion: "",
      religionCustom: "",
    },
  });
  
  // Create mutation for saving equal opportunities data
  const saveEqualOpportunities = useMutation({
    mutationFn: async (values: EqualOpportunitiesFormValues) => {
      const res = await apiRequest("POST", `/api/applicants/${applicantId}/equal-opportunities`, values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/applicants/${applicantId}`],
      });
    },
  });
  
  // Handle form submission
  async function onSubmit(values: EqualOpportunitiesFormValues) {
    setIsSubmitting(true);
    try {
      await saveEqualOpportunities.mutateAsync(values);
      
      toast({
        title: "Equal Opportunities Information Saved",
        description: "Thank you for providing this information. Your responses will be treated confidentially.",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const watchMaritalStatus = form.watch("maritalStatus");
  const watchGender = form.watch("gender");
  const watchEthnicity = form.watch("ethnicity");
  const watchSexualOrientation = form.watch("sexualOrientation");
  const watchReligion = form.watch("religion");
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <h3 className="text-3xl font-medium text-primary mb-6">Equal Opportunities Questionnaire</h3>
            
            <div className="space-y-6 mb-6">
              <p className="text-neutral-800">
                Swiis will ensure that no employee or prospective employee is subject to any form of discrimination on the grounds
                of age, disability, gender reassignment, marriage & civil partnership, race, religion, pregnancy & maternity,
                sex, sexual orientation.
              </p>
              
              <p className="text-neutral-800">
                Swiis is committed to the principle of Equal Opportunity in employment and pre-selects applicants only on the basis
                of their qualifications and experience. We would be grateful if you would complete and return this questionnaire to
                enable us to monitor our policy and assess our performance. This information will be detached from your application
                form and will be treated in the strictest of confidence.
              </p>
            </div>
            
            <div className="border-[1px] border-gray-300 mb-6">
              <div className="grid grid-cols-[200px_1fr] border-b-[1px] border-gray-300">
                <div className="p-4 border-r-[1px] border-gray-300 font-medium">Position applied for</div>
                <div className="p-4">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} className="border-0 shadow-none p-0 h-auto focus-visible:ring-0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-[200px_1fr]">
                <div className="p-4 border-r-[1px] border-gray-300 font-medium">Date of Completion</div>
                <div className="p-4">{currentDate}</div>
              </div>
            </div>
            
            <div className="p-4 border-[1px] border-gray-300 mb-6">
              <div className="mb-4">
                <p className="font-medium">Please tick the box that is appropriate to you:</p>
              </div>
              
              {/* Marital Status */}
              <div className="mb-6">
                <p className="font-medium mb-2">Please describe your Marital Status:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <FormField
                    control={form.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Single"}
                              onCheckedChange={() => form.setValue("maritalStatus", "Single")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Single</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Married"}
                              onCheckedChange={() => form.setValue("maritalStatus", "Married")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Married</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Civil Partnership"}
                              onCheckedChange={() => form.setValue("maritalStatus", "Civil Partnership")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Civil Partnership</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Divorced"}
                              onCheckedChange={() => form.setValue("maritalStatus", "Divorced")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Divorced</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Widowed"}
                              onCheckedChange={() => form.setValue("maritalStatus", "Widowed")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Widowed</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Separated"}
                              onCheckedChange={() => form.setValue("maritalStatus", "Separated")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Separated</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Prefer not to say"}
                              onCheckedChange={() => form.setValue("maritalStatus", "Prefer not to say")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Prefer not to say</FormLabel>
                        </FormItem>
                      </>
                    )}
                  />
                </div>
              </div>
              
              {/* Gender */}
              <div className="mb-6">
                <p className="font-medium mb-2">Gender</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Male"}
                              onCheckedChange={() => form.setValue("gender", "Male")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Male</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Female"}
                              onCheckedChange={() => form.setValue("gender", "Female")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Female</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Transgender"}
                              onCheckedChange={() => form.setValue("gender", "Transgender")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Transgender</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Male to Female"}
                              onCheckedChange={() => form.setValue("gender", "Male to Female")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Undergone, or undergoing, male to female gender reassignment</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Female to Male"}
                              onCheckedChange={() => form.setValue("gender", "Female to Male")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Undergone, or undergoing, female to male gender reassignment</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Non-binary"}
                              onCheckedChange={() => form.setValue("gender", "Non-binary")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Non-binary</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Prefer not to say"}
                              onCheckedChange={() => form.setValue("gender", "Prefer not to say")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Prefer not to say</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Other"}
                              onCheckedChange={() => form.setValue("gender", "Other")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Other (please specify)</FormLabel>
                        </FormItem>
                      </>
                    )}
                  />
                </div>
                
                {watchGender === "Other" && (
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="genderCustom"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Please specify" className="max-w-md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
              
              {/* Pronouns */}
              <div className="mb-6">
                <p className="font-medium mb-2">Pro nouns</p>
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="pronouns"
                    render={({ field }) => (
                      <>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "She/Her"}
                              onCheckedChange={() => form.setValue("pronouns", "She/Her")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">She/Her</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "He/Him"}
                              onCheckedChange={() => form.setValue("pronouns", "He/Him")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">He/Him</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Them/They"}
                              onCheckedChange={() => form.setValue("pronouns", "Them/They")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Them/They</FormLabel>
                        </FormItem>
                      </>
                    )}
                  />
                </div>
              </div>
              
              {/* Sexual Orientation */}
              <div className="mb-6">
                <p className="font-medium mb-2">Sexual Orientation</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="sexualOrientation"
                    render={({ field }) => (
                      <>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Prefer not to say"}
                              onCheckedChange={() => form.setValue("sexualOrientation", "Prefer not to say")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Prefer not to say</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Heterosexual"}
                              onCheckedChange={() => form.setValue("sexualOrientation", "Heterosexual")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Heterosexual</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Gay"}
                              onCheckedChange={() => form.setValue("sexualOrientation", "Gay")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Gay</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Lesbian"}
                              onCheckedChange={() => form.setValue("sexualOrientation", "Lesbian")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Lesbian</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Bisexual"}
                              onCheckedChange={() => form.setValue("sexualOrientation", "Bisexual")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Bisexual</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Other"}
                              onCheckedChange={() => form.setValue("sexualOrientation", "Other")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Other</FormLabel>
                        </FormItem>
                      </>
                    )}
                  />
                </div>
                
                {watchSexualOrientation === "Other" && (
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="sexualOrientationCustom"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Please specify" className="max-w-md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
              
              {/* Age */}
              <div className="mb-6">
                <p className="font-medium mb-2">Age</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "16 – 24"}
                              onCheckedChange={() => form.setValue("age", "16 – 24")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">16 – 24</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "25 – 34"}
                              onCheckedChange={() => form.setValue("age", "25 – 34")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">25 – 34</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "35 – 44"}
                              onCheckedChange={() => form.setValue("age", "35 – 44")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">35 – 44</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "45 – 54"}
                              onCheckedChange={() => form.setValue("age", "45 – 54")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">45 – 54</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "55 – 67"}
                              onCheckedChange={() => form.setValue("age", "55 – 67")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">55 – 67</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "67+"}
                              onCheckedChange={() => form.setValue("age", "67+")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">67+</FormLabel>
                        </FormItem>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
            
            {/* Ethnicity and Religion */}
            <div className="p-4 border-[1px] border-gray-300 mb-6">
              {/* Ethnicity */}
              <div className="mb-6">
                <p className="font-medium mb-4">Please state your ethnic group</p>
                
                <div className="grid gap-2">
                  <div className="grid grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Prefer not to say"}
                              onCheckedChange={() => form.setValue("ethnicity", "Prefer not to say")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Prefer not to say</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Black African"}
                              onCheckedChange={() => form.setValue("ethnicity", "Black African")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Black African</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Black Caribbean"}
                              onCheckedChange={() => form.setValue("ethnicity", "Black Caribbean")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Black Caribbean</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Black other"}
                              onCheckedChange={() => form.setValue("ethnicity", "Black other")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Black other</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {watchEthnicity === "Black other" && (
                    <div className="flex items-center ml-4 mb-2">
                      <span className="mr-2">Please state</span>
                      <FormField
                        control={form.control}
                        name="ethnicityCustomBlack"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} placeholder="Please specify" className="max-w-md" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Asian Bangladeshi"}
                              onCheckedChange={() => form.setValue("ethnicity", "Asian Bangladeshi")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Asian Bangladeshi</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Asian Indian"}
                              onCheckedChange={() => form.setValue("ethnicity", "Asian Indian")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Asian Indian</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Asian Pakistani"}
                              onCheckedChange={() => form.setValue("ethnicity", "Asian Pakistani")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Asian Pakistani</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Asian other"}
                              onCheckedChange={() => form.setValue("ethnicity", "Asian other")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Asian other</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {watchEthnicity === "Asian other" && (
                    <div className="flex items-center ml-4 mb-2">
                      <span className="mr-2">Please state</span>
                      <FormField
                        control={form.control}
                        name="ethnicityCustomAsian"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} placeholder="Please specify" className="max-w-md" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "White English"}
                              onCheckedChange={() => form.setValue("ethnicity", "White English")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">White English</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "White Irish"}
                              onCheckedChange={() => form.setValue("ethnicity", "White Irish")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">White Irish</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "White Northern Irish"}
                              onCheckedChange={() => form.setValue("ethnicity", "White Northern Irish")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">White Northern Irish</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "White Scottish"}
                              onCheckedChange={() => form.setValue("ethnicity", "White Scottish")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">White Scottish</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "White Welsh"}
                              onCheckedChange={() => form.setValue("ethnicity", "White Welsh")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">White Welsh</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "White Other"}
                              onCheckedChange={() => form.setValue("ethnicity", "White Other")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">White Other</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {watchEthnicity === "White Other" && (
                    <div className="flex items-center ml-4 mb-2">
                      <span className="mr-2">Please state</span>
                      <FormField
                        control={form.control}
                        name="ethnicityCustomWhite"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} placeholder="Please specify" className="max-w-md" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Mixed Parentage"}
                              onCheckedChange={() => form.setValue("ethnicity", "Mixed Parentage")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Mixed Parentage</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "White & Black African"}
                              onCheckedChange={() => form.setValue("ethnicity", "White & Black African")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">White & Black African</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "White & Black Caribbean"}
                              onCheckedChange={() => form.setValue("ethnicity", "White & Black Caribbean")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">White & Black Caribbean</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "White & Asian"}
                              onCheckedChange={() => form.setValue("ethnicity", "White & Asian")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">White & Asian</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Other ethnic group"}
                              onCheckedChange={() => form.setValue("ethnicity", "Other ethnic group")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Other ethnic group</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {watchEthnicity === "Other ethnic group" && (
                    <div className="flex items-center mb-2">
                      <span className="mr-2">Please state</span>
                      <FormField
                        control={form.control}
                        name="ethnicityCustomOther"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} placeholder="Please specify" className="max-w-md" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Religion or Faith */}
              <div className="pt-6 border-t border-gray-300">
                <p className="font-medium mb-4">Religion or Faith</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                  <FormField
                    control={form.control}
                    name="religion"
                    render={({ field }) => (
                      <>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Prefer not to say"}
                              onCheckedChange={() => form.setValue("religion", "Prefer not to say")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Prefer not to say</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Atheist"}
                              onCheckedChange={() => form.setValue("religion", "Atheist")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Atheist</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Agnostic"}
                              onCheckedChange={() => form.setValue("religion", "Agnostic")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Agnostic</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Buddhist"}
                              onCheckedChange={() => form.setValue("religion", "Buddhist")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Buddhist</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Baha'i"}
                              onCheckedChange={() => form.setValue("religion", "Baha'i")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Baha'i</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Catholic"}
                              onCheckedChange={() => form.setValue("religion", "Catholic")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Catholic</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Christian"}
                              onCheckedChange={() => form.setValue("religion", "Christian")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Christian</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Hindu"}
                              onCheckedChange={() => form.setValue("religion", "Hindu")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Hindu</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Muslim/Islam"}
                              onCheckedChange={() => form.setValue("religion", "Muslim/Islam")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Muslim/Islam</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Sikh"}
                              onCheckedChange={() => form.setValue("religion", "Sikh")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Sikh</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Jewish"}
                              onCheckedChange={() => form.setValue("religion", "Jewish")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Jewish</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Church of England/Protestant"}
                              onCheckedChange={() => form.setValue("religion", "Church of England/Protestant")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Church of England/Protestant</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Jehovah's Witness"}
                              onCheckedChange={() => form.setValue("religion", "Jehovah's Witness")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Jehovah's Witness</FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Other"}
                              onCheckedChange={() => form.setValue("religion", "Other")}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Other</FormLabel>
                        </FormItem>
                      </>
                    )}
                  />
                </div>
                
                {watchReligion === "Other" && (
                  <div className="flex items-center mb-4">
                    <span className="mr-2">Please state</span>
                    <FormField
                      control={form.control}
                      name="religionCustom"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} placeholder="Please specify" className="max-w-md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back to Declaration
          </Button>
          
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting
              </>
            ) : (
              "Submit Questionnaire"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}