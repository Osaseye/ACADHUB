import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

export const Sidebar = ({ isCollapsed, toggleSidebar, role = 'student' }) => {
    const navigate = useNavigate();

    const studentItems = [
        { icon: "dashboard", label: "Dashboard", path: "/dashboard" },
        { icon: "folder_open", label: "Repository", path: "/repository" },
        { icon: "cloud_upload", label: "My Uploads", path: "/uploads" },
        { icon: "trending_up", label: "Trends", path: "/analytics" },
        { icon: "bookmark_border", label: "Saved", path: "/saved" },
        { icon: "notifications", label: "Notifications", path: "/notifications" },
        { icon: "settings", label: "Settings", path: "/settings" },
    ];

    const lecturerItems = [
        { icon: "dashboard", label: "Dashboard", path: "/lecturer/dashboard" },
        { icon: "supervisor_account", label: "Supervision", path: "/lecturer/supervision" },
        { icon: "library_books", label: "My Publications", path: "/lecturer/publications" },
        { icon: "folder_open", label: "Repository", path: "/lecturer/repository" },
        { icon: "trending_up", label: "Dept. Analytics", path: "/lecturer/analytics" },
        { icon: "notifications", label: "Notifications", path: "/lecturer/notifications" },
        { icon: "settings", label: "Settings", path: "/lecturer/settings" },
    ];

    const navItems = role === 'lecturer' ? lecturerItems : studentItems;

    return (
        <aside 
            className={`
                flex-shrink-0 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex flex-col transition-all duration-300 ease-in-out h-screen sticky top-0
                ${isCollapsed ? "w-20" : "w-64"}
            `}
        >
            {/* Header */}
            <div className="h-16 flex items-center px-4 border-b border-border-light dark:border-border-dark justify-between">
                <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? "justify-center w-full" : ""}`}>
                     {/* Using the logo directly logic */}
                     <Link to="/" className="h-8 w-8 relative flex-shrink-0 flex items-center justify-center">
                        <img src="/icon.png" alt="AcadHub" className="h-8 w-full object-contain" />
                     </Link>
                     {!isCollapsed && (
                        <span className="font-bold text-xl tracking-tight text-[#0d306b] dark:text-white whitespace-nowrap">
                            Acad<span className="text-[#009ac7]">Hub</span>
                        </span>
                     )}
                </div>
                {!isCollapsed && (
                     <button onClick={toggleSidebar} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <span className="material-symbols-outlined text-xl">chevron_left</span>
                     </button>
                )}
            </div>

            {/* In collapsed mode, show the toggle button centered below header if not in header */}
            {isCollapsed && (
                <button onClick={toggleSidebar} className="mx-auto mt-2 text-gray-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">menu</span>
                </button>
            )}

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors relative
                            ${isActive 
                                ? "bg-white dark:bg-gray-800 text-primary shadow-sm border border-border-light dark:border-border-dark" 
                                : "text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800"}
                            ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? item.label : ""}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${!isCollapsed && "mr-3"} ${!isCollapsed ? "text-text-muted-light dark:text-text-muted-dark group-hover:text-text-light dark:group-hover:text-white" : ""}`}>
                            {item.icon}
                        </span>
                        {!isCollapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* User Profile Footer */}
            <div className="p-4 border-t border-border-light dark:border-border-dark">
                <button className={`flex items-center w-full group ${isCollapsed ? "justify-center" : ""}`}>
                    <div className={`h-9 w-9 flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold text-sm ${role === 'lecturer' ? "bg-gradient-to-tr from-purple-500 to-indigo-500" : "bg-gradient-to-tr from-blue-500 to-cyan-400"}`}>
                        {role === 'lecturer' ? "DR" : "JD"}
                    </div>
                    {!isCollapsed && (
                        <div className="ml-3 text-left overflow-hidden">
                            <p className="text-sm font-medium text-text-light dark:text-white group-hover:text-primary transition-colors truncate">
                                {role === 'lecturer' ? "Dr. A. Bello" : "John Doe"}
                            </p>
                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">
                                {role === 'lecturer' ? "Snr. Lecturer, CS" : "Computer Science, MSc"}
                            </p>
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
};
