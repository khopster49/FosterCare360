import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

// Create a schema for the form based on the Swiis Application Form
const personalInfoSchema = z.object({
  // Position Applied For
  positionAppliedFor: z.string().min(1, { message: "Position applied for is required" }),
  
  // Personal Details
  title: z.string().min(1, { message: "Title is required" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  pronouns: z.string().optional(),
  otherNames: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  address: z.string().min(1, { message: "Address is required" }),
  postcode: z.string().min(1, { message: "Postcode is required" }),
  homePhone: z.string().optional(),
  mobilePhone: z.string().min(5, { message: "Mobile phone number is required" }),
  drivingLicence: z.boolean().default(false),
  
  // Right to work details
  nationality: z.string().min(1, { message: "Nationality is required" }),
  visaType: z.string().optional(),
  visaExpiry: z.string().optional(),
  niNumber: z.string().optional(),
  rightToWork: z.boolean().default(true),
  
  // DBS details
  dbsRegistered: z.boolean().default(false),
  dbsNumber: z.string().optional(),
  dbsIssueDate: z.string().optional(),
  
  // Additional field for document type
  workDocumentType: z.string().optional(),

  // How did you hear about us
  referralSource: z.string().optional(),

  // Professional Registration
  professionalRegNumber: z.string().optional(),
  professionalRegExpiry: z.string().optional()
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  applicantId?: number;
  onSuccess: (data: any) => void;
}

export function PersonalInfoForm({ applicantId, onSuccess }: PersonalInfoFormProps) {
  const { toast } = useToast();
  const [workDocumentFile, setWorkDocumentFile] = useState<File | null>(null);
  
  // Set up the form with localStorage data
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      positionAppliedFor: "",
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      pronouns: "",
      otherNames: "",
      email: "",
      address: "",
      postcode: "",
      homePhone: "",
      mobilePhone: "",
      drivingLicence: false,
      nationality: "",
      visaType: "",
      visaExpiry: "",
      niNumber: "",
      rightToWork: true,
      dbsRegistered: false,
      dbsNumber: "",
      dbsIssueDate: "",
      workDocumentType: "",
      referralSource: "",
      professionalRegNumber: "",
      professionalRegExpiry: ""
    },
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('personalInfo');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      form.reset(parsedData);
    }
  }, [form]);
  
  // Save to localStorage instead of API
  const saveToLocalStorage = (values: PersonalInfoFormValues) => {
    try {
      localStorage.setItem('personalInfo', JSON.stringify(values));
      toast({
        title: "Personal information saved",
        description: "Your personal information has been saved successfully.",
      });
      onSuccess({ id: 1, ...values }); // Mock response for compatibility
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save personal information. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle form submission
  function onSubmit(values: PersonalInfoFormValues) {
    saveToLocalStorage(values);
  }
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setWorkDocumentFile(file);
    
    // Save file name to localStorage so we can show it was uploaded
    if (file) {
      localStorage.setItem('workDocumentFileName', file.name);
    }
  };

  // Load saved file name on component mount
  useEffect(() => {
    const savedFileName = localStorage.getItem('workDocumentFileName');
    if (savedFileName) {
      // Create a mock file object to show the name
      const mockFile = new File([''], savedFileName, { type: 'application/pdf' });
      setWorkDocumentFile(mockFile);
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* POSITION APPLIED FOR SECTION */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-lg font-bold text-primary">Position Applied For</h3>
            <Separator className="flex-1" />
          </div>

          <FormField
            control={form.control}
            name="positionAppliedFor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position Applied For</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter the position you are applying for" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* PERSONAL DETAILS SECTION */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-lg font-bold text-primary">Personal Details</h3>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Title</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select title" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mr">Mr</SelectItem>
                      <SelectItem value="mrs">Mrs</SelectItem>
                      <SelectItem value="miss">Miss</SelectItem>
                      <SelectItem value="ms">Ms</SelectItem>
                      <SelectItem value="dr">Dr</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Pronouns */}
            <FormField
              control={form.control}
              name="pronouns"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Pronouns</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pronouns" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="she/her">She/Her</SelectItem>
                      <SelectItem value="he/him">He/Him</SelectItem>
                      <SelectItem value="they/them">They/Them</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Middle Name */}
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name(s)</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surname</FormLabel>
                  <FormControl>
                    <Input placeholder="Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Other Names */}
            <FormField
              control={form.control}
              name="otherNames"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Have you ever been known by any other name?</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter previous names if applicable" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Permanent Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="123 Main Street, City" {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Postcode */}
            <FormField
              control={form.control}
              name="postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Code</FormLabel>
                  <FormControl>
                    <Input placeholder="SW1A 1AA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Home Phone */}
            <FormField
              control={form.control}
              name="homePhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home Telephone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="020 XXXX XXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Mobile Phone */}
            <FormField
              control={form.control}
              name="mobilePhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Telephone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="07XX XXX XXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.smith@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Driving License */}
            <FormField
              control={form.control}
              name="drivingLicence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you hold a full current driving licence?</FormLabel>
                  <FormControl>
                    <RadioGroup 
                      onValueChange={(value) => field.onChange(value === "yes")}
                      defaultValue={field.value ? "yes" : "no"}
                      className="flex items-center space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="driving-yes" />
                        <FormLabel htmlFor="driving-yes" className="font-normal">Yes</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="driving-no" />
                        <FormLabel htmlFor="driving-no" className="font-normal">No</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Referral Source */}
            <FormField
              control={form.control}
              name="referralSource"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>How did you hear about us?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Please let us know how you found out about this opportunity" {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* DBS SECTION */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-lg font-bold text-primary">DBS Registration</h3>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dbsRegistered"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Are you registered with the Disclosure and Barring Scheme Update Service, or the Protecting Vulnerable Groups Scheme in Scotland?</FormLabel>
                  <FormControl>
                    <RadioGroup 
                      onValueChange={(value) => field.onChange(value === "yes")}
                      defaultValue={field.value ? "yes" : "no"}
                      className="flex items-center space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="dbs-reg-yes" />
                        <FormLabel htmlFor="dbs-reg-yes" className="font-normal">Yes</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="dbs-reg-no" />
                        <FormLabel htmlFor="dbs-reg-no" className="font-normal">No</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("dbsRegistered") && (
              <>
                <FormField
                  control={form.control}
                  name="dbsNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DBS/PVG Certificate or Membership Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your DBS/PVG number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dbsIssueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Issue</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        </div>

        {/* RIGHT TO WORK SECTION */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-lg font-bold text-primary">Right to Work in the United Kingdom</h3>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="british">British</SelectItem>
                      <SelectItem value="irish">Irish</SelectItem>
                      <SelectItem value="other_eu">Other EU</SelectItem>
                      <SelectItem value="other_non_eu">Other (Non-EU)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rightToWork"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you have the right to work in the United Kingdom?</FormLabel>
                  <FormControl>
                    <RadioGroup 
                      onValueChange={(value) => field.onChange(value === "yes")}
                      value={field.value ? "yes" : "no"}
                      className="flex items-center space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="rtw-yes" />
                        <FormLabel htmlFor="rtw-yes" className="font-normal">Yes</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="rtw-no" />
                        <FormLabel htmlFor="rtw-no" className="font-normal">No</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!form.watch("nationality").includes("british") && (
              <>
                <FormField
                  control={form.control}
                  name="visaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>For non-British/EU nationals – Type of Visa held</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter visa type" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="visaExpiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visa Expiry Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="niNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>National Insurance Number</FormLabel>
                  <FormControl>
                    <Input placeholder="AB123456C" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              
            <FormField
              control={form.control}
              name="workDocumentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proof of Right to Work</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="passport_uk">UK Passport</SelectItem>
                      <SelectItem value="brp">Biometric Residence Permit</SelectItem>
                      <SelectItem value="birth_certificate">UK Birth Certificate with NI</SelectItem>
                      <SelectItem value="immigration_status">Immigration Status Document</SelectItem>
                      <SelectItem value="other">Other document</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-4">
            <FormLabel htmlFor="workDocument">Upload Right to Work Document</FormLabel>
            <div className="flex items-center justify-center w-full mt-1">
              <label
                htmlFor="workDocument"
                className="flex flex-col items-center justify-center w-full h-24 border-2 border-neutral-200 border-dashed rounded-lg cursor-pointer bg-neutral-50 hover:bg-neutral-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="text-neutral-400 mb-1 h-5 w-5" />
                  <p className="mb-1 text-sm text-neutral-700">
                    <span className="font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-neutral-500">PDF, JPG, or PNG (max. 5MB)</p>
                </div>
                <input
                  id="workDocument"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {workDocumentFile && (
              <p className="text-sm text-green-600 mt-2">
                File selected: {workDocumentFile.name}
              </p>
            )}
          </div>
        </div>

        {/* PROFESSIONAL REGISTRATION */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-lg font-bold text-primary">Professional Registration</h3>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="professionalRegNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HCPC/SSSC/NMC/SWE Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter registration number if applicable" {...field} />
                  </FormControl>
                  <FormDescription>
                    Leave blank if not applicable
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="professionalRegExpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HCPC/SSSC/NMC/SWE Number Expiry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    Leave blank if not applicable
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            Next: Education History
          </Button>
        </div>
      </form>
    </Form>
  );
}
