import React, { useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Link } from 'react-router-dom';

export const LecturerDashboardPage = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Mock Data
    const pendingRequests = 3;
    const activeStudents = 7;
    const totalPublications = 24;
    const pendingReviews = [
        { id: 1, name: "Chinedu Okeke", topic: "AI in Traffic Control", degree: "BSc", date: "2 days ago" },
        { id: 2, name: "Ngozi Udeh", topic: "Igbo NLP Corpus", degree: "MSc", date: "5 days ago" }
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                role="lecturer"
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lecturer Dashboard</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, Dr. Bello.</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Requests</p>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{pendingRequests}</h3>
                                </div>
                                <span className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
                                    <span className="material-symbols-outlined">person_add</span>
                                </span>
                            </div>
                            <Link to="/lecturer/supervision" className="text-xs text-primary mt-4 inline-block hover:underline">Review Requests &rarr;</Link>
                        </div>

                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Students</p>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{activeStudents}</h3>
                                </div>
                                <span className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                    <span className="material-symbols-outlined">groups</span>
                                </span>
                            </div>
                        </div>

                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Publications</p>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalPublications}</h3>
                                </div>
                                <span className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                                    <span className="material-symbols-outlined">menu_book</span>
                                </span>
                            </div>
                        </div>

                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Citations</p>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">128</h3>
                                </div>
                                <span className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                                    <span className="material-symbols-outlined">format_quote</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Pending Reviews List */}
                        <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Supervision Requests</h3>
                                <Link to="/lecturer/supervision" className="text-sm text-primary hover:underline">View All</Link>
                            </div>
                            <div className="divide-y divide-border-light dark:divide-border-dark">
                                {pendingReviews.map((review) => (
                                    <div key={review.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-sm">
                                                {review.name.match(/\b(\w)/g).join('')}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{review.name} <span className="text-xs font-normal text-gray-500">({review.degree})</span></h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Proposed Topic: {review.topic}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">Accept</button>
                                            <button className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">Decline</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Grant Alerts */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Research Grants</h3>
                            <div className="space-y-4">
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
                                    <span className="text-xs font-bold text-yellow-800 dark:text-yellow-500 block mb-1">TETFUND 2026</span>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">Call for National Research Fund proposals now open. Deadline: March 30th.</p>
                                </div>
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                                    <span className="text-xs font-bold text-blue-800 dark:text-blue-500 block mb-1">Google Africa Award</span>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">Research Scholar Program applications for CS faculty.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};
