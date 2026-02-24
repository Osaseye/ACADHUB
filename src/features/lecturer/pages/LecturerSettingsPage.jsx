import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const LecturerSettingsPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
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
    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        department: "",
        role: "Lecturer",
        specialization: "",
        bio: "",
        institution: "University of Lagos" // Default if missing
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                try {
                    const docRef = doc(db, 'users', currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setFormData({
                            displayName: data.displayName || "",
                            email: currentUser.email || "",
                            department: data.department || "",
                            role: data.role || "Lecturer",
                            specialization: data.specialization || "",
                            bio: data.bio || "",
                            institution: data.institution || "University of Lagos"
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    toast.error("Failed to load profile data");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [currentUser]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const docRef = doc(db, 'users', currentUser.uid);
            await updateDoc(docRef, {
                displayName: formData.displayName,
                department: formData.department,
                specialization: formData.specialization,
                bio: formData.bio,
                institution: formData.institution
                // Role is typically immutable or admin-managed, but we'll leave it as non-editable in UI mostly
            });
            toast.success("Profile settings updated!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

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
                                            value={formData.displayName}
                                            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Official Email</label>
                                        <input 
                                            type="email" 
                                            value={formData.email}
                                            disabled // Locked
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Institution</label>
                                        <input 
                                            type="text" 
                                            value={formData.institution}
                                            onChange={(e) => setFormData({...formData, institution: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                                        <input 
                                            type="text" 
                                            value={formData.department}
                                            onChange={(e) => setFormData({...formData, department: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Research Specialization</label>
                                        <input 
                                            type="text" 
                                            value={formData.specialization}
                                            onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="e.g. Artificial Intelligence, Data Science"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                                        <textarea 
                                            rows="4"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                            placeholder="Write a short bio about your academic background..."
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={saving}
                                        className="bg-primary hover:bg-sky-700 text-white px-6 py-2 rounded-md shadow-sm text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {saving && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>}
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
