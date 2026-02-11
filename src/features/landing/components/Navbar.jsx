import React from "react";
import { Button } from "../../../components/ui/Button";
import { useTheme } from "../../../hooks/useTheme";

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#0d1117]/90 backdrop-blur-md border-b border-border-light dark:border-border-dark px-6 py-3">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a className="flex items-center gap-2 group" href="#">
            {/* Logo */}
            <div className="relative w-8 h-8 flex items-center justify-center">
                <img src="/icon.png" alt="AcadHub Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-text-light dark:text-white group-hover:text-primary transition-colors">
              AcadHub
            </span>
          </a>
          <div className="hidden md:flex gap-6 text-sm font-semibold text-text-light dark:text-text-dark">
            <a className="hover:text-primary transition-colors" href="#">Product</a>
            <a className="hover:text-primary transition-colors" href="#">Solutions</a>
            <a className="hover:text-primary transition-colors" href="#">Open Source</a>
            <a className="hover:text-primary transition-colors" href="#">Pricing</a>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-sm mx-8">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-[18px]">
                search
              </span>
            </div>
            <input
              className="block w-full pl-8 pr-3 py-1.5 border border-border-light dark:border-border-dark rounded-md leading-5 bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder-text-muted-light dark:placeholder-text-muted-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
              placeholder="Search or jump to..."
              type="text"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
              <span className="text-xs border border-border-light dark:border-border-dark rounded px-1.5 text-text-muted-light dark:text-text-muted-dark font-mono">
                /
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2 text-text-light dark:text-white hover:text-primary transition-colors rounded-full hover:bg-surface-light dark:hover:bg-surface-dark"
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined text-[20px]">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>
          <button className="hidden sm:flex text-sm font-semibold text-text-light dark:text-white hover:text-text-muted-light dark:hover:text-text-muted-dark transition-colors">
            Sign in
          </button>
           <Button variant="outline" size="small" className="text-gray-900 dark:text-gray-300 bg-transparent hover:bg-surface-light border-border-light">
             Sign up
           </Button>
        </div>
      </div>
    </nav>
  );
};

