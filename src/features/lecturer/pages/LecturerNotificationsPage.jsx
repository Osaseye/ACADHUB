import React from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { useNotifications } from '../../../context/NotificationContext';
import { db } from '../../../config/firebase';
import { doc, updateDoc, writeBatch, deleteDoc, arrayUnion } from 'firebase/firestore';
import { toast } from 'sonner';

export const LecturerNotificationsPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { notifications, loading } = useNotifications();

    const getIcon = (type) => {
        // Map types to icons/colors
        switch(type) {
            case 'supervision': 
            case 'project_review': 
                return { icon: 'supervisor_account', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400' };
            case 'citation': return { icon: 'format_quote', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' };
            case 'system': return { icon: 'campaign', color: 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400' };
            case 'grant': return { icon: 'monetization_on', color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' };
            case 'note_permission_request': return { icon: 'key', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' };
            default: return { icon: 'notifications', color: 'text-gray-600 bg-gray-100 dark:bg-gray-800 flex items-center justify-center' };
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!notifications.length) return;
        try {
            const batch = writeBatch(db);
            const unread = notifications.filter(n => !n.read && !n.isRead);
            if (unread.length === 0) {
                toast.info("All notifications are already read");
                return;
            }
            unread.forEach(n => {
                const ref = doc(db, "notifications", n.id);
                batch.update(ref, { read: true, isRead: true });
            });
            await batch.commit();
            toast.success("All marked as read");
        } catch (error) {
            console.error("Error marking all read:", error);
            toast.error("Failed to mark all as read");
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await updateDoc(doc(db, "notifications", id), { read: true, isRead: true });
        } catch (e) {
            console.error(e);
        }
    };

    const handleAcceptNotePermission = async (note) => {
        try {
            // Update the project document with the new approved lecturer ID
            const projectRef = doc(db, "projects", note.projectId);
            await updateDoc(projectRef, {
                approvedLecturerIds: arrayUnion(note.requesterId)
            });

            // Mark notification as handled/read
            await updateDoc(doc(db, "notifications", note.id), { read: true, isRead: true, status: 'accepted' });
            
            toast.success("Permission granted successfully");
        } catch (e) {
            console.error("Error accepting permission:", e);
            toast.error("Failed to grant permission");
        }
    };

    const handleDeclineNotePermission = async (note) => {
         try {
            await updateDoc(doc(db, "notifications", note.id), { read: true, isRead: true, status: 'declined' });
            toast.success("Permission request declined");
        } catch (e) {
            console.error(e);
            toast.error("Failed to decline request");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this notification?")) return;
        try {
            await deleteDoc(doc(db, "notifications", id));
            toast.success("Notification deleted");
        } catch (e) {
            console.error(e);
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
                role="lecturer"
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lecturer Notifications</h1>
                             <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Updates on supervision, grants, and department news.</p>
                        </div>
                        <button 
                            onClick={handleMarkAllAsRead}
                            className="text-sm text-primary hover:text-sky-600 font-medium"
                        >
                            Mark all as read
                        </button>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                             <div className="text-center py-12"><div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full"></div></div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-12 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
                                <span className="material-symbols-outlined text-4xl text-gray-400 mb-3">notifications_off</span>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No notifications yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">You're all caught up!</p>
                            </div>
                        ) : (
                            notifications.map((note) => {
                                const { icon, color } = getIcon(note.type);
                                const isRead = note.read || note.isRead;
                                return (
                                    <div 
                                        key={note.id} 
                                        onClick={() => !isRead && handleMarkAsRead(note.id)}
                                        className={`relative p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${isRead ? 'bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark opacity-75' : 'bg-primary/5 border-primary/20'}`}
                                    >
                                        <div className="flex gap-4">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                                                <span className="material-symbols-outlined text-xl">{icon}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className={`text-sm font-semibold mb-1 ${isRead ? 'text-gray-900 dark:text-white' : 'text-primary dark:text-sky-400'}`}>
                                                        {note.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">
                                                            {note.createdAt?.toLocaleDateString ? note.createdAt.toLocaleDateString() : 'Just now'}
                                                        </span>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                                                            className="text-gray-400 hover:text-red-500"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">close</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                                    {note.message}
                                                </p>
                                                
                                                {note.type === 'note_permission_request' && note.status !== 'accepted' && note.status !== 'declined' && (
                                                    <div className="mt-4 flex gap-3">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleAcceptNotePermission(note); }}
                                                            className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleDeclineNotePermission(note); }}
                                                            className="px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 text-xs font-medium rounded-md transition-colors"
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                )}
                                                {note.type === 'note_permission_request' && (note.status === 'accepted' || note.status === 'declined') && (
                                                    <div className="mt-2 text-xs font-medium">
                                                        {note.status === 'accepted' ? (
                                                            <span className="text-green-600 dark:text-green-400">Request Accepted</span>
                                                        ) : (
                                                            <span className="text-red-600 dark:text-red-400">Request Declined</span>
                                                        )}
                                                    </div>
                                                )}

                                                {note.link && (
                                                    <a href={note.link} className="text-xs text-primary hover:underline mt-2 inline-block">
                                                        View Details
                                                    </a>
                                                )}
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
