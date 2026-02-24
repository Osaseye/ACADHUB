import React, { useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';
import { db } from '../../../config/firebase';
import { 
    doc, 
    updateDoc, 
    deleteDoc, 
    writeBatch
} from 'firebase/firestore';
import { toast } from 'sonner';

export const NotificationsPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { currentUser } = useAuth();
    
    // Use global notifications context
    const { notifications, loading } = useNotifications();

    const handleMarkAsRead = async (id) => {
        try {
            const notifRef = doc(db, "notifications", id);
            await updateDoc(notifRef, {
                isRead: true,
                read: true // handle both conventions
            });
        } catch (error) {
            console.error("Error marking as read:", error);
            toast.error("Failed to mark as read");
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const batch = writeBatch(db);
            const unreadNotifications = notifications.filter(n => !n.isRead && !n.read);
            
            if (unreadNotifications.length === 0) return;

            unreadNotifications.forEach(notif => {
                const notifRef = doc(db, "notifications", notif.id);
                batch.update(notifRef, { isRead: true, read: true });
            });

            await batch.commit();
            toast.success("All notifications marked as read");
        } catch (error) {
            console.error("Error marking all as read:", error);
            toast.error("Failed to mark all as read");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "notifications", id));
            toast.success("Notification deleted");
        } catch (error) {
            console.error("Error deleting notification:", error);
            toast.error("Failed to delete notification");
        }
    };

    const getIcon = (type) => {
        switch(type) {
            case 'success': return { icon: 'check_circle', color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' };
            case 'info': return { icon: 'info', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' };
            case 'warning': return { icon: 'warning', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' };
            case 'error': return { icon: 'error', color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' };
            default: return { icon: 'notifications', color: 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400' };
        }
    };

    const timeAgo = (date) => {
        if (!date) return '';
        
        let seconds = 0;
        if (date.seconds) {
             seconds = date.seconds;
        } else if (date instanceof Date) {
             seconds = Math.floor(date.getTime() / 1000);
        } else if (typeof date === 'string') {
             seconds = Math.floor(new Date(date).getTime() / 1000);
        } else {
             return '';
        }

        const interval = Math.floor(Date.now() / 1000) - seconds;
        
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
        };

        for (let [unit, secondsInUnit] of Object.entries(intervals)) {
            const count = Math.floor(interval / secondsInUnit);
            if (count >= 1) {
                return count === 1 ? `1 ${unit} ago` : `${count} ${unit}s ago`;
            }
        }
        return 'just now';
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                        {notifications.length > 0 && (
                            <button 
                                onClick={handleMarkAllAsRead}
                                className="text-sm text-primary hover:text-sky-600 font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                             <div className="text-center py-12">
                                <span className="material-symbols-outlined text-4xl text-gray-400 animate-spin">progress_activity</span>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">Loading notifications...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-12 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
                                <span className="material-symbols-outlined text-4xl text-gray-400 mb-3">notifications_off</span>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No notifications yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">You're all caught up!</p>
                            </div>
                        ) : (
                            notifications.map((note) => {
                                const { icon, color } = getIcon(note.type);
                                return (
                                    <div 
                                        key={note.id} 
                                        className={`p-4 rounded-xl border transition-all relative group cursor-pointer ${
                                            note.isRead 
                                                ? 'bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark' 
                                                : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800'
                                        }`}
                                        onClick={() => !note.isRead && handleMarkAsRead(note.id)}
                                    >
                                        <div className="flex gap-4">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                                                <span className="material-symbols-outlined text-xl">{icon}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className={`text-sm font-semibold mb-1 ${note.isRead ? 'text-gray-900 dark:text-white' : 'text-primary dark:text-sky-400'}`}>
                                                        {note.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                                            {timeAgo(note.createdAt)}
                                                        </span>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(note.id);
                                                            }}
                                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                            title="Delete notification"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">close</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pr-8">
                                                    {note.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
