import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    
    // Ref to track if it's the first load to avoid spamming toasts on page refresh
    const isFirstLoad = useRef(true);
    const toastedIds = useRef(new Set());

    useEffect(() => {
        let unsubscribe = () => {};

        if (currentUser) {
            // Listen for notifications where recipientId is current user
            // We also support 'userId' for legacy compatibility if needed, but standardizing on recipientId
            // OR queries are tricky in simple hooks, so we'll stick to recipientId which is what we use for new stuff
            const q = query(
                collection(db, "notifications"),
                where("recipientId", "==", currentUser.uid)
                // orderBy("createdAt", "desc") // Requires index, filtering client side for now to be safe
            );

            unsubscribe = onSnapshot(q, (snapshot) => {
                const notifs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() || new Date()
                }));

                // Sort client-side
                notifs.sort((a, b) => b.createdAt - a.createdAt);

                setNotifications(notifs);
                setUnreadCount(notifs.filter(n => !n.isRead && !n.read).length); // Handle both isRead and read fields just in case
                
                // Handle Toasts for new notifications
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added" && !toastedIds.current.has(change.doc.id)) {
                        if (!isFirstLoad.current) {
                            const data = change.doc.data();
                            // Only toast if it's recent (e.g. within last minute) to avoid stale data popping up
                            const created = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
                            const now = new Date();
                            if ((now - created) < 60000) { // 1 minute
                                toast(data.title || "New Notification", {
                                    description: data.message,
                                    action: {
                                        label: "View",
                                        onClick: () => window.location.href = data.link || '/notifications'
                                    }
                                });
                                toastedIds.current.add(change.doc.id);
                            }
                        }
                    }
                });

                if (isFirstLoad.current) {
                    isFirstLoad.current = false;
                    snapshot.docs.forEach(d => toastedIds.current.add(d.id));
                }
                
                setLoading(false);
            }, (error) => {
                console.error("Error listening to notifications:", error);
                setLoading(false);
            });
        } else {
            setNotifications([]);
            setUnreadCount(0);
            setLoading(false);
        }

        return () => unsubscribe();
    }, [currentUser]);

    const value = {
        notifications,
        unreadCount,
        loading
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
