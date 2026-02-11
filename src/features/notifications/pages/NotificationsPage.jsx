import React, { useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';

export const NotificationsPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    
    // Notifications Mock Data
    const notifications = [
        {
            id: 1,
            type: 'grant',
            title: "New MSc Research Grant Available",
            message: "The University of Lagos Postgraduate School has announced the 2026 Innovation Grant for STEM students.",
            time: "2 hours ago",
            read: false,
            link: "#"
        },
        {
            id: 2,
            type: 'citation',
            title: "New Citation Alert",
            message: "Your paper 'Analysis of fintech adoption in Lagos' was cited by Dr. Amina Yusuf in 'Digital Banking Trends in West Africa'.",
            time: "Yesterday",
            read: true,
            link: "#"
        },
        {
            id: 3,
            type: 'system',
            title: "Profile Verification Successful",
            message: "Your academic credentials have been verified by the details provided. You now have full upload privileges.",
            time: "2 days ago",
            read: true,
            link: "#"
        },
        {
            id: 4,
            type: 'social',
            title: "New Comment on your Project",
            message: "Prof. Tunde Bakare commented on 'Automated Traffic Control': 'This is a viable solution for the Lekki-Epe axis...'",
            time: "3 days ago",
            read: true,
            link: "#"
        }
    ];

    const getIcon = (type) => {
        switch(type) {
            case 'grant': return { icon: 'monetization_on', color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' };
            case 'citation': return { icon: 'format_quote', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' };
            case 'system': return { icon: 'admin_panel_settings', color: 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400' };
            case 'social': return { icon: 'comment', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400' };
            default: return { icon: 'notifications', color: 'text-gray-600 bg-gray-100' };
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                        <button className="text-sm text-primary hover:text-sky-600 font-medium">Mark all as read</button>
                    </div>

                    <div className="space-y-4">
                        {notifications.map((note) => {
                            const { icon, color } = getIcon(note.type);
                            return (
                                <div key={note.id} className={`p-4 rounded-xl border transition-all ${note.read ? 'bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark' : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800'}`}>
                                    <div className="flex gap-4">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                                            <span className="material-symbols-outlined text-xl">{icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className={`text-sm font-semibold mb-1 ${note.read ? 'text-gray-900 dark:text-white' : 'text-primary dark:text-sky-400'}`}>
                                                    {note.title}
                                                </h4>
                                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{note.time}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                                {note.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
};
