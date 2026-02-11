import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../layout/AuthLayout";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        setIsLoading(false);
        setIsSent(true);
    }, 1500);
  };

  return (
    <AuthLayout 
        title="Reset your password" 
        subtitle="Enter the email address associated with your account and we'll send you a link to reset your password."
    >
      {!isSent ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
                <Input 
                  label="School Email address" 
                  id="email" 
                  type="email" 
                  placeholder="name@school.edu"
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    Please use the academic email registered with your account.
                </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 font-bold bg-primary hover:bg-primary/90 text-white shadow-md transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Sending Instructions..." : "Send Reset Instructions"}
            </Button>
            
            <div className="text-center">
                 <Link to="/login" className="text-sm font-medium text-text-light dark:text-text-dark hover:text-primary transition-colors">
                    ← Back to Sign In
                </Link>
            </div>
          </form>
      ) : (
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
              </div>
              <h3 className="text-xl font-bold text-text-light dark:text-white">Check your email</h3>
              <p className="text-text-muted-light dark:text-text-muted-dark">
                  We have sent a password reset link to <span className="font-semibold text-text-light dark:text-white">{email}</span>.
              </p>
              <div className="pt-4">
                   <Link to="/login" className="text-sm font-bold text-primary hover:underline">
                    Skip, I'll log in with my password
                </Link>
              </div>
          </div>
      )}
    </AuthLayout>
  );
};
