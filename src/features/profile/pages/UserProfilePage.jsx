import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar } from '../../../components/layout/Sidebar';

export const UserProfilePage = () => {
    const { userId } = useParams();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            />
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark p-8 text-center">
                        <div className="h-24 w-24 rounded-full bg-primary mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4">
                            {userId ? userId.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <h1 className="text-2xl font-bold text-text-light dark:text-white mb-2">
                             {userId || 'User Profile'}
                        </h1>
                        <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
                            Academic Researcher • University of Lagos
                        </p>
                        <div className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm">
                            <span className="font-medium">Public Profile View</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};