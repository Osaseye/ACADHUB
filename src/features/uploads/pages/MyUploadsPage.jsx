import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../../../components/layout/Sidebar';

export const MyUploadsPage = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Nigerian Context Data
    const myUploads = [
        {
            id: 1,
            title: "Analysis of Traffic Congestion in Lagos Metropolis",
            type: "MSc Dissertation",
            department: "Urban Planning",
            date: "Oct 24, 2023",
            status: "Published",
            views: 124,
            downloads: 45
        },
        {
            id: 2,
            title: "Impact of Cashless Policy on Small Businesses in Kano",
            type: "BSc Project",
            department: "Economics",
            date: "Feb 2, 2024",
            status: "Pending",
            views: 0,
            downloads: 0
        },
        {
            id: 3,
            title: "Renewable Energy Adoption in Rural Enugu",
            type: "PhD Thesis",
            department: "Electrical Engineering",
            date: "Just now",
            status: "Draft",
            views: 0,
            downloads: 0
        }
    ];

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Published': return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800";
            case 'Pending': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800";
            case 'Draft': return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-4 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-text-light dark:text-white">My Uploads</h1>
                            <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Manage your research submissions and track their performance.</p>
                        </div>
                        <Link to="/uploads/new" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                            <span className="material-symbols-outlined mr-2">add</span>
                            New Project
                        </Link>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                            <div className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium mb-1">Total Uploads</div>
                            <div className="text-3xl font-bold text-text-light dark:text-white">3</div>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                            <div className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium mb-1">Total Views</div>
                            <div className="text-3xl font-bold text-text-light dark:text-white">124</div>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                            <div className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium mb-1">Pending Reviews</div>
                            <div className="text-3xl font-bold text-text-light dark:text-white">1</div>
                        </div>
                    </div>

                    {/* Uploads List */}
                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                            <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                                <thead className="bg-slate-50 dark:bg-[#161b22]">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Project Title</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Type</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Department</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Performance</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-surface-light dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark">
                                    {myUploads.map((upload) => (
                                        <tr key={upload.id} className="hover:bg-slate-50 dark:hover:bg-[#1f242c] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-text-light dark:text-white max-w-sm truncate" title={upload.title}>
                                                    {upload.title}
                                                </div>
                                                <div className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">Uploaded {upload.date}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted-light dark:text-text-muted-dark">
                                                {upload.type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted-light dark:text-text-muted-dark">
                                                {upload.department}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(upload.status)}`}>
                                                    {upload.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted-light dark:text-text-muted-dark">
                                                <div className="flex space-x-4">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[16px]">visibility</span> {upload.views}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[16px]">download</span> {upload.downloads}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-primary hover:text-sky-700 dark:hover:text-sky-400 mr-3">Edit</button>
                                                <button className="text-text-muted-light dark:text-text-muted-dark hover:text-red-600 dark:hover:text-red-400">
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {myUploads.length === 0 && (
                            <div className="text-center py-12">
                                <span className="material-symbols-outlined text-4xl text-text-muted-light dark:text-text-muted-dark mb-3">folder_open</span>
                                <p className="text-text-muted-light dark:text-text-muted-dark">No uploads found. Start by creating a new project.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};