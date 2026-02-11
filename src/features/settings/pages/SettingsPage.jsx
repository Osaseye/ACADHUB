import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { toast } from 'sonner';

export const SettingsPage = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    
    // Theme State
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
    
    // Mock User State
    const [user, setUser] = useState({
        name: "Ibrahim Musa",
        email: "i.musa@student.buk.edu.ng",
        institution: "Bayero University Kano",
        department: "Computer Science",
        level: "MSc",
        bio: "Researching AI applications in agricultural yield prediction.",
        interests: "AI, Machine Learning, Agro-tech, Python"
    });

    const handleSave = (e) => {
        e.preventDefault();
        toast.success("Profile updated successfully!");
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
                        <div className="border-b border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/50 px-6 py-4">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Public Profile</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">This information will be displayed on your author page.</p>
                        </div>
                        
                        <div className="p-6">
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={user.name}
                                            onChange={(e) => setUser({...user, name: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={user.email}
                                            disabled // Email usually locked
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Institution</label>
                                        <select 
                                            value={user.institution}
                                            onChange={(e) => setUser({...user, institution: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                        >
                                            <option>Bayero University Kano</option>
                                            <option>University of Lagos</option>
                                            <option>Obafemi Awolowo University</option>
                                            <option>Ahmadu Bello University</option>
                                            <option>Covenant University</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                                        <input 
                                            type="text" 
                                            value={user.department}
                                            onChange={(e) => setUser({...user, department: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                                    <textarea 
                                        rows="3"
                                        value={user.bio}
                                        onChange={(e) => setUser({...user, bio: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Research Interests (Comma separated)</label>
                                    <input 
                                        type="text" 
                                        value={user.interests}
                                        onChange={(e) => setUser({...user, interests: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                    />
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button 
                                        type="submit" 
                                        className="bg-primary hover:bg-sky-600 text-white px-6 py-2 rounded-md text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="mt-8 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
                        <div className="border-b border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/50 px-6 py-4">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Account Preferences</h2>
                        </div>
                        <div className="p-6 space-y-4">
                             <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Receive emails about grant opportunities</p>
                                </div>
                                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-primary">
                                    <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                </button>
                             </div>
                             
                             <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Public Profile</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Allow others to see your research history</p>
                                </div>
                                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-primary">
                                    <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                </button>
                             </div>

                             <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                                </div>
                                <button 
                                    onClick={toggleTheme}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isDarkMode ? 'bg-primary' : 'bg-gray-200'}`}
                                >
                                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}></span>
                                </button>
                             </div>
                             
                             <div className="pt-4 border-t border-border-light dark:border-border-dark">
                                <button className="text-red-600 hover:text-red-700 text-sm font-medium">Log out of all devices</button>
                             </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
