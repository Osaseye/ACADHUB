import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../config/firebase';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';

export const DashboardPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { currentUser } = useAuth();
    const [stats, setStats] = useState({ uploads: 0, saved: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            if (!currentUser) return;

            try {
                // Count Projects
                const projectsQuery = query(
                    collection(db, "projects"), 
                    where("studentId", "==", currentUser.uid)
                );
                const projectsSnapshot = await getCountFromServer(projectsQuery);

                // Count Saved Items
                const savedQuery = query(
                    collection(db, "saved_items"), 
                    where("userId", "==", currentUser.uid)
                );
                const savedSnapshot = await getCountFromServer(savedQuery);

                setStats({
                    uploads: projectsSnapshot.data().count,
                    saved: savedSnapshot.data().count
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, [currentUser]);

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            
            {/* Sidebar Navigation */}
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
            />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
                    
                    {/* Welcome Banner */}
                    <div className="mb-8 bg-gradient-to-r from-[#0d306b] to-[#009ac7] rounded-lg p-6 text-white shadow-sm relative overflow-hidden">
                        {/* Abstract Pattern Overlay */}
                        <div className="absolute right-0 top-0 h-full w-64 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAyTDIsN2wxMCw1IDEwLTV6Ii8+PHBhdGggZD0iTTIgMTdsMTAgNSAxMC01TTIgMTJsMTAgNSAxMC01Ii8+PC9zdmc+')] bg-repeat space-x-2"></div>
                        <div className="relative z-10">
                            <h1 className="text-2xl font-bold mb-1">Welcome back, {currentUser?.displayName || "Scholar"}</h1>
                            <p className="text-blue-100 text-sm">Your Dashboard Overview</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Card 1 */}
                        <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-5 shadow-sm hover:border-primary transition-colors group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Total Uploads</p>
                                    <p className="text-2xl font-bold text-text-light dark:text-white mt-1">{stats.uploads}</p>
                                </div>
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                                    <span className="material-symbols-outlined text-primary text-[24px]">article</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-green-600 dark:text-green-400">
                                <span className="material-symbols-outlined text-sm mr-1">arrow_upward</span>
                                <span>0 new this month</span>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-5 shadow-sm hover:border-primary transition-colors group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Topic Interaction</p>
                                    <p className="text-2xl font-bold text-text-light dark:text-white mt-1">-</p>
                                </div>
                                <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-md group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[24px]">insights</span>
                                </div>
                            </div>
                            <div className="mt-4 h-6 w-full flex items-end gap-1">
                                <div className="w-1/6 bg-blue-100 dark:bg-blue-900 h-1 rounded-t"></div>
                                <div className="w-1/6 bg-blue-200 dark:bg-blue-800 h-1 rounded-t"></div>
                                <div className="w-1/6 bg-blue-300 dark:bg-blue-700 h-1 rounded-t"></div>
                                <div className="w-1/6 bg-blue-400 dark:bg-blue-600 h-1 rounded-t"></div>
                                <div className="w-1/6 bg-blue-500 dark:bg-blue-500 h-1 rounded-t"></div>
                                <div className="w-1/6 bg-primary h-1 rounded-t"></div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-5 shadow-sm hover:border-primary transition-colors group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Saved Research</p>
                                    <p className="text-2xl font-bold text-text-light dark:text-white mt-1">{stats.saved}</p>
                                </div>
                                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-md group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/50 transition-colors">
                                    <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-500 text-[24px]">star_border</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-text-muted-light dark:text-text-muted-dark">
                                <span>No saved items</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Main Feed / Recommentations */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-semibold text-text-light dark:text-white">Recommended for You</h2>
                                <button className="text-sm text-primary hover:underline">View all</button>
                            </div>
                            
                            <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm overflow-hidden">
                                <div className="bg-surface-light dark:bg-[#161B22] border-b border-border-light dark:border-border-dark px-4 py-3 grid grid-cols-12 gap-4 text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                                    <div className="col-span-6">Title & Degree</div>
                                    <div className="col-span-3">Author</div>
                                    <div className="col-span-2">Year</div>
                                    <div className="col-span-1 text-right">Action</div>
                                </div>

                                {/* List Items */}
                                {([]).length > 0 ? (
                                    [].map((item, idx) => (
                                    <div key={idx} className="group px-4 py-3 grid grid-cols-12 gap-4 items-center border-b border-border-light dark:border-border-dark last:border-0 hover:bg-surface-light dark:hover:bg-gray-800 transition-colors cursor-pointer">
                                        <div className="col-span-6">
                                            <div className="flex items-start gap-3">
                                                <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark mt-0.5 text-[20px]">description</span>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-primary group-hover:underline line-clamp-1">{item.title}</h3>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-${item.color}-100 text-${item.color}-800 dark:bg-${item.color}-900 dark:text-${item.color}-200 border-${item.color}-200 dark:border-${item.color}-800`}>
                                                            {item.degree}
                                                        </span>
                                                        <span className="text-xs text-text-muted-light dark:text-text-muted-dark">{item.dept}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-3 text-sm text-text-muted-light dark:text-text-muted-dark flex items-center gap-2">
                                            <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                                {item.initial}
                                            </div>
                                            {item.author}
                                        </div>
                                        <div className="col-span-2 text-sm text-text-muted-light dark:text-text-muted-dark">{item.year}</div>
                                        <div className="col-span-1 text-right">
                                            <button className={`${item.saved ? "text-yellow-500 dark:text-yellow-400" : "text-text-muted-light dark:text-text-muted-dark hover:text-yellow-500 dark:hover:text-yellow-400"} transition-colors`}>
                                                <span className="material-symbols-outlined text-[20px]">{item.saved ? "star" : "star_border"}</span>
                                            </button>
                                        </div>
                                    </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-text-muted-light dark:text-text-muted-dark">
                                        <span className="material-symbols-outlined text-[48px] mb-2 text-gray-300 dark:text-gray-600">article</span>
                                        <p>No recent research found</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            {/* Insight Card */}
                            <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-secondary text-[20px]">auto_awesome</span>
                                    <h3 className="font-semibold text-text-light dark:text-white">Research Insights</h3>
                                </div>
                                <div className="text-sm text-text-muted-light dark:text-text-muted-dark space-y-3">
                                    <p className="leading-relaxed">
                                        No sufficient data to generate insights yet.
                                    </p>
                                </div>
                                <button className="w-full mt-4 py-2 px-4 bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded text-sm font-medium text-text-light dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" disabled>
                                    Generate New Report
                                </button>
                            </div>

                            {/* Tags Card */}
                            <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-5 shadow-sm">
                                <h3 className="font-semibold text-text-light dark:text-white mb-4">Trending Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {/* Empty State */}
                                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">No trending tags available.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

