import React, { useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';

export const LecturerNotificationsPage = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    
    // Lecturer-focused Mock Data
    const notifications = [
        {
            id: 1,
            type: 'supervision',
            title: "New Supervision Request",
            message: "Student David West (MSc Computer Science) has requested you as a supervisor for 'Blockchain for Land Registry'.",
            time: "1 hour ago",
            read: false,
            link: "/lecturer/supervision"
        },
        {
            id: 2,
            type: 'system',
            title: "Departmental Meeting Reminder",
            message: "Reminder: Faculty board meeting scheduled for tomorrow at 10:00 AM in the Senate Building.",
            time: "3 hours ago",
            read: false,
            link: "#"
        },
        {
            id: 3,
            type: 'citation',
            title: "Paper Citation Alert",
            message: "Your paper 'Optimizing Neural Networks' was cited in a new publication by Dr. K. Johnson.",
            time: "Yesterday",
            read: true,
            link: "#"
        },
        {
            id: 4,
            type: 'grant', // Reusing grant type for grant approval
            title: "Grant Application Update",
            message: "Your application for the TETFUND 2026 Research Intervention has passed the initial screening stage.",
            time: "2 days ago",
            read: true,
            link: "#"
        }
    ];

    const getIcon = (type) => {
        switch(type) {
            case 'supervision': return { icon: 'supervisor_account', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400' };
            case 'citation': return { icon: 'format_quote', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' };
            case 'system': return { icon: 'campaign', color: 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400' };
            case 'grant': return { icon: 'monetization_on', color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' };
            default: return { icon: 'notifications', color: 'text-gray-600 bg-gray-100' };
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                role="lecturer"
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lecturer Notifications</h1>
                             <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Updates on supervision, grants, and department news.</p>
                        </div>
                        <button className="text-sm text-primary hover:text-sky-600 font-medium">Mark all as read</button>
                    </div>

                    <div className="space-y-4">
                        {notifications.map((note) => {
                            const { icon, color } = getIcon(note.type);
                            return (
                                <div key={note.id} className={`p-4 rounded-xl border transition-all ${note.read ? 'bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark' : 'bg-primary/5 border-primary/20'}`}>
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
