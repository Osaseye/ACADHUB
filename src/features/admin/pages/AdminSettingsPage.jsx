import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { toast } from 'sonner';
import { db, auth } from '../../../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../../../context/AuthContext';

export const AdminSettingsPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { currentUser } = useAuth();
    
    // System Settings State
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [registrationOpen, setRegistrationOpen] = useState(true);
    const [aiModel, setAiModel] = useState('acad-llm-v2.1');
    const [plagiarismThreshold, setPlagiarismThreshold] = useState(85);
    
    // Profile Settings State
    const [profileName, setProfileName] = useState('');
    const [profileDepartment, setProfileDepartment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDat = async () => {
            try {
                // 1. Fetch System Settings
                const settingsRef = doc(db, "settings", "general");
                const settingsSnap = await getDoc(settingsRef);
                
                if (settingsSnap.exists()) {
                    const data = settingsSnap.data();
                    setMaintenanceMode(data.maintenanceMode ?? false);
                    setRegistrationOpen(data.registrationOpen ?? true);
                    setAiModel(data.aiModel ?? 'acad-llm-v2.1');
                    setPlagiarismThreshold(data.plagiarismThreshold ?? 85);
                }

                // 2. Fetch User Profile (if not already in currentUser context, but good to refresh)
                if (currentUser) {
                    setProfileName(currentUser.displayName || '');
                    // Check firestore for department
                    const userRef = doc(db, "users", currentUser.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        setProfileDepartment(userSnap.data().department || '');
                        if (!currentUser.displayName) {
                             setProfileName(userSnap.data().displayName || '');
                        }
                    }
                }
            } catch (error) {
                console.error("Error loading settings:", error);
                toast.error("Failed to load settings");
            } finally {
                setLoading(false);
            }
        };

        loadDat();
    }, [currentUser]);

    const handleSystemSave = async () => {
        const savePromise = async () => {
            const docRef = doc(db, "settings", "general");
            await setDoc(docRef, {
                maintenanceMode,
                registrationOpen,
                aiModel,
                plagiarismThreshold,
                updatedAt: new Date()
            }, { merge: true });
        };

        toast.promise(savePromise(), {
            loading: 'Updating system configuration...',
            success: 'System settings updated',
            error: 'Failed to update settings'
        });
    };

    const handleProfileSave = async () => {
        if (!currentUser) return;

        const savePromise = async () => {
            // 1. Update Firebase Auth Profile
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: profileName
                });
            }

            // 2. Update Firestore User Document
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                displayName: profileName,
                department: profileDepartment,
                updatedAt: new Date()
            });
            
            // Force reload to update context if needed, or user can just refresh
            // Ideally AuthContext should listen to changes, but updateProfile doesn't always trigger onAuthStateChanged immediately for custom fields
        };

        toast.promise(savePromise(), {
            loading: 'Updating profile...',
            success: 'Profile updated successfully',
            error: 'Failed to update profile'
        });
    };

    const handleSaveAll = async () => {
        await Promise.all([handleSystemSave(), handleProfileSave()]);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#F3F4F6] dark:bg-[#0D1117] text-gray-900 dark:text-gray-300 font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                role="admin"
            />
            
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings & Profile</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account and system configuration.</p>
                        </div>
                        <button 
                            onClick={handleSaveAll}
                            className="px-4 py-2 bg-[#0EA5E9] hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            Save All Changes
                        </button>
                    </div>

                    {/* Profile Configuration */}
                    <section className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#30363D] bg-gray-50 dark:bg-gray-800/50">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-gray-500">person</span>
                                Your Profile
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-gray-900 dark:text-white block mb-2">Display Name</label>
                                <input 
                                    type="text" 
                                    value={profileName}
                                    onChange={(e) => setProfileName(e.target.value)}
                                    placeholder="e.g. Administrator"
                                    className="w-full bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#30363D] rounded-lg text-sm px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0EA5E9] outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-900 dark:text-white block mb-2">Department / Role Title</label>
                                <input 
                                    type="text" 
                                    value={profileDepartment}
                                    onChange={(e) => setProfileDepartment(e.target.value)}
                                    placeholder="e.g. IT Support"
                                    className="w-full bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#30363D] rounded-lg text-sm px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0EA5E9] outline-none"
                                />
                            </div>
                            <div className="md:col-span-2 text-xs text-gray-500 dark:text-gray-400">
                                * Your email ({currentUser?.email}) cannot be changed here. Contact support for email changes.
                            </div>
                        </div>
                    </section>

                    {/* General Configuration */}
                    <section className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#30363D] bg-gray-50 dark:bg-gray-800/50">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-gray-500">tune</span>
                                Platform Controls
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Maintenance Mode */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-900 dark:text-white block">Maintenance Mode</label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Disables access for non-admin users. Shows a "Under Construction" page.</p>
                                </div>
                                <button 
                                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0EA5E9] ${maintenanceMode ? 'bg-[#0EA5E9]' : 'bg-gray-200 dark:bg-gray-700'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            
                            <hr className="border-gray-100 dark:border-[#30363D]" />

                            {/* User Registration */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-900 dark:text-white block">User Registration</label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Allow new students and researchers to create accounts.</p>
                                </div>
                                <button 
                                    onClick={() => setRegistrationOpen(!registrationOpen)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0EA5E9] ${registrationOpen ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${registrationOpen ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* AI Governance */}
                    <section className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#30363D] bg-gray-50 dark:bg-gray-800/50">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-500">smart_toy</span>
                                AI Governance
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Model Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Active LLM Model</label>
                                    <select 
                                        value={aiModel}
                                        onChange={(e) => setAiModel(e.target.value)}
                                        className="w-full bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#30363D] rounded-lg text-sm px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0EA5E9] outline-none"
                                    >
                                        <option value="acad-llm-v2.1">AcadLLM v2.1 (Production)</option>
                                        <option value="gpt-4-turbo">GPT-4 Turbo (Expensive)</option>
                                        <option value="llama-2-70b">Llama 2 70B (Local)</option>
                                    </select>
                                </div>

                                {/* Plagiarism Threshold */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Plagiarism Flag Threshold: <span className="text-[#0EA5E9] font-bold">{plagiarismThreshold}%</span>
                                    </label>
                                    <input 
                                        type="range" 
                                        min="50" 
                                        max="99" 
                                        value={plagiarismThreshold}
                                        onChange={(e) => setPlagiarismThreshold(e.target.value)}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#0EA5E9]"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>Loose (50%)</span>
                                        <span>Strict (99%)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Notifications */}
                    <section className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#30363D] bg-gray-50 dark:bg-gray-800/50">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-500">campaign</span>
                                Global Announcements
                            </h2>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">System Banner Message</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="e.g., Scheduled maintenance on Saturday at 2 AM UTC"
                                    className="flex-1 bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#30363D] rounded-lg text-sm px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0EA5E9] outline-none"
                                />
                                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    Broadcast
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="bg-white dark:bg-[#161B22] border border-red-200 dark:border-red-900/30 rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
                            <h2 className="text-base font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                                <span className="material-symbols-outlined">warning</span>
                                Danger Zone
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Flush System Cache</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Clears all Redis keys. May cause temporary latency.</p>
                                </div>
                                <button className="px-3 py-1.5 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-medium rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                    Clear Cache
                                </button>
                            </div>
                            <hr className="border-gray-100 dark:border-[#30363D]" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Reset Database</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Irreversible action. Deletes ALL user data.</p>
                                </div>
                                <button className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors">
                                    Reset DB
                                </button>
                            </div>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
};
