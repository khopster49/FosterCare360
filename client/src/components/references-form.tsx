import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BadgeCheck, FileCheck, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useReferences } from "@/hooks/use-references";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Create schema for the form
const referenceConsentSchema = z.object({
  applicantId: z.number(),
  consent: z.boolean().refine(value => value === true, {
    message: "You must provide consent to proceed",
  }),
  signatureType: z.enum(["draw", "upload"]),
  signatureData: z.string().optional(),
  signatureFile: z.string().optional(),
}).refine(data => {
  if (data.consent) {
    if (data.signatureType === "draw") {
      return data.signatureData && data.signatureData.length > 0;
    } else if (data.signatureType === "upload") {
      return data.signatureFile && data.signatureFile.length > 0;
    }
  }
  return true;
}, {
  message: "Please provide your signature to confirm consent",
  path: ["signatureType"]
});

type ReferenceConsentValues = z.infer<typeof referenceConsentSchema>;

interface ReferencesFormProps {
  applicantId: number;
  onSuccess: () => void;
  onBack: () => void;
}

export function ReferencesForm({ applicantId, onSuccess, onBack }: ReferencesFormProps) {
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [employmentEntries, setEmploymentEntries] = useState([]);

  // Signature canvas functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    // Save signature data
    const canvas = canvasRef.current;
    if (canvas) {
      const signatureData = canvas.toDataURL();
      form.setValue('signatureData', signatureData);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        form.setValue('signatureData', '');
      }
    }
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);
  
  // Load employment entries from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`employment_${applicantId}`);
      if (saved) {
        const data = JSON.parse(saved);
        setEmploymentEntries(data.employmentEntries || []);
      }
    } catch (error) {
      console.warn('Failed to load employment data:', error);
    }
  }, [applicantId]);

  // Use the references hook to determine required references
  const { requiredReferences } = useReferences(employmentEntries);

  // Gap detection function
  const detectEmploymentGaps = (entries: any[]) => {
    if (entries.length < 2) return [];

    const validEntries = entries
      .filter(entry => entry.startDate && (entry.endDate || entry.isCurrent))
      .map(entry => ({
        ...entry,
        startDate: new Date(entry.startDate),
        endDate: entry.isCurrent ? new Date() : new Date(entry.endDate),
      }))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    const gaps = [];
    
    for (let i = 0; i < validEntries.length - 1; i++) {
      const currentEnd = validEntries[i].endDate;
      const nextStart = validEntries[i + 1].startDate;
      
      const gapDays = Math.floor((nextStart.getTime() - currentEnd.getTime()) / (1000 * 60 * 60 * 24)) - 1;
      
      if (gapDays > 0) {
        gaps.push({
          startDate: new Date(currentEnd.getTime() + 24 * 60 * 60 * 1000),
          endDate: new Date(nextStart.getTime() - 24 * 60 * 60 * 1000),
          days: gapDays,
          afterEmployer: validEntries[i].employer,
          beforeEmployer: validEntries[i + 1].employer,
        });
      }
    }
    
    return gaps;
  };

  const employmentGaps = detectEmploymentGaps(employmentEntries);
  
  // Set up the form
  const form = useForm<ReferenceConsentValues>({
    resolver: zodResolver(referenceConsentSchema),
    defaultValues: {
      applicantId,
      consent: false,
      signatureType: "draw",
      signatureData: "",
      signatureFile: "",
    },
  });
  
  // Save references to localStorage
  const saveReferences = (references: any[]) => {
    try {
      localStorage.setItem(`references_${applicantId}`, JSON.stringify(references));
    } catch (error) {
      console.warn('Failed to save references data:', error);
    }
  };
  
  // Handle form submission
  async function onSubmit(values: ReferenceConsentValues) {
    setProcessing(true);
    try {
      // Save reference consent and data to localStorage
      const referenceData = requiredReferences.map(reference => ({
        applicantId,
        name: reference.referenceName,
        email: reference.referenceEmail,
        phone: reference.referencePhone,
        employer: reference.employer,
        employerAddress: reference.employerAddress || '',
        position: reference.position,
        consentGiven: true,
        requestedAt: new Date().toISOString()
      }));
      
      saveReferences(referenceData);
      
      toast({
        title: "References Consent Recorded",
        description: "Your consent for reference requests has been recorded successfully.",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save reference information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-medium text-primary">References</h3>
            </div>
            <p className="text-sm text-neutral-600 mb-4">
              As part of the fostering application process and in accordance with Schedule 1 of the UK fostering regulations,
              we are required to obtain references from current and previous employers, and from all roles where you worked with 
              children or vulnerable adults.
            </p>
            <p className="text-sm text-neutral-600 mb-4">
              Below are the references that will be requested based on the employment history you provided.
              Each reference is mandatory for compliance with fostering regulations.
            </p>
          </CardContent>
        </Card>
        
        {requiredReferences.length === 0 ? (
          <Card className="border-amber-300">
            <CardContent className="pt-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800 mb-1">No Employment History Found</h4>
                <p className="text-sm text-amber-700">
                  Please go back to the Employment History section and add your employment details. 
                  We need this information to request appropriate references for your fostering application.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium text-primary">Employment History Timeline</h3>
              <Separator className="flex-1" />
            </div>
            
            {/* Sort employment entries with current employer first, then reverse chronological */}
            {(() => {
              const sortedEntries = employmentEntries
                .slice()
                .sort((a, b) => {
                  // Current employer always comes first
                  if (a.isCurrent && !b.isCurrent) return -1;
                  if (!a.isCurrent && b.isCurrent) return 1;
                  
                  // If both current or both not current, sort by most recent first
                  const dateA = a.isCurrent ? new Date() : new Date(a.endDate || a.startDate || '1900-01-01');
                  const dateB = b.isCurrent ? new Date() : new Date(b.endDate || b.startDate || '1900-01-01');
                  return dateB.getTime() - dateA.getTime();
                });

              const timelineItems = [];
              
              sortedEntries.forEach((employment: any, index: number) => {
                // Add employment entry
                timelineItems.push(
                  <Card key={`employment-${index}`} className="border-primary/10 overflow-hidden">
                    <div className="bg-primary/5 px-6 py-3 flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-medium text-primary">
                          {employment.employer}
                        </h4>
                        <p className="text-sm text-primary/70">{employment.position}</p>
                      </div>
                      <div className="flex gap-2">
                        {employment.isCurrent && (
                          <Badge className="bg-primary text-white">Current</Badge>
                        )}
                        {employment.workedWithVulnerable && (
                          <Badge variant="outline" className="border-amber-500 text-amber-700 bg-amber-50">
                            Vulnerable Adults/Children
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <CardContent className="pt-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Employment Dates */}
                        <div>
                          <p className="text-sm font-medium text-neutral-700 mb-2">Employment Period</p>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Start Date:</span> {employment.startDate ? new Date(employment.startDate).toLocaleDateString('en-GB') : 'Not provided'}</p>
                            <p><span className="font-medium">End Date:</span> {employment.isCurrent ? 'Current Position' : (employment.endDate ? new Date(employment.endDate).toLocaleDateString('en-GB') : 'Not provided')}</p>
                            {employment.reasonForLeaving && (
                              <p><span className="font-medium">Reason for Leaving:</span> {employment.reasonForLeaving}</p>
                            )}
                          </div>
                        </div>

                        {/* Reference Contact Details */}
                        <div>
                          <p className="text-sm font-medium text-neutral-700 mb-2">Reference Contact (Line Manager/Manager)</p>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Name:</span> {employment.referenceName || 'Not provided'}</p>
                            <p><span className="font-medium">Email:</span> {employment.referenceEmail || 'Not provided'}</p>
                            <p><span className="font-medium">Phone:</span> {employment.referencePhone || 'Not provided'}</p>
                          </div>
                        </div>

                        {/* Employer Details */}
                        <div>
                          <p className="text-sm font-medium text-neutral-700 mb-2">Employer Details</p>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Address:</span> {employment.employerAddress || 'Not provided'}</p>
                            <p><span className="font-medium">Postcode:</span> {employment.employerPostcode || 'Not provided'}</p>
                            <p><span className="font-medium">Phone:</span> {employment.employerPhone || 'Not provided'}</p>
                            <p><span className="font-medium">Mobile:</span> {employment.employerMobile || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );

              });

              return timelineItems;
            })()}


          </div>
        )}
        
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-md font-medium text-primary">Reference Consent</h3>
              <Separator className="flex-1" />
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-neutral-700">I understand and agree that:</p>
              
              <ul className="list-disc pl-5 mb-4 text-sm text-neutral-700 space-y-2">
                <li>References will be sought from my current and previous employers as listed above.</li>
                <li>Additional references will be sought from all roles where I worked with children or vulnerable adults.</li>
                <li>Reference requests will be sent automatically via email to the addresses I have provided.</li>
                <li>After receiving written references, the organization will conduct follow-up telephone verification calls with the referees.</li>
                <li>The information obtained through references will be used as part of the fostering assessment process in line with Schedule 1 of the UK fostering regulations.</li>
              </ul>
              
              <FormField
                control={form.control}
                name="consent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-primary/5 p-4 rounded-md border border-primary/10">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-2">
                      <FormLabel className="font-medium">
                        I consent to references being sought as described above
                      </FormLabel>
                      <FormDescription className="text-sm">
                        This consent is required to proceed with your fostering application according to UK regulations.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              {/* Signature Section - Only show when consent is checked */}
              {form.watch("consent") && (
                <div className="mt-6 p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <h4 className="font-medium text-orange-800 mb-4">Digital Signature Required</h4>
                  
                  <FormField
                    control={form.control}
                    name="signatureType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Choose signature method:</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="draw" id="draw" />
                              <Label htmlFor="draw">Draw my signature</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="upload" id="upload" />
                              <Label htmlFor="upload">Upload signature file</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("signatureType") === "draw" && (
                    <div className="mt-4">
                      <FormLabel>Draw your signature below:</FormLabel>
                      <div className="mt-2 border border-orange-300 rounded-lg p-4 bg-white">
                        <canvas
                          ref={canvasRef}
                          width={400}
                          height={150}
                          className="border border-gray-300 rounded cursor-crosshair w-full"
                          style={{ touchAction: 'none' }}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                        />
                        <div className="mt-2 flex justify-between items-center">
                          <p className="text-sm text-gray-600">
                            Sign using your mouse or touch device
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={clearSignature}
                            className="text-orange-600 border-orange-300 hover:bg-orange-50"
                          >
                            Clear Signature
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-orange-700 mt-2">
                        Your signature confirms your consent and is legally binding for this application.
                      </p>
                    </div>
                  )}
                  
                  {form.watch("signatureType") === "upload" && (
                    <FormField
                      control={form.control}
                      name="signatureFile"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Upload signature file:</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  field.onChange(file.name);
                                }
                              }}
                              className="border-orange-300 focus:border-orange-500"
                            />
                          </FormControl>
                          <FormDescription>
                            Upload an image or PDF file containing your signature.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <p className="text-xs text-orange-700 mt-3">
                    Your signature confirms your consent and is legally binding for this application.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back: Employment History
          </Button>
          
          <Button 
            type="submit" 
            disabled={processing || requiredReferences.length === 0}
            className="bg-primary hover:bg-primary/90"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              "Next: Disciplinary & Criminal Issues"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
