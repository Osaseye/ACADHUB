import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { useTheme } from '../../../hooks/useTheme';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { NIGERIAN_UNIVERSITIES } from '../../../data/universities';

export const SettingsPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { theme, toggleTheme } = useTheme();
    const { currentUser } = useAuth();
    
    // State
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        institution: "",
        department: "",
        bio: "",
        researchInterests: ""
    });

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser?.uid) {
                try {
                    const userRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(userRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        
                        // Handle name split if firstName/lastName not in DB
                        let first = data.firstName || "";
                        let last = data.lastName || "";
                        if (!first && !last && currentUser.displayName) {
                            const parts = currentUser.displayName.split(' ');
                            first = parts[0];
                            last = parts.slice(1).join(' ');
                        }

                        setFormData({
                            firstName: first,
                            lastName: last,
                            email: currentUser.email || "",
                            institution: data.institution || "",
                            department: data.department || "",
                            bio: data.bio || "",
                            researchInterests: data.researchInterests || (Array.isArray(data.interests) ? data.interests.join(", ") : "") || ""
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (!currentUser) return;
            
            const userRef = doc(db, "users", currentUser.uid);
            
            // Update Firestore
            await updateDoc(userRef, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                institution: formData.institution,
                department: formData.department,
                bio: formData.bio,
                researchInterests: formData.researchInterests,
                lastUpdated: new Date()
            });

            // Update Auth Profile Display Name
            const displayName = `${formData.firstName} ${formData.lastName}`.trim();
            if (displayName !== currentUser.displayName) {
                await updateProfile(currentUser, {
                    displayName: displayName
                });
            }

            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }


    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
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
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                                        <input 
                                            type="text" 
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                                        <input 
                                            type="text" 
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={formData.email}
                                            disabled 
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Institution</label>
                                        <select 
                                            name="institution"
                                            value={formData.institution}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                        >
                                            <option value="">Select Institution</option>
                                            
                                            {/* If current institution is custom/legacy, show it as an option */}
                                            {formData.institution && !NIGERIAN_UNIVERSITIES.includes(formData.institution) && (
                                                <option value={formData.institution}>{formData.institution}</option>
                                            )}

                                            {NIGERIAN_UNIVERSITIES.map((uni) => (
                                                <option key={uni} value={uni}>
                                                    {uni}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                                        <input 
                                            type="text" 
                                            name="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                                    <textarea 
                                        rows="3"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                        placeholder="Tell us about your academic background..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Research Interests (Comma separated)</label>
                                    <input 
                                        type="text" 
                                        name="researchInterests"
                                        value={formData.researchInterests}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                                        placeholder="AI, Machine Learning, Data Science"
                                    />
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button 
                                        type="submit" 
                                        disabled={saving}
                                        className="bg-primary hover:bg-sky-600 text-white px-6 py-2 rounded-md text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="mt-8 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
                        <div className="border-b border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/50 px-6 py-4">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Appearance</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Theme Preference</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Switch between light and dark modes.</p>
                                </div>
                                <button 
                                    onClick={toggleTheme}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${theme === 'dark' ? 'bg-primary' : 'bg-gray-200'}`}
                                >
                                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}></span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};
