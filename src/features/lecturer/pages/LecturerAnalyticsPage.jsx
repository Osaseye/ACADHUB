import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore'; 
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
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export const LecturerAnalyticsPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { currentUser, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (authLoading || !currentUser) return;

            try {
                // Fetch all projects for analytics
                // In production, we should filter by department or use aggregation queries
                const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                
                const projects = snapshot.docs.map(doc => {
                    const d = doc.data();
                    let createdAt = new Date();
                    if (d.createdAt && d.createdAt.toDate) {
                        createdAt = d.createdAt.toDate();
                    } else if (d.createdAt) {
                        createdAt = new Date(d.createdAt);
                    }
                    return { id: doc.id, ...d, createdAt };
                });

                // 1. Calculate KPI Counts
                let total = projects.length;
                let verified = projects.filter(p => p.status === 'verified').length;
                let pending = projects.filter(p => !p.status || p.status === 'Pending').length;
                let rejected = projects.filter(p => p.status === 'Rejected').length;

                // 2. Degree Distribution & Trends
                let bsc = 0, msc = 0, phd = 0;
                
                // Last 6 Months Buckets
                const last6Months = Array.from({ length: 6 }, (_, i) => {
                    const d = subMonths(new Date(), 5 - i);
                    return {
                        label: format(d, 'MMM'),
                        monthStart: startOfMonth(d),
                        monthEnd: endOfMonth(d),
                        count: 0
                    };
                });

                projects.forEach(p => {
                    // Degree
                    const type = (p.type || '').toLowerCase();
                    if (type.includes('bsc')) bsc++;
                    else if (type.includes('msc') || type.includes('master')) msc++;
                    else if (type.includes('phd') || type.includes('doctor')) phd++;
                    else bsc++; // Default bucket

                    // Trend
                    const bucket = last6Months.find(m => 
                        isWithinInterval(p.createdAt, { start: m.monthStart, end: m.monthEnd })
                    );
                    if (bucket) bucket.count++;
                });

                setStats({
                    total,
                    verifiedCount: verified,
                    pendingCount: pending,
                    rejectedCount: rejected,
                    successRate: total > 0 ? Math.round((verified / total) * 100) : 0,
                    trendData: {
                        labels: last6Months.map(m => m.label),
                        datasets: [
                            {
                                label: 'Monthly Submissions',
                                data: last6Months.map(m => m.count),
                                borderColor: '#0ea5e9', // sky-500
                                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                                tension: 0.4,
                                fill: true,
                                pointBackgroundColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 4
                            }
                        ]
                    },
                    degreeDistribution: {
                        labels: ['BSc', 'MSc', 'PhD'],
                        datasets: [
                            {
                                data: [bsc, msc, phd],
                                backgroundColor: [
                                    '#3b82f6', // blue-500
                                    '#8b5cf6', // violet-500
                                    '#f43f5e'  // rose-500
                                ],
                                borderWidth: 0,
                                hoverOffset: 4
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
    }, [currentUser, authLoading]);

    if (authLoading || (loading && currentUser)) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-[#0f172a]">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!currentUser) return null;

    if (!stats) return null;

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
                role="lecturer"
            />

            <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0f172a]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Department Analytics</h1>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Projects</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total}</p>
                        </div>
                        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">Verified</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.verifiedCount}</p>
                        </div>
                        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
                            <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending Review</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.pendingCount}</p>
                        </div>
                        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
                            <p className="text-sm font-medium text-red-600 dark:text-red-400">Rejected</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.rejectedCount}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Trend Chart */}
                        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Submission Trends</h3>
                            <div className="h-72">
                                <Line 
                                    data={stats.trendData} 
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            y: { grid: { color: isSidebarCollapsed ? '#f3f4f6' : '#374151' } }, // Simple dark mode guess, better to use CSS var
                                            x: { grid: { display: false } }
                                        }
                                    }} 
                                />
                            </div>
                        </div>

                        {/* Distribution Chart */}
                        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Degree Distribution</h3>
                            <div className="h-64 flex items-center justify-center">
                                <Doughnut 
                                    data={stats.degreeDistribution} 
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { 
                                            legend: { position: 'bottom' } 
                                        }
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
