import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { useTheme } from "../../../hooks/useTheme";

const navItems = [
  { label: "Product", href: "#product" },
  { label: "Solutions", href: "#solutions" },
  { label: "Open Source", href: "#open-source" },
  { label: "Pricing", href: "#pricing" },
];

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Handle active active section state on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Background blur toggle
      setScrolled(window.scrollY > 20);

      // Active section detection
      const sections = navItems.map(item => item.href.substring(1));
      let current = "";

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
           const rect = element.getBoundingClientRect();
           // If section top is near the top of viewport (e.g., within 150px)
           // OR if we are deep inside the section
           if (rect.top <= 150 && rect.bottom >= 150) {
             current = sectionId;
           }
        }
      }
      setActiveSection("#" + current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Offset for sticky header
        behavior: "smooth"
      });
      setActiveSection(href);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 dark:bg-[#0d1117]/90 backdrop-blur-md border-b border-border-light dark:border-border-dark shadow-sm" : "bg-transparent border-b border-transparent py-4"}`}>
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-6">
          <a className="flex items-center gap-2 group" href="#">
            {/* Logo */}
            <div className="relative w-8 h-8 flex items-center justify-center">
                <img src="/icon.png" alt="AcadHub Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-text-light dark:text-white group-hover:t ext-primary transition-colors">
              AcadHub
            </span>
          </a>
          <div className="hidden md:flex gap-6 text-sm font-semibold text-text-light dark:text-text-dark">
            {navItems.map((item) => (
               <a 
                 key={item.label}
                 href={item.href}
                 onClick={(e) => handleNavClick(e, item.href)}
                 className={`relative py-1 transition-colors hover:text-primary ${activeSection === item.href ? "text-primary" : ""}`}
               >
                 {item.label}
                 {activeSection === item.href && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full transition-all duration-300" />
                 )}
               </a>
            ))}
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
          <Link to="/login" className="hidden sm:flex text-sm font-semibold text-text-light dark:text-white hover:text-text-muted-light dark:hover:text-text-muted-dark transition-colors">
            Sign in
          </Link>
          <Link to="/register">
             <Button variant="outline" size="small" className="text-gray-900 bg-transparent dark:text-white hover:bg-surface-light border-border-light">
               Sign up
             </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

