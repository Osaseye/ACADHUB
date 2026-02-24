import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { db } from '../../../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler
} from 'chart.js';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler
);

export const TrendsPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    
    // Chart Data States
    const [lineData, setLineData] = useState({ labels: [], datasets: [] });
    const [doughnutData, setDoughnutData] = useState({ labels: [], datasets: [] });
    const [barData, setBarData] = useState({ labels: [], datasets: [] });

    // KPIs
    const [stats, setStats] = useState({
        topTopic: '-',
        growthRate: '0%',
        activeDept: '-',
        totalProjects: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => {
                    const d = doc.data();
                    // Handle Firestore Timestamp
                    const createdAt = d.createdAt?.toDate ? d.createdAt.toDate() : new Date(d.createdAt || Date.now());
                    return { ...d, id: doc.id, createdAt };
                });
                
                setProjects(data);
                processAnalytics(data);
            } catch (error) {
                console.error("Error fetching analytics data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const processAnalytics = (data) => {
        // 1. Degree Distribution (Doughnut)
        const degrees = {};
        data.forEach(p => {
            const type = p.degree || p.type || 'Unknown'; // Normalize 'BSc Project' -> 'BSc' if needed
            // Simple normalization
            let key = type;
            if (type.includes('BSc')) key = 'BSc';
            if (type.includes('MSc') || type.includes('Master')) key = 'MSc';
            if (type.includes('PhD') || type.includes('Doctor')) key = 'PhD';
            
            degrees[key] = (degrees[key] || 0) + 1;
        });

        setDoughnutData({
            labels: Object.keys(degrees),
            datasets: [{
                data: Object.values(degrees),
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        });

        // 2. Trend Over Time (Line Chart - Last 6 Months)
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const d = subMonths(new Date(), 5 - i);
            return {
                label: format(d, 'MMM'),
                monthStart: startOfMonth(d),
                monthEnd: endOfMonth(d),
                count: 0
            };
        });

        data.forEach(p => {
            const bucket = last6Months.find(m => 
                isWithinInterval(p.createdAt, { start: m.monthStart, end: m.monthEnd })
            );
            if (bucket) bucket.count++;
        });

        setLineData({
            labels: last6Months.map(m => m.label),
            datasets: [{
                label: 'New Uploads',
                data: last6Months.map(m => m.count),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#3b82f6',
                pointRadius: 4
            }]
        });

        // 3. Department Activity (Bar/KPI)
        const depts = {};
        data.forEach(p => {
            const dept = p.department || 'Unassigned';
            depts[dept] = (depts[dept] || 0) + 1;
        });
        
        // Find top dept
        let topDept = '-';
        let maxCount = 0;
        Object.entries(depts).forEach(([dept, count]) => {
            if (count > maxCount) {
                maxCount = count;
                topDept = dept;
            }
        });

        setBarData({
            labels: Object.keys(depts).slice(0, 5), // Top 5
            datasets: [{
                label: 'Projects',
                data: Object.values(depts).slice(0, 5),
                backgroundColor: '#6366f1',
                borderRadius: 4
            }]
        });

        // 4. Growth Rate Calculation
        const currentMonthCount = last6Months[5].count;
        const prevMonthCount = last6Months[4].count;
        let growth = 0;
        if (prevMonthCount === 0) {
            growth = currentMonthCount > 0 ? 100 : 0;
        } else {
            growth = ((currentMonthCount - prevMonthCount) / prevMonthCount) * 100;
        }

        // 5. Top Topic (Simple word frequency in titles)
        const words = {};
        data.forEach(p => {
            const titleWords = (p.title || '').toLowerCase().split(/\s+/);
            titleWords.forEach(w => {
                if (w.length > 4) { // Filter small words
                    words[w] = (words[w] || 0) + 1;
                }
            });
        });
        const topWord = Object.entries(words).sort((a, b) => b[1] - a[1])[0];

        setStats({
            topTopic: topWord ? topWord[0] : 'N/A',
            growthRate: `${growth.toFixed(0)}%`,
            activeDept: topDept,
            totalProjects: data.length
        });
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            }
        }
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: document.documentElement.classList.contains('dark') ? '#334155' : '#f1f5f9',
                },
                border: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: false
                },
                 border: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    {/* Header Controls */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trends & Visual Analytics</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Explore research trends across departments and degrees.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <span className="material-symbols-outlined text-lg">school</span>
                                </span>
                                <select className="pl-10 pr-8 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none shadow-sm dark:text-white">
                                    <option>All Degrees</option>
                                    <option>BSc</option>
                                    <option>MSc</option>
                                    <option>PhD</option>
                                </select>
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <span className="material-symbols-outlined text-lg">apartment</span>
                                </span>
                                <select className="pl-10 pr-8 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none shadow-sm dark:text-white">
                                    <option>All Departments</option>
                                    <option>Computer Science</option>
                                    <option>Engineering</option>
                                    <option>Social Sciences</option>
                                    <option>Bio-Med</option>
                                </select>
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <span className="material-symbols-outlined text-lg">calendar_today</span>
                                </span>
                                <select className="pl-10 pr-8 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none shadow-sm dark:text-white">
                                    <option>Last 12 Months</option>
                                    <option>2023</option>
                                    <option>2022</option>
                                    <option>All Time</option>
                                </select>
                            </div>
                            <button className="bg-secondary hover:bg-opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-md transition">
                                <span className="material-symbols-outlined text-lg mr-1">filter_list</span> Apply
                            </button>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Top Trending Topic</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2 capitalize">{stats.topTopic}</h3>
                                <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1 flex items-center font-medium">
                                    Derived from {stats.totalProjects} projects
                                </p>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-primary">
                                <span className="material-symbols-outlined text-2xl">auto_graph</span>
                            </div>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Repository Growth Rate</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats.growthRate}</h3>
                                <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1 flex items-center font-medium">
                                    Month-over-month
                                </p>
                            </div>
                            <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-lg text-teal-600 dark:text-teal-400">
                                <span className="material-symbols-outlined text-2xl">show_chart</span>
                            </div>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Most Active Department</p>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2">{stats.activeDept}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Leading contributions</p>
                            </div>
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <span className="material-symbols-outlined text-2xl">groups</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload Activity (Last 6 Months)</h3>
                                <button className="text-gray-400 hover:text-primary dark:hover:text-primary">
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </div>
                            <div className="relative h-72 w-full">
                                <Line ref={chartRef} data={lineData} options={lineOptions} />
                            </div>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Projects by Degree</h3>
                                <button className="text-gray-400 hover:text-primary dark:hover:text-primary">
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </div>
                            <div className="relative flex-grow flex items-center justify-center h-64">
                                <Doughnut data={doughnutData} options={doughnutOptions} />
                            </div>
                        </div>
                        
                        {/* New Bar Chart (Replacing Heatmap for now as it maps better to Departments) */}
                         <div className="lg:col-span-3 bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Departmental Contribution (Top 5)</h3>
                                <div className="flex items-center gap-2">
                                     {/* Legend placeholder if needed */}
                                </div>
                            </div>
                            <div className="relative w-full h-64">
                                <Bar data={barData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>

                        {/* AI Trends Report */}
                        <div className="lg:col-span-3 bg-gradient-to-r from-secondary to-primary p-[1px] rounded-xl shadow-lg">
                            <div className="bg-surface-light dark:bg-surface-dark rounded-[11px] p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary opacity-10 blur-3xl rounded-full"></div>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                                            <span className="material-symbols-outlined text-white text-xl">psychology</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2 w-full">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                AI-Generated Trend Report
                                                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border border-blue-200 dark:border-blue-800">Beta</span>
                                            </h3>
                                        </div>
                                        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                                            <p className="italic text-text-muted-light dark:text-text-muted-dark">
                                                Report generation requires active data.
                                            </p>
                                        </div>
                                        <div className="pt-2">
                                            <button className="text-xs font-medium text-text-muted-light cursor-not-allowed flex items-center gap-1 transition-colors" disabled>
                                                Generate report <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
