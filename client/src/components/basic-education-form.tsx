import React, { useState } from "react";
import { GraduationCap, Loader2, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EducationEntry {
  institution: string;
  qualification: string;
  startDate: string;
  endDate: string;
  details: string;
}

interface EducationFormProps {
  applicantId: number;
  onSuccess: () => void;
  onBack: () => void;
}

export function EducationForm({ applicantId, onSuccess, onBack }: EducationFormProps) {
  const [entries, setEntries] = useState<EducationEntry[]>([{
    institution: "",
    qualification: "",
    startDate: "",
    endDate: "",
    details: ""
  }]);
  const [otherTraining, setOtherTraining] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Add new education entry
  const addEntry = () => {
    setEntries([...entries, {
      institution: "",
      qualification: "",
      startDate: "",
      endDate: "",
      details: ""
    }]);
  };

  // Remove education entry
  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      const newEntries = [...entries];
      newEntries.splice(index, 1);
      setEntries(newEntries);
    }
  };

  // Update education entry field
  const updateEntry = (index: number, field: keyof EducationEntry, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setEntries(newEntries);
    
    // Clear error for this field if it exists
    if (errors[`entries[${index}].${field}`]) {
      const newErrors = {...errors};
      delete newErrors[`entries[${index}].${field}`];
      setErrors(newErrors);
    }
  };

  // Validate the form
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    let isValid = true;

    entries.forEach((entry, index) => {
      if (!entry.institution) {
        newErrors[`entries[${index}].institution`] = "Institution is required";
        isValid = false;
      }
      if (!entry.qualification) {
        newErrors[`entries[${index}].qualification`] = "Qualification is required";
        isValid = false;
      }
      if (!entry.startDate) {
        newErrors[`entries[${index}].startDate`] = "Start date is required";
        isValid = false;
      }
      if (!entry.endDate) {
        newErrors[`entries[${index}].endDate`] = "End date is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit each education entry
      for (const entry of entries) {
        const formattedEntry = {
          applicantId,
          ...entry
        };
        
        // Use fetch to directly submit the data
        const response = await fetch(`/api/applicants/${applicantId}/education`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedEntry)
        });
        
        if (!response.ok) {
          throw new Error('Failed to save education entry');
        }
      }
      
      // Show success message
      alert('Education information saved successfully');
      
      // Call the success callback
      onSuccess();
    } catch (error) {
      console.error('Error submitting education form:', error);
      alert('Failed to save education information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-medium text-primary">Education History</h2>
          </div>
          <p className="text-sm text-neutral-700 mb-6">
            Please provide details of examination passes, qualifications obtained etc. You will be required to provide 
            proof of relevant professional qualifications. Please provide details in sequence with the most recent first. 
            Where you have had a break in your educational history, please give details.
          </p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        {entries.map((entry, index) => (
          <Card key={index} className="border-primary/10 mb-4">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-primary">Education Entry {index + 1}</h3>
                {entries.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => removeEntry(index)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor={`institution-${index}`}>School/College/University</Label>
                  <Input 
                    id={`institution-${index}`}
                    value={entry.institution}
                    onChange={(e) => updateEntry(index, "institution", e.target.value)}
                    placeholder="Institution name"
                  />
                  {errors[`entries[${index}].institution`] && (
                    <p className="text-sm text-red-500">{errors[`entries[${index}].institution`]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`qualification-${index}`}>Qualification/Subject</Label>
                  <Input 
                    id={`qualification-${index}`}
                    value={entry.qualification}
                    onChange={(e) => updateEntry(index, "qualification", e.target.value)}
                    placeholder="e.g., Bachelor's Degree, GCSE"
                  />
                  {errors[`entries[${index}].qualification`] && (
                    <p className="text-sm text-red-500">{errors[`entries[${index}].qualification`]}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                  <Input 
                    id={`startDate-${index}`}
                    type="date"
                    value={entry.startDate}
                    onChange={(e) => updateEntry(index, "startDate", e.target.value)}
                  />
                  {errors[`entries[${index}].startDate`] && (
                    <p className="text-sm text-red-500">{errors[`entries[${index}].startDate`]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`endDate-${index}`}>End Date</Label>
                  <Input 
                    id={`endDate-${index}`}
                    type="date"
                    value={entry.endDate}
                    onChange={(e) => updateEntry(index, "endDate", e.target.value)}
                  />
                  {errors[`entries[${index}].endDate`] && (
                    <p className="text-sm text-red-500">{errors[`entries[${index}].endDate`]}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`details-${index}`}>Additional Details</Label>
                <Textarea 
                  id={`details-${index}`}
                  value={entry.details}
                  onChange={(e) => updateEntry(index, "details", e.target.value)}
                  placeholder="Any additional information about this qualification"
                />
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button
          type="button"
          variant="outline"
          className="w-full mb-4"
          onClick={addEntry}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Education Entry
        </Button>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="otherTraining">Other relevant training courses</Label>
              <Textarea
                id="otherTraining"
                value={otherTraining}
                onChange={(e) => setOtherTraining(e.target.value)}
                placeholder="List any relevant training courses with the organizing body, course content, dates attended and qualifications (if applicable)"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back: Personal Info
          </Button>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              "Next: Employment History"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}