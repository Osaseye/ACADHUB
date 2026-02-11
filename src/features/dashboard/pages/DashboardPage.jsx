import React from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';

export const DashboardPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();

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
                            <h1 className="text-2xl font-bold mb-1">Welcome back, John</h1>
                            <p className="text-blue-100 text-sm">MSc Computer Science • Department of Engineering</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Card 1 */}
                        <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-5 shadow-sm hover:border-primary transition-colors group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Total Uploads</p>
                                    <p className="text-2xl font-bold text-text-light dark:text-white mt-1">12</p>
                                </div>
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                                    <span className="material-symbols-outlined text-primary text-[24px]">article</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-green-600 dark:text-green-400">
                                <span className="material-symbols-outlined text-sm mr-1">arrow_upward</span>
                                <span>2 new this month</span>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-5 shadow-sm hover:border-primary transition-colors group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Topic Interaction</p>
                                    <p className="text-2xl font-bold text-text-light dark:text-white mt-1">High</p>
                                </div>
                                <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-md group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[24px]">insights</span>
                                </div>
                            </div>
                            <div className="mt-4 h-6 w-full flex items-end gap-1">
                                <div className="w-1/6 bg-blue-100 dark:bg-blue-900 h-2 rounded-t"></div>
                                <div className="w-1/6 bg-blue-200 dark:bg-blue-800 h-3 rounded-t"></div>
                                <div className="w-1/6 bg-blue-300 dark:bg-blue-700 h-2 rounded-t"></div>
                                <div className="w-1/6 bg-blue-400 dark:bg-blue-600 h-4 rounded-t"></div>
                                <div className="w-1/6 bg-blue-500 dark:bg-blue-500 h-5 rounded-t"></div>
                                <div className="w-1/6 bg-primary h-6 rounded-t"></div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-5 shadow-sm hover:border-primary transition-colors group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Saved Research</p>
                                    <p className="text-2xl font-bold text-text-light dark:text-white mt-1">48</p>
                                </div>
                                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-md group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/50 transition-colors">
                                    <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-500 text-[24px]">star_border</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-text-muted-light dark:text-text-muted-dark">
                                <span>Last saved: "Neural Networks..."</span>
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
                                {[
                                    { title: "Deep Learning Architectures for Genomics", degree: "PhD", dept: "Bioinformatics", author: "Alice Chen", initial: "A", year: "2023", color: "purple" },
                                    { title: "Optimizing Database Queries with AI", degree: "MSc", dept: "Database Systems", author: "Mark Wilson", initial: "M", year: "2023", color: "blue", saved: true },
                                    { title: "Sustainable Energy Grid Analysis", degree: "BSc", dept: "Electrical Eng", author: "Sarah Jenkins", initial: "S", year: "2022", color: "green" },
                                    { title: "Natural Language Processing in Law", degree: "MSc", dept: "AI & Law", author: "Raj Patel", initial: "R", year: "2023", color: "blue" }
                                ].map((item, idx) => (
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
                                ))}
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            {/* Insight Card */}
                            <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-secondary text-[20px]">auto_awesome</span>
                                    <h3 className="font-semibold text-text-light dark:text-white">AI Research Insights</h3>
                                </div>
                                <div className="text-sm text-text-muted-light dark:text-text-muted-dark space-y-3">
                                    <p className="leading-relaxed">
                                        Based on recent uploads in <span className="font-medium text-text-light dark:text-white">Computer Science</span>, there is a <span className="text-green-600 dark:text-green-400 font-medium">15% increase</span> in projects utilizing Transformer architectures.
                                    </p>
                                    <div className="p-3 bg-surface-light dark:bg-gray-800 rounded border border-border-light dark:border-border-dark text-xs">
                                        <strong>Tip:</strong> Consider exploring "Attention Mechanisms" for your next thesis topic to align with current department trends.
                                    </div>
                                </div>
                                <button className="w-full mt-4 py-2 px-4 bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded text-sm font-medium text-text-light dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    Generate New Report
                                </button>
                            </div>

                            {/* Tags Card */}
                            <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-5 shadow-sm">
                                <h3 className="font-semibold text-text-light dark:text-white mb-4">Trending Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: "Machine Learning", trending: true },
                                        { label: "Blockchain", trending: false },
                                        { label: "Climate Change", trending: false },
                                        { label: "Data Science", trending: true },
                                        { label: "Cybersecurity", trending: false },
                                        { label: "Quantum Computing", trending: false },
                                        { label: "Genomics", trending: false },
                                    ].map((tag, idx) => (
                                        <button 
                                            key={idx}
                                            className={`
                                                px-2.5 py-1 rounded-full text-xs font-medium transition-colors border
                                                ${tag.trending 
                                                    ? "bg-blue-50 text-primary hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-900/60 border-blue-100 dark:border-blue-800" 
                                                    : "bg-surface-light text-text-muted-light hover:bg-gray-200 dark:bg-gray-800 dark:text-text-muted-dark dark:hover:bg-gray-700 border-border-light dark:border-border-dark"
                                                }
                                            `}
                                        >
                                            {tag.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

