import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../config/firebase';
import { collection, query, where, getCountFromServer, getDocs, orderBy, limit } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export const DashboardPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { currentUser } = useAuth();
    const [stats, setStats] = useState({ uploads: 0, saved: 0 });
    const [recentUploads, setRecentUploads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;

            try {
                // 1. Get Counts
                const projectsQuery = query(
                    collection(db, "projects"), 
                    where("studentId", "==", currentUser.uid)
                );
                const projectsSnapshot = await getCountFromServer(projectsQuery);

                const savedQuery = query(
                    collection(db, "saved_items"), 
                    where("userId", "==", currentUser.uid)
                );
                const savedSnapshot = await getCountFromServer(savedQuery);

                setStats({
                    uploads: projectsSnapshot.data().count,
                    saved: savedSnapshot.data().count
                });

                // 2. Get Recent Uploads
                // Note: Complex queries with orderBy might need an index. 
                // We'll fetch all by student and sort client-side for now to avoid blocking if index missing.
                const recentQuery = query(
                    collection(db, "projects"),
                    where("studentId", "==", currentUser.uid)
                );
                const recentSnapshot = await getDocs(recentQuery);
                const uploads = recentSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() || new Date()
                }));
                
                // Sort by date desc
                uploads.sort((a, b) => b.createdAt - a.createdAt);
                
                setRecentUploads(uploads.slice(0, 5));

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'verified': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
            default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
        }
    };

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
                                <span>Track your contributions</span>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-5 shadow-sm hover:border-primary transition-colors group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Pending Review</p>
                                    <p className="text-2xl font-bold text-text-light dark:text-white mt-1">
                                        {recentUploads.filter(p => !p.status || p.status === 'Pending').length}
                                    </p>
                                </div>
                                <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-md group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[24px]">hourglass_empty</span>
                                </div>
                            </div>
                         </div>

                        {/* Card 3 */}
                        <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-5 shadow-sm hover:border-primary transition-colors group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Saved Items</p>
                                    <p className="text-2xl font-bold text-text-light dark:text-white mt-1">{stats.saved}</p>
                                </div>
                                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-md group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/50 transition-colors">
                                    <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-500 text-[24px]">star_border</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Recent Uploads List */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-semibold text-text-light dark:text-white">Your Recent Uploads</h2>
                                <Link to="/uploads" className="text-sm text-primary hover:underline">View all</Link>
                            </div>
                            
                            <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm overflow-hidden">
                                {loading ? (
                                    <div className="p-8 text-center"><div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full"></div></div>
                                ) : recentUploads.length > 0 ? (
                                    <div className="divide-y divide-border-light dark:divide-border-dark">
                                        <div className="bg-surface-light dark:bg-[#161B22] px-4 py-3 grid grid-cols-12 gap-4 text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                                            <div className="col-span-6">Title</div>
                                            <div className="col-span-3">Status</div>
                                            <div className="col-span-3 text-right">Date</div>
                                        </div>
                                        {recentUploads.map((item) => (
                                            <div key={item.id} className="group px-4 py-4 grid grid-cols-12 gap-4 items-center hover:bg-surface-light dark:hover:bg-gray-800 transition-colors">
                                                <div className="col-span-6">
                                                    <div className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-[20px]">
                                                            {item.fileUrl ? 'description' : 'folder'}
                                                        </span>
                                                        <Link to={`/repository/${item.id}`} className="font-medium text-gray-900 dark:text-white hover:text-primary truncate block">
                                                            {item.title}
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="col-span-3">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status || 'Pending')}`}>
                                                        {item.status || 'Pending'}
                                                    </span>
                                                </div>
                                                <div className="col-span-3 text-right text-xs text-text-muted-light dark:text-text-muted-dark">
                                                    {format(item.createdAt, 'MMM dd, yyyy')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-text-muted-light dark:text-text-muted-dark">
                                        <p>You haven't uploaded any projects yet.</p>
                                        <Link to="/uploads/new" className="text-primary hover:underline mt-2 inline-block">Upload your first project</Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Activity / Notifications (Concept) */}
                        <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-5 shadow-sm h-fit">
                            <h3 className="text-lg font-semibold text-text-light dark:text-white mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link to="/uploads/new" className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-sm">upload</span>
                                    New Upload
                                </Link>
                                <Link to="/notifications" className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 text-text-light dark:text-white rounded-lg transition-colors">
                                    <span className="material-symbols-outlined text-sm">notifications</span>
                                    Notifications
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

