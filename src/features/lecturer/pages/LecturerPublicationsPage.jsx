import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { db } from '../../../config/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

export const LecturerPublicationsPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { currentUser } = useAuth();
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'projects'),
            where('authorId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const pubs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().createdAt?.toDate().toLocaleDateString() || 'Recently'
            }));
            setPublications(pubs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
                role="lecturer"
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-4 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-text-light dark:text-white">My Publications</h1>
                            <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Manage and track your academic contributions.</p>
                        </div>
                        <Link to="/lecturer/publications/new" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                            <span className="material-symbols-outlined mr-2">add</span>
                            Add Publication
                        </Link>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                            <div className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium mb-1">Total Publications</div>
                            <div className="text-3xl font-bold text-text-light dark:text-white">{publications.length}</div>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                            <div className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium mb-1">Total Citations</div>
                            <div className="text-3xl font-bold text-text-light dark:text-white">
                                {publications.reduce((acc, curr) => acc + (curr.citations || 0), 0)}
                            </div>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                            <div className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium mb-1">Total Downloads</div>
                            <div className="text-3xl font-bold text-text-light dark:text-white">
                                {publications.reduce((acc, curr) => acc + (curr.downloads || 0), 0)}
                            </div>
                        </div>
                    </div>

                    {/* Publications List */}
                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                            <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                                <thead className="bg-slate-50 dark:bg-[#161b22]">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Title</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Venue</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Type</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Stats</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-surface-light dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">Loading...</td>
                                        </tr>
                                    ) : publications.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                                                No publications found. Click "Add Publication" to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        publications.map((pub) => (
                                            <tr key={pub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-text-light dark:text-white truncate max-w-xs" title={pub.title}>{pub.title}</div>
                                                    <div className="text-xs text-text-muted-light dark:text-text-muted-dark">{pub.date}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted-light dark:text-text-muted-dark">
                                                    {pub.venue || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                                                        {pub.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted-light dark:text-text-muted-dark">
                                                    <div className="flex flex-col gap-1">
                                                        <span>{pub.citations || 0} Citations</span>
                                                        <span>{pub.downloads || 0} Downloads</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button className="text-primary hover:text-sky-900 dark:hover:text-blue-300 mr-3">Edit</button>
                                                    <a href={pub.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-sky-900 dark:hover:text-blue-300">View</a>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
