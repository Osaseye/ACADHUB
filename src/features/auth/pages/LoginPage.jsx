import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";
import { AuthLayout } from "../layout/AuthLayout";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const userCredential = await login(email, password);
      const user = userCredential.user;

      // Fetch role directly to determine redirect
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
          const role = docSnap.data().role;
          toast.success("Welcome back!");
          
          if (role === 'lecturer') {
              navigate("/lecturer/dashboard");
          } else if (role === 'admin') {
              navigate("/admin/dashboard");
          } else {
              navigate("/dashboard");
          }
      } else {
          // Fallback if no user doc (shouldn't happen for valid users)
          navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Invalid credentials");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
        title="Welcome back" 
        subtitle="Sign in to your academic workspace to continue."
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input 
          label="School Email address" 
          id="identity" 
          type="email" 
          placeholder="Enter your academic email"
          required 
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <div className="relative">
             <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-text-light dark:text-text-dark">
                    Password
                </label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                    Forgot password?
                </Link>
             </div>
             <div className="relative">
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
        </div>

        <Button 
          type="submit" 
          className="w-full h-11 font-bold text-base bg-primary hover:bg-primary/90 text-white border-none shadow-md transition-all flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
             <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing in...
             </>
          ) : "Sign in"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
          New to AcadHub?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

