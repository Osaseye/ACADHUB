import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { useAuth } from '../../../context/AuthContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';  
import { db } from '../../../config/firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore'; 
import { toast } from 'sonner';
import { format, subMonths, startOfMonth, parseISO, compareAsc } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const AdminDashboardPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { currentUser, loading: authLoading } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProjects: 0,
        pendingVerifications: 0,
        activeResearchers: 0
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (authLoading) return;
            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                console.log("Fetching dashboard data...");
                // 1. Fetch Users
                const usersRef = collection(db, "users");
                // Fetch all users for accurate stats in small-scale app
                const usersSnapshot = await getDocs(usersRef);
                const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log("Fetched Users:", users.length, users);
                
                // 2. Fetch Projects
                const projectsRef = collection(db, "projects");
                const projectsSnapshot = await getDocs(projectsRef);
                const projects = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log("Fetched Projects:", projects.length, projects);

                // 3. Calculate Stats
                const totalUsers = users.length;
                const totalProjects = projects.length;
                const pendingVerifications = users.filter(u => u.verificationStatus === 'pending' && u.role === 'lecturer').length;
                const activeResearchers = users.filter(u => u.role === 'lecturer').length; 

                setStats({
                    totalUsers,
                    totalProjects,
                    pendingVerifications,
                    activeResearchers
                });

                // Helper to safely parse dates
                const getDate = (item) => {
                    if (!item?.createdAt) return new Date(0);
                    if (item.createdAt.seconds) return new Date(item.createdAt.seconds * 1000);
                    if (item.createdAt instanceof Date) return item.createdAt;
                    if (typeof item.createdAt === 'string') return new Date(item.createdAt);
                    if (typeof item.createdAt === 'number') return new Date(item.createdAt);
                    return new Date(0);
                };

                // 4. Set Recent Users (Top 5)
                const sortedUsers = [...users].sort((a, b) => {
                     return getDate(b) - getDate(a); 
                }).slice(0, 5);
                setRecentUsers(sortedUsers);

                // 5. Generate Chart Data (Last 6 Months User Growth)
                const last6Months = Array.from({ length: 6 }, (_, i) => {
                    const d = subMonths(new Date(), 5 - i);
                    return {
                        label: format(d, 'MMM'),
                        start: startOfMonth(d),
                        count: 0
                    };
                });

                users.forEach(user => {
                    const date = getDate(user);
                    if (date.getTime() > 0) { // Valid date
                        const monthLabel = format(date, 'MMM');
                        const bucket = last6Months.find(m => m.label === monthLabel);
                        if (bucket) {
                            bucket.count++;
                        }
                    }
                });

                setChartData({
                    labels: last6Months.map(m => m.label),
                    datasets: [
                        {
                            label: 'New Users',
                            data: last6Months.map(m => m.count),
                            fill: true,
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderColor: '#3b82f6',
                            tension: 0.4
                        }
                    ]
                });

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error("Failed to load dashboard data: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [currentUser, authLoading]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    color: '#9CA3AF' 
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#1f2937',
                titleColor: '#f3f4f6',
                bodyColor: '#f3f4f6',
                borderColor: '#374151',
                borderWidth: 1
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#374151', 
                    drawBorder: false,
                },
                ticks: { color: '#9CA3AF' },
                precision: 0 
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9CA3AF' }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    if (authLoading) {
         return <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">Loading...</div>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#F3F4F6] dark:bg-[#0D1117] text-gray-900 dark:text-gray-300 font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                role="admin"
            />

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Dashboard</h1>
                        
                        <div className="text-sm text-gray-500">
                             Last updated: {new Date().toLocaleTimeString()}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Users */}
                        <div className="bg-white dark:bg-[#161b22] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                                    <span className="material-symbols-outlined">group</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {loading ? "..." : stats.totalUsers}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Projects */}
                        <div className="bg-white dark:bg-[#161b22] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                                    <span className="material-symbols-outlined">library_books</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Projects</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {loading ? "..." : stats.totalProjects}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Pending Verifications */}
                        <div className="bg-white dark:bg-[#161b22] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 text-amber-600 rounded-lg">
                                    <span className="material-symbols-outlined">verified_user</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending Requests</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {loading ? "..." : stats.pendingVerifications}
                                    </h3>
                                </div>
                            </div>
                        </div>

                         <div className="bg-white dark:bg-[#161b22] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-lg">
                                    <span className="material-symbols-outlined">science</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Researchers</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {loading ? "..." : stats.activeResearchers} 
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white dark:bg-[#161b22] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">User Growth (Last 6 Months)</h3>
                            <div className="h-64">
                                <Line data={chartData} options={chartOptions} />
                            </div>
                        </div>

                        {/* Recent Users List */}
                        <div className="bg-white dark:bg-[#161b22] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Users</h3>
                             <div className="space-y-4">
                                {loading ? (
                                    <p className="text-sm text-gray-500">Loading users...</p>
                                ) : recentUsers.length === 0 ? (
                                    <p className="text-sm text-gray-500">No recent users.</p>
                                ) : (
                                    recentUsers.map((user) => (
                                        <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                                user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 
                                                user.role === 'lecturer' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.displayName || 'Unknown User'}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            <div className="ml-auto">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                                    user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 
                                                    user.role === 'lecturer' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
