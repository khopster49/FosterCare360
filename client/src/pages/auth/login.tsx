import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@shared/schema";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false);
  
  // Check URL params for verified=true
  const params = new URLSearchParams(window.location.search);
  if (params.get("verified") === "true" && !showVerifiedMessage) {
    setShowVerifiedMessage(true);
  }

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      return await apiRequest("/api/auth/login", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Login Successful",
        description: "You have been logged in successfully.",
      });
      setLocation("/dashboard?welcome=true");
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Log in to Your Account</CardTitle>
            <CardDescription className="text-center">
              Continue your fostering application
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {showVerifiedMessage && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <AlertDescription className="text-green-700">
                  Your email has been verified successfully. You can now log in.
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password">
                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                      Forgot password?
                    </span>
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Don't have an account? {" "}
              <Link href="/auth/register">
                <span className="text-blue-600 hover:underline cursor-pointer">
                  Register
                </span>
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}