import React, { useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';


export const LecturerAnalyticsPage = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-[#0f172a] font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
             <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                role="lecturer"
            />

            <main className="flex-grow flex flex-col overflow-hidden bg-[#F6F8FA] dark:bg-[#0f172a]">
                <header className="bg-white dark:bg-[#1e293b] border-b border-[#D0D7DE] dark:border-slate-700 h-16 flex items-center justify-between px-8 shrink-0 transition-colors duration-300">
                    <h1 className="text-xl font-bold text-[#0f2c59] dark:text-white">Departmental Research Analytics</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <select className="appearance-none bg-slate-50 dark:bg-slate-800 border border-[#D0D7DE] dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg pl-3 pr-10 py-2 focus:ring-[#009688] focus:border-[#009688] outline-none">
                                <option>Computer Science</option>
                                <option>Data Science</option>
                                <option>Artificial Intelligence</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                <span className="material-symbols-outlined text-lg">expand_more</span>
                            </div>
                        </div>
                        <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-[#D0D7DE] dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-400 gap-2">
                            <span className="material-symbols-outlined text-lg text-slate-400">calendar_today</span>
                            <span>Last 12 Months</span>
                            <span className="material-symbols-outlined text-lg text-slate-400 cursor-pointer">expand_more</span>
                        </div>
                    </div>
                </header>

                <div className="flex-grow overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] p-8 bg-[#F6F8FA] dark:bg-[#0f172a]">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Total Submissions */}
                            <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-[#D0D7DE] dark:border-slate-700 shadow-sm transition-colors duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Submissions</h3>
                                        <p className="text-3xl font-bold text-[#0f2c59] dark:text-white mt-1">142</p>
                                    </div>
                                    <span className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 border border-green-100 dark:border-green-800">
                                        <span className="material-symbols-outlined text-xs">trending_up</span> 
                                        +12%
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                                    <div className="flex flex-col w-1/3 border-r border-slate-100 dark:border-slate-700 pr-2">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">BSc</span>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">86</span>
                                    </div>
                                    <div className="flex flex-col w-1/3 border-r border-slate-100 dark:border-slate-700 px-2">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">MSc</span>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">42</span>
                                    </div>
                                    <div className="flex flex-col w-1/3 pl-2">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">PhD</span>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">14</span>
                                    </div>
                                </div>
                            </div>

                            {/* Avg AI Novelty Score */}
                            <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-[#D0D7DE] dark:border-slate-700 shadow-sm transition-colors duration-300">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg. AI Novelty Score</h3>
                                        <p className="text-3xl font-bold text-[#0f2c59] dark:text-white mt-1">78.4</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-[#009688]/10 flex items-center justify-center text-[#009688]">
                                        <span className="material-symbols-outlined">auto_awesome</span>
                                    </div>
                                </div>
                                <div className="h-10 flex items-end gap-1 mt-2">
                                    <div className="w-1/12 bg-[#009688]/20 h-[40%] rounded-sm"></div>
                                    <div className="w-1/12 bg-[#009688]/30 h-[50%] rounded-sm"></div>
                                    <div className="w-1/12 bg-[#009688]/40 h-[45%] rounded-sm"></div>
                                    <div className="w-1/12 bg-[#009688]/50 h-[60%] rounded-sm"></div>
                                    <div className="w-1/12 bg-[#009688]/60 h-[55%] rounded-sm"></div>
                                    <div className="w-1/12 bg-[#009688]/70 h-[70%] rounded-sm"></div>
                                    <div className="w-1/12 bg-[#009688]/80 h-[80%] rounded-sm"></div>
                                    <div className="w-1/12 bg-[#009688]/90 h-[75%] rounded-sm"></div>
                                    <div className="w-1/12 bg-[#009688] h-[90%] rounded-sm"></div>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Trend over last 9 months</p>
                            </div>

                            {/* Submission Success Rate */}
                            <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-[#D0D7DE] dark:border-slate-700 shadow-sm transition-colors duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Submission Success Rate</h3>
                                        <p className="text-3xl font-bold text-[#0f2c59] dark:text-white mt-1">92%</p>
                                    </div>
                                    <span className="bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs font-medium px-2 py-1 rounded-full border border-slate-200 dark:border-slate-600">
                                        Year Avg
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 mb-2 overflow-hidden">
                                    <div className="bg-[#0f2c59] dark:bg-blue-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                    <span>8% Revisions Requested</span>
                                    <span>0% Rejections</span>
                                </div>
                            </div>
                        </div>

                        {/* Charts Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                            {/* Topic Evolution */}
                            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-[#D0D7DE] dark:border-slate-700 shadow-sm lg:col-span-2 flex flex-col transition-colors duration-300">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Topic Evolution</h3>
                                    <div className="flex gap-4 text-xs">
                                        <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#0f2c59] dark:bg-blue-500"></span> <span className="dark:text-slate-300">AI & ML</span></div>
                                        <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#009688]"></span> <span className="dark:text-slate-300">Cybersecurity</span></div>
                                        <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> <span className="dark:text-slate-300">IoT</span></div>
                                    </div>
                                </div>
                                <div className="relative flex-grow border-l border-b border-slate-200 dark:border-slate-700">
                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                        <div className="w-full h-px bg-slate-100 dark:bg-slate-700/50"></div>
                                        <div className="w-full h-px bg-slate-100 dark:bg-slate-700/50"></div>
                                        <div className="w-full h-px bg-slate-100 dark:bg-slate-700/50"></div>
                                        <div className="w-full h-px bg-slate-100 dark:bg-slate-700/50"></div>
                                        <div className="w-full h-px bg-slate-100 dark:bg-slate-700/50"></div>
                                    </div>
                                    <svg className="absolute inset-0 w-full h-full p-2" preserveAspectRatio="none">
                                        <polyline fill="none" points="0,200 100,180 200,150 300,100 400,80 500,40 600,20" className="stroke-[#0f2c59] dark:stroke-blue-500" strokeWidth="3"></polyline>
                                        <polyline fill="none" points="0,150 100,160 200,140 300,180 400,160 500,140 600,120" stroke="#009688" strokeWidth="3"></polyline>
                                        <polyline fill="none" points="0,220 100,210 200,190 300,200 400,210 500,180 600,160" stroke="#a855f7" strokeDasharray="5,5" strokeWidth="3"></polyline>
                                    </svg>
                                    <div className="absolute -bottom-6 left-0 w-full flex justify-between text-xs text-slate-400 px-2">
                                        <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
                                    </div>
                                </div>
                            </div>

                            {/* Degree Distribution */}
                            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-[#D0D7DE] dark:border-slate-700 shadow-sm flex flex-col transition-colors duration-300">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Degree Distribution</h3>
                                <div className="flex-grow flex items-center justify-center relative">
                                    <div className="w-48 h-48 rounded-full" style={{ background: 'conic-gradient(#0f2c59 0% 60%, #009688 60% 90%, #a855f7 90% 100%)' }}>
                                        <div className="w-32 h-32 bg-white dark:bg-[#1e293b] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col transition-colors duration-300">
                                            <span className="text-2xl font-bold text-slate-800 dark:text-white">142</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">Total Papers</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded bg-[#0f2c59]"></span>
                                            <span className="text-slate-600 dark:text-slate-300">BSc (Undergrad)</span>
                                        </div>
                                        <span className="font-semibold text-slate-800 dark:text-white">60%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded bg-[#009688]"></span>
                                            <span className="text-slate-600 dark:text-slate-300">MSc (Masters)</span>
                                        </div>
                                        <span className="font-semibold text-slate-800 dark:text-white">30%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded bg-purple-500"></span>
                                            <span className="text-slate-600 dark:text-slate-300">PhD (Research)</span>
                                        </div>
                                        <span className="font-semibold text-slate-800 dark:text-white">10%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Keyword Clusters & Forecast */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                            {/* Research Keyword Clusters */}
                            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-[#D0D7DE] dark:border-slate-700 shadow-sm transition-colors duration-300">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Research Keyword Clusters</h3>
                                    <button className="text-[#009688] text-sm font-medium hover:underline">View All</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-4 py-2 bg-[#0f2c59] text-white rounded text-sm font-medium">Neural Networks (45)</span>
                                    <span className="px-3 py-2 bg-[#0f2c59]/90 text-white rounded text-sm font-medium">Deep Learning (38)</span>
                                    <span className="px-3 py-2 bg-[#0f2c59]/80 text-white rounded text-sm">IoT Security (32)</span>
                                    <span className="px-3 py-2 bg-[#0f2c59]/70 text-white rounded text-sm">Blockchain (28)</span>
                                    <span className="px-2 py-2 bg-[#0f2c59]/60 text-white rounded text-sm">Computer Vision (22)</span>
                                    <span className="px-2 py-2 bg-[#0f2c59]/50 text-white rounded text-sm">NLP (19)</span>
                                    <span className="px-2 py-2 bg-[#0f2c59]/40 text-slate-800 dark:text-black rounded text-sm">Robotics (15)</span>
                                    <span className="px-2 py-2 bg-[#0f2c59]/30 text-slate-800 dark:text-black rounded text-sm">Data Mining (12)</span>
                                    <span className="px-2 py-2 bg-[#0f2c59]/20 text-slate-800 dark:text-black rounded text-sm">Cloud Comp. (9)</span>
                                    <span className="px-2 py-2 bg-[#0f2c59]/10 text-slate-800 dark:text-slate-200 rounded text-sm">UX Design (7)</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-4 italic">*Size and color intensity indicate frequency of keyword in approved submissions.</p>
                            </div>

                            {/* AI Departmental Forecast */}
                            <div className="bg-gradient-to-br from-[#0f2c59] to-[#1a3b6e] p-6 rounded-xl border border-[#0f2c59] shadow-lg text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <span className="material-symbols-outlined text-9xl">psychology</span>
                                </div>
                                <div className="flex items-center gap-2 mb-4 relative z-10">
                                    <span className="bg-[#009688]/20 p-1.5 rounded-lg border border-[#009688]/40">
                                        <span className="material-symbols-outlined text-[#009688] text-xl">auto_awesome</span>
                                    </span>
                                    <h3 className="text-lg font-bold">AI Departmental Forecast</h3>
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                                        <h4 className="text-[#e0f2f1] text-sm font-bold uppercase tracking-wide mb-1">Emerging Strength</h4>
                                        <p className="text-sm text-slate-100 leading-relaxed">
                                            High correlation between <span className="font-semibold text-white">"Edge Computing"</span> and <span className="font-semibold text-white">"Green Energy"</span> topics suggests a developing niche. Recommend funding additional grants in Sustainable IoT.
                                        </p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                                        <h4 className="text-orange-200 text-sm font-bold uppercase tracking-wide mb-1">Gap Analysis</h4>
                                        <p className="text-sm text-slate-100 leading-relaxed">
                                            Submissions in <span className="font-semibold text-white">"Quantum Computing"</span> have dropped by 40% YoY compared to industry trends. Consider guest lectures to reignite student interest.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center relative z-10">
                                    <span className="text-xs text-slate-300">Generated based on current semester data</span>
                                    <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-white transition-colors">Generate Full Report</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
