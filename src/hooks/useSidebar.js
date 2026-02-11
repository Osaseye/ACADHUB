import { useState, useEffect } from 'react';

export const useSidebar = () => {
    // Determine screen size function
    const isMobile = () => window.innerWidth < 768; // 768px is md breakpoint

    // Initial state: 
    // On Mobile: Default to CLOSED (isCollapsed = true) - using 'collapsed' to mean hidden
    // On Desktop: Default to OPEN (isCollapsed = false)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(isMobile());
    
    // We also need to track if we are in mobile mode itself, to allow the component to render differently
    const [isMobileMode, setIsMobileMode] = useState(isMobile());

    useEffect(() => {
        const handleResize = () => {
             const mobile = isMobile();
             setIsMobileMode(mobile);
             if (mobile) {
                 // Force collapse/hide on resize to small if not already
                 // But better to just update mode.
             }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return { 
        isSidebarCollapsed, 
        toggleSidebar,
        isMobileMode,
        setIsSidebarCollapsed
    };
};
