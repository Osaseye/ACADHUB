import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";
import { AuthLayout } from "../layout/AuthLayout";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

// Flow Steps
const STEP_ROLE = "STEP_ROLE";
const STEP_ACCOUNT = "STEP_ACCOUNT";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(STEP_ROLE);
  const [selectedRole, setSelectedRole] = useState(""); // "student" | "lecturer"
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError("");
  };

  const validateEmail = (email) => {
    if (!email) return false;
    const academicDomains = [".edu", ".ac.", "school", "university"];
    return academicDomains.some((domain) => email.toLowerCase().includes(domain));
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setCurrentStep(STEP_ACCOUNT);
    setError(""); // Reset errors
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
     if (!validateEmail(formData.email)) {
      setError("Please use a valid school email address (.edu, .ac., etc.)");
      toast.error("Invalid Email Domain");
      return;
    }
    
    setIsLoading(true);

    try {
        await register(formData.email, formData.password, selectedRole, {
            displayName: formData.username,
            status: 'active',
            isVerified: false 
        });

        toast.success("Account created successfully!");
        
        // Redirect based on role
        if (selectedRole === "student") {
            // Pass email to onboarding for auto-fill
            navigate("/onboarding/student", { state: { email: formData.email } });
        } else if (selectedRole === "lecturer") {
             navigate("/onboarding/lecturer", { state: { email: formData.email } });
        } else {
            navigate("/dashboard"); 
        }
    } catch (err) {
        console.error("Registration Error", err);
        setError("Registration failed: " + err.message);
        toast.error("Account creation failed");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
        title={currentStep === STEP_ROLE ? "Join AcadHub" : `Create Account`}
        subtitle={
            currentStep === STEP_ROLE 
            ? "Choose your academic role to begin your journey." 
            : `${selectedRole === "student" ? "Students" : "Lecturers"} access specialized tools on AcadHub.`
        }
    >
      
      {/* STEP 1: ROLE SELECTION */}
      {currentStep === STEP_ROLE && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
             
             <button 
                onClick={() => handleRoleSelection("student")}
                className="w-full p-5 border rounded-2xl text-left transition-all group flex items-center gap-5 hover:border-primary hover:shadow-lg hover:shadow-primary/5 bg-white dark:bg-[#161b22] border-border-light dark:border-border-dark"
             >
                 <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <span className="material-symbols-outlined text-2xl">school</span>
                 </div>
                 <div>
                     <h3 className="text-lg font-bold text-text-light dark:text-white group-hover:text-primary transition-colors">I am a Student</h3>
                     <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                        Access research papers, upload thesis work, and view analytics.
                     </p>
                 </div>
                 <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="material-symbols-outlined text-primary">arrow_forward</span>
                 </div>
             </button>

             <button 
                onClick={() => handleRoleSelection("lecturer")}
                className="w-full p-5 border rounded-2xl text-left transition-all group flex items-center gap-5 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/5 bg-white dark:bg-[#161b22] border-border-light dark:border-border-dark"
             >
                 <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0 text-purple-600 dark:text-purple-400 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                    <span className="material-symbols-outlined text-2xl">person_raised_hand</span>
                 </div>
                 <div>
                     <h3 className="text-lg font-bold text-text-light dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">I am a Lecturer</h3>
                     <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                        Review submissions, track student progress, and mentor.
                     </p>
                 </div>
                 <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="material-symbols-outlined text-purple-600">arrow_forward</span>
                 </div>
             </button>
             
             <div className="mt-8 text-center text-sm text-text-light dark:text-text-dark">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-bold">
                  Sign in instead
                </Link>
             </div>
        </div>
      )}

      {/* STEP 2: ACCOUNT CREATION */}
      {currentStep === STEP_ACCOUNT && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
          <button
            onClick={() => setCurrentStep(STEP_ROLE)}
            className="mb-6 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary flex items-center gap-1 transition-colors"
           >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Role Selection
           </button>

          <form className="space-y-5" onSubmit={handleAccountSubmit}>
            <div className="space-y-1">
                <Input
                  label="School Email address"
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={error}
                  required
                  autoFocus
                />
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    Only <span className="font-semibold text-primary">.edu</span> or school-affiliated email domains are accepted.
                </p>
            </div>

            <Input
              label="Username"
              id="username"
              type="text"
              placeholder="Choose a unique username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />

            <div className="relative">
                 <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-text-light dark:text-text-dark">Post password</label>
                 </div>
                 <div className="relative">
                     <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d1117] border border-border-light dark:border-border-dark rounded-lg shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-light dark:text-white pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-white"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {showPassword ? "visibility_off" : "visibility"}
                        </span>
                    </button>
                 </div>
                 <p className="mt-2 text-xs text-text-muted-light dark:text-text-muted-dark flex items-center gap-1.5">
                     <span className="material-symbols-outlined text-[16px] text-green-500">check_circle</span>
                     Must be at least 8 characters.
                </p>
            </div>

            {/* Role Specific Extra Field or Info could go here */}
            {selectedRole === "lecturer" && (
                 <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex gap-3 text-sm text-text-light dark:text-text-dark">
                    <span className="material-symbols-outlined text-primary shrink-0">verified_user</span>
                    <div>
                        <span className="font-bold block mb-1 text-primary">Identity Verification</span>
                        We'll ask you to verify your institutional affiliation after this step.
                    </div>
                 </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 font-bold text-base bg-primary hover:bg-primary/90 text-white border-none shadow-md mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </>
              ) : "Create Account"}
            </Button>
            
          </form>

          <div className="mt-8 text-xs text-center text-text-muted-light dark:text-text-muted-dark leading-relaxed">
            By creating an account, you agree to the <a href="#" className="underline decoration-dotted hover:decoration-solid hover:text-primary">Terms of Service</a>. 
            We'll occasionally send you account-related emails.
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

