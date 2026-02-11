import React from "react";
import { Link } from "react-router-dom";

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="h-screen flex bg-white dark:bg-[#0d1117] transition-colors duration-300 overflow-hidden">
      {/* Left Component: Product Showcase / Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Image and Overlay */}
        <div className="absolute inset-0 z-0">
             <img 
                src="/login.jpg" 
                alt="Background" 
                className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        </div>
        
        {/* Top Left: Logo */}
        <div className="relative z-10 flex items-center gap-3">
             <img src="/icon.png" alt="AcadHub Logo" className="w-10 h-10 object-contain" />
             <span className="text-2xl font-bold text-white tracking-tight">AcadHub</span>
        </div>

        {/* Bottom: Quote */}
        <div className="relative z-10 max-w-xl">
            <blockquote className="text-3xl font-medium text-white leading-tight">
              "The intelligent research repository for the next generation of scholars."
            </blockquote>
        </div>
      </div>

      {/* Right Component: Auth Form */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto no-scrollbar flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white dark:bg-[#0d1117]">
        <style>{`
            .no-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}</style>
        <div className="w-full max-w-[420px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 my-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
                 <img src="/icon.png" alt="AcadHub" className="w-12 h-12 mx-auto" />
                 <h2 className="text-2xl font-bold text-text-light dark:text-white mt-2">AcadHub</h2>
            </div>


            <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-text-light dark:text-white">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-3 text-base text-text-muted-light dark:text-text-muted-dark">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="mt-8">
                {children}
            </div>

             <div className="pt-8 border-t border-border-light dark:border-border-dark mt-8 text-center lg:text-left">
                <div className="text-xs text-text-muted-light dark:text-text-muted-dark flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <span>© 2026 AcadHub Inc.</span>
                    <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms</a>
                    <a href="#" className="hover:text-primary transition-colors">Help</a>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
