import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

// Create a schema for the form
const personalInfoSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(5, { message: "Phone number is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  postcode: z.string().min(1, { message: "Postcode is required" }),
  nationality: z.string().min(1, { message: "Nationality is required" }),
  rightToWork: z.boolean(),
  workDocumentType: z.string().min(1, { message: "Document type is required" }),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  onSuccess: (data: any) => void;
}

export function PersonalInfoForm({ onSuccess }: PersonalInfoFormProps) {
  const { toast } = useToast();
  const [workDocumentFile, setWorkDocumentFile] = useState<File | null>(null);
  
  // Set up the form
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postcode: "",
      nationality: "",
      rightToWork: true,
      workDocumentType: "",
    },
  });
  
  // Create applicant mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: PersonalInfoFormValues) => {
      const res = await apiRequest("POST", "/api/applicants", values);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Personal information saved",
        description: "Your personal information has been saved successfully.",
      });
      onSuccess(data);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save personal information. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  function onSubmit(values: PersonalInfoFormValues) {
    mutate(values);
  }
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setWorkDocumentFile(file);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="07XX XXX XXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="London" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="postcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postcode</FormLabel>
                <FormControl>
                  <Input placeholder="SW1A 1AA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Nationality</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          
          {/* Right to work section */}
          <div className="col-span-full mb-4">
            <h3 className="text-lg font-medium mb-3">Right to Work in the UK</h3>
            <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-md">
              <FormField
                control={form.control}
                name="rightToWork"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Do you have the right to work in the UK?</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={(value) => field.onChange(value === "yes")}
                        defaultValue={field.value ? "yes" : "no"}
                        className="flex items-center space-x-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="yes" />
                          <FormLabel htmlFor="yes" className="font-normal">Yes</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="no" />
                          <FormLabel htmlFor="no" className="font-normal">No</FormLabel>
                        </div>
                      </RadioGroup>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              
              <div className="mt-3">
                <FormLabel htmlFor="workDocument">Upload Document</FormLabel>
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
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              "Next: Education History"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
