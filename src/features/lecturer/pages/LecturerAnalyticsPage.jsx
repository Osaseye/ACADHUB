import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { db } from '../../../config/firebase';
import { collection, getDocs } from 'firebase/firestore'; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const LecturerAnalyticsPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        bsc: 0,
        msc: 0,
        phd: 0,
        verifiedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
        successRate: 0,
        monthlyData: {
            labels: [],
            datasets: []
        },
        degreeDistribution: {
            labels: [],
            datasets: []
        }
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Fetch all projects for departmental analytics
                const snapshot = await getDocs(collection(db, "projects"));
                
                let total = 0;
                let bscCount = 0;
                let mscCount = 0;
                let phdCount = 0;
                let verified = 0;
                let pending = 0;
                let rejected = 0;

                const monthMap = {};
                // Initialize last 6 months or simplify to fixed months for now
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                months.forEach(m => monthMap[m] = 0);

                snapshot.forEach(doc => {
                    total++;
                    const data = doc.data();
                    const type = (data.type || '').toLowerCase();
                    const status = (data.status || 'pending').toLowerCase();
                    
                    // Handle timestamp: if it's a Firestore timestamp, convert. Else create now.
                    // Assuming createdAt exists.
                    let date = new Date();
                    if (data.createdAt && data.createdAt.toDate) {
                        date = data.createdAt.toDate();
                    } else if (data.createdAt) {
                        date = new Date(data.createdAt);
                    }
                    
                    const monthName = months[date.getMonth()];
                    if (monthMap[monthName] !== undefined) {
                        monthMap[monthName]++;
                    }

                    if (type.includes('bsc')) bscCount++;
                    else if (type.includes('msc') || type.includes('master')) mscCount++;
                    else if (type.includes('phd') || type.includes('doctor')) phdCount++;
                    else bscCount++; // Default

                    if (status === 'verified' || status === 'published') verified++;
                    else if (status === 'rejected' || status === 'returned') rejected++;
                    else pending++;
                });

                const monthlyCounts = months.map(m => monthMap[m]);

                setStats({
                    total,
                    bsc: bscCount,
                    msc: mscCount,
                    phd: phdCount,
                    verifiedCount: verified,
                    pendingCount: pending,
                    rejectedCount: rejected,
                    successRate: total > 0 ? Math.round((verified / total) * 100) : 0,
                    monthlyData: {
                        labels: months,
                        datasets: [
                            {
                                label: 'Submissions',
                                data: monthlyCounts,
                                borderColor: '#009688',
                                backgroundColor: 'rgba(0, 150, 136, 0.5)',
                                tension: 0.3
                            }
                        ]
                    },
                    degreeDistribution: {
                        labels: ['BSc', 'MSc', 'PhD'],
                        datasets: [
                            {
                                data: [bscCount, mscCount, phdCount],
                                backgroundColor: [
                                    '#3b82f6', // blue-500
                                    '#8b5cf6', // violet-500
                                    '#f43f5e'  // rose-500
                                ],
                                borderColor: [
                                    '#2563eb',
                                    '#7c3aed',
                                    '#e11d48'
                                ],
                                borderWidth: 1,
                            },
                        ],
                    }
                });

            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-[#0f172a] font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
             <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
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
                                        <p className="text-3xl font-bold text-[#0f2c59] dark:text-white mt-1">{loading ? '...' : stats.total}</p>
                                    </div>
                                    <span className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-xs">trending_up</span> 
                                        +5%
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                                    <div className="flex flex-col w-1/3 border-r border-slate-100 dark:border-slate-700 pr-2">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">BSc</span>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{stats.bsc}</span>
                                    </div>
                                    <div className="flex flex-col w-1/3 border-r border-slate-100 dark:border-slate-700 px-2">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">MSc</span>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{stats.msc}</span>
                                    </div>
                                    <div className="flex flex-col w-1/3 pl-2">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">PhD</span>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{stats.phd}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Avg AI Novelty Score */}
                            <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-[#D0D7DE] dark:border-slate-700 shadow-sm transition-colors duration-300">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg. AI Novelty Score</h3>
                                        <p className="text-3xl font-bold text-[#0f2c59] dark:text-white mt-1">-</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined">auto_awesome</span>
                                    </div>
                                </div>
                                <div className="h-10 flex items-end gap-1 mt-2 justify-center">
                                    <p className="text-xs text-slate-400">No data available</p>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">-</p>
                            </div>

                            {/* Submission Success Rate */}
                            <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-[#D0D7DE] dark:border-slate-700 shadow-sm transition-colors duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Submission Success Rate</h3>
                                        <p className="text-3xl font-bold text-[#0f2c59] dark:text-white mt-1">{stats.successRate}%</p>
                                    </div>
                                    <span className="bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs font-medium px-2 py-1 rounded-full border border-slate-200 dark:border-slate-600">
                                        Overall
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 mb-2 overflow-hidden">
                                     <div className="bg-[#009688] h-2.5 rounded-full" style={{ width: `${stats.successRate}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                    <span>{stats.verifiedCount} Verified</span>
                                    <span>{stats.total} Requests</span>
                                </div>
                            </div>
                        </div>

                        {/* Charts Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                            {/* Topic Evolution */}
                            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-[#D0D7DE] dark:border-slate-700 shadow-sm lg:col-span-2 flex flex-col transition-colors duration-300">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Topic Evolution</h3>
                                </div>
                                <div className="relative flex-grow flex items-center justify-center">
                                    {loading ? (
                                        <p className="text-slate-400">Loading...</p>
                                    ) : stats.monthlyData.datasets.length > 0 ? (
                                        <Line 
                                            data={stats.monthlyData} 
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        position: 'top',
                                                    },
                                                },
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        grid: {
                                                            color: 'rgba(0, 0, 0, 0.05)'
                                                        }
                                                    },
                                                    x: {
                                                        grid: {
                                                            display: false
                                                        }
                                                    }
                                                }
                                            }} 
                                        />
                                    ) : (
                                        <p className="text-slate-400">No trend data available</p>
                                    )}
                                </div>
                            </div>

                            {/* Degree Distribution */}
                            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-[#D0D7DE] dark:border-slate-700 shadow-sm flex flex-col transition-colors duration-300">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Degree Distribution</h3>
                                <div className="flex-grow flex items-center justify-center relative">
                                    {loading ? (
                                        <p className="text-slate-400">Loading...</p>
                                    ) : stats.degreeDistribution.datasets.length > 0 ? (
                                        <div className="w-full h-full relative">
                                            <Doughnut 
                                                data={stats.degreeDistribution} 
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        legend: {
                                                            position: 'bottom',
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-48 h-48 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                           <span className="text-slate-400 text-sm">No data</span>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 space-y-2">
                                     <div className="flex justify-between text-xs text-slate-500">
                                         <span>BSc: {stats.bsc}</span>
                                         <span>MSc: {stats.msc}</span>
                                         <span>PhD: {stats.phd}</span>
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
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center items-center h-40">
                                    <p className="text-slate-400 italic">No keyword clusters found.</p>
                                </div>
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
                                <div className="space-y-4 relative z-10 min-h-[140px] flex items-center justify-center">
                                    <p className="text-slate-300 italic">Insufficient data to generate forecast.</p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center relative z-10">
                                    <span className="text-xs text-slate-300">Requires semester data</span>
                                    <button className="text-xs bg-white/20 px-3 py-1.5 rounded text-white cursor-not-allowed opacity-50" disabled>Generate Full Report</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
