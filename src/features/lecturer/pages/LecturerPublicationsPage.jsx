import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../../../components/layout/Sidebar';

export const LecturerPublicationsPage = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Mock Data for Lecturer Publications
    const publications = [
        {
            id: 1,
            title: "Advanced Machine Learning Models for Nigerian Financial Markets",
            type: "Journal Article",
            venue: "African Journal of Computing & ICT",
            date: "Jan 15, 2024",
            citations: 12,
            downloads: 85
        },
        {
            id: 2,
            title: "Ethical Considerations in AI Deployment across West Africa",
            type: "Conference Paper",
            venue: "IEEE West Africa Section Conference",
            date: "Nov 05, 2023",
            citations: 4,
            downloads: 32
        },
        {
            id: 3,
            title: "Optimizing Curriculum for Remote Learning in Developing Nations",
            type: "Technical Report",
            venue: "University Press",
            date: "Aug 20, 2023",
            citations: 28,
            downloads: 156
        }
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
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
                                {publications.reduce((acc, curr) => acc + curr.citations, 0)}
                            </div>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                            <div className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium mb-1">Total Downloads</div>
                            <div className="text-3xl font-bold text-text-light dark:text-white">
                                {publications.reduce((acc, curr) => acc + curr.downloads, 0)}
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
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Impact</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-surface-light dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark">
                                    {publications.map((pub) => (
                                        <tr key={pub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-text-light dark:text-white truncate max-w-xs" title={pub.title}>{pub.title}</div>
                                                <div className="text-xs text-text-muted-light dark:text-text-muted-dark">{pub.date}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted-light dark:text-text-muted-dark">
                                                {pub.venue}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                                                    {pub.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted-light dark:text-text-muted-dark">
                                                <div className="flex flex-col gap-1">
                                                    <span>{pub.citations} Citations</span>
                                                    <span>{pub.downloads} Downloads</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-primary hover:text-sky-900 dark:hover:text-blue-300 mr-3">Edit</button>
                                                <button className="text-primary hover:text-sky-900 dark:hover:text-blue-300">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
