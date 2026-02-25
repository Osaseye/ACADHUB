import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Mode: 'login' or 'register'
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [adminSecret, setAdminSecret] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        if (isLoginMode) {
            // LOGIN FLOW
            const userCredential = await login(email, password);
            const user = userCredential.user;
            
            // Verify Admin Role
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().role === 'admin') {
                toast.success("Admin Session Started");
                navigate("/admin/dashboard");
            } else {
                toast.error("Access Denied: Not an administrator account.");
                // Ensure we don't leave a session open for non-admins on this route if needed
            }
        } else {
            // REGISTER FLOW
            if (adminSecret !== "acadhub-admin-2024") {
                toast.error("Invalid Security Key");
                setIsLoading(false);
                return;
            }

            // Create user with admin role and skipped onboarding
            await register(email, password, 'admin', {
                displayName: displayName,
                onboardingCompleted: true,
                verificationStatus: 'verified',
                department: 'Administration',
                siteRole: 'super_admin'
            });

            toast.success("Root Admin Account Created");
            navigate("/admin/dashboard");
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message || "Authentication failed");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0d1117] overflow-hidden">
      
      {/* Left Panel - Admin Aesthetics */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-between p-12 text-white">
         <div className="absolute inset-0 overflow-hidden">
             {/* Abstract Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-600 blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-indigo-600 blur-3xl opacity-20"></div>
            
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         </div>

         <div className="relative z-10 flex items-center gap-3">
             <div className="h-10 w-10 bg-white/10 backdrop-blur rounded flex items-center justify-center border border-white/20">
                <img src="/icon.png" alt="AcadHub Logo" className="h-6 w-auto" />
             </div>
             <div>
                <span className="text-xl font-bold tracking-tight block">AcadHub</span>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">System Console</span>
             </div>
         </div>

         <div className="relative z-10 max-w-md">
            <h2 className="text-3xl font-bold mb-4 text-white">Restricted Environment</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
                You are accessing the administrative backend. All actions are logged and audited in compliance with institutional data governance policies.
            </p>
         </div>

         <div className="relative z-10 text-xs text-slate-500 font-mono">
            ID: SYS-NODE-01 // V4.2.0-secure
         </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
            <div className="w-full max-w-md space-y-8">
                
                {/* Mobile Header */}
                <div className="lg:hidden text-center mb-8">
                    <img src="/icon.png" alt="AcadHub" className="w-12 h-12 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AcadHub Admin</h2>
                </div>
                
                <div className="text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Admin Portal
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        {isLoginMode ? "Sign in to console" : "Initialize New Admin"}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {isLoginMode ? "Please enter your credentials to access the console." : "Create a root administrative account bypassing standard checks."}
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    
                    {!isLoginMode && (
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="displayName">
                                Display Name
                            </label>
                            <input 
                                id="displayName" 
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Admin Name"
                                className="block w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                                required={!isLoginMode} 
                            />
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="adminId">
                            Admin ID / Email
                        </label>
                        <div className="relative rounded-lg shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-400 text-[20px]">admin_panel_settings</span>
                            </div>
                            <input 
                                id="adminId" 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@acadhub.com"
                                className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                                required 
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                         <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
                                {isLoginMode ? "Secure Key" : "Set Password"}
                            </label>
                        </div>
                        <div className="relative rounded-lg shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••••••"
                                className="block w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {showPassword ? "visibility_off" : "visibility"}
                                </span>
                            </button>
                        </div>
                    </div>

                    {!isLoginMode && (
                        <div className="space-y-1.5 ">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="adminSecret">
                                Master Secret Key
                            </label>
                            <input 
                                id="adminSecret" 
                                type="password" 
                                value={adminSecret}
                                onChange={(e) => setAdminSecret(e.target.value)}
                                placeholder="Enter secret key..."
                                className="block w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
                                required={!isLoginMode} 
                            />
                             <p className="text-[10px] text-slate-500 mt-1">Dev Hint: acadhub-admin-2024</p>
                        </div>
                    )}

                    {/* Security Notice */}
                    {isLoginMode && (
                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg p-3 flex gap-3 items-start">
                            <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 text-[18px] mt-0.5 shrink-0">security</span>
                            <p className="text-xs text-amber-800 dark:text-amber-500 leading-relaxed font-medium">
                                <strong>Security Notice:</strong> Access restricted to authorized personnel only. All login attempts are monitored and logged.
                            </p>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#0f66bd] hover:bg-[#0a4a8c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Processing..." : (isLoginMode ? "Sign in to Console" : "Create Admin Account")}
                    </button>
                </form>

                 <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center space-y-3">
                    <button 
                         type="button"
                         onClick={() => setIsLoginMode(!isLoginMode)}
                         className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors w-full"
                    >
                        {isLoginMode ? "Need to create a Root Admin?" : "Have an account? Login here"}
                    </button>

                    <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center justify-center gap-1 group">
                        <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
                        Standard User? Return to main login
                    </Link>
                </div>
                
                 {/* Footer Info */}
                <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-600">
                    © 2026 AcadHub Research Systems.
                </p>
            </div>
      </div>
    </div>
  );
};
