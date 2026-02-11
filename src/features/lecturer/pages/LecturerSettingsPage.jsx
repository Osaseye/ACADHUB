import React, { useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { toast } from 'sonner';

export const LecturerSettingsPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    
    // Theme State handled locally for demo (usually global context)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
             return document.documentElement.classList.contains('dark');
        }
        return false;
    });

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };
    
    // Lecturer Profile State
    const [user, setUser] = useState({
        name: "Dr. A. Bello",
        email: "a.bello@cs.unilag.edu.ng",
        institution: "University of Lagos",
        department: "Computer Science",
        role: "Senior Lecturer",
        specialization: "Artificial Intelligence, Data Science",
        bio: "Senior Lecturer with over 10 years experience in Machine Learning research. Currently leading the Green AI initiative.",
    });

    const handleSave = (e) => {
        e.preventDefault();
        toast.success("Profile settings updated!");
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
                role="lecturer"
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Account Settings (Lecturer)</h1>

                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden mb-8">
                        <div className="border-b border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/50 px-6 py-4">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Academic Profile</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your public information and research interests.</p>
                        </div>
                        
                        <div className="p-6">
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title & Full Name</label>
                                        <input 
                                            type="text" 
                                            value={user.name}
                                            onChange={(e) => setUser({...user, name: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Official Email</label>
                                        <input 
                                            type="email" 
                                            value={user.email}
                                            disabled // Locked
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Academic Role</label>
                                        <input 
                                            type="text" 
                                            value={user.role}
                                            onChange={(e) => setUser({...user, role: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                                        <input 
                                            type="text" 
                                            value={user.department}
                                            onChange={(e) => setUser({...user, department: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Research Specialization</label>
                                        <input 
                                            type="text" 
                                            value={user.specialization}
                                            onChange={(e) => setUser({...user, specialization: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                                        <textarea 
                                            rows="4"
                                            value={user.bio}
                                            onChange={(e) => setUser({...user, bio: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button type="submit" className="bg-primary hover:bg-sky-700 text-white px-6 py-2 rounded-md shadow-sm text-sm font-medium transition-colors">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
                         <div className="border-b border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/50 px-6 py-4">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Preferences</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark theme for the interface</p>
                                </div>
                                <button 
                                    onClick={toggleTheme}
                                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isDarkMode ? 'bg-primary' : 'bg-gray-200'}`}
                                >
                                    <span 
                                        aria-hidden="true" 
                                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};
