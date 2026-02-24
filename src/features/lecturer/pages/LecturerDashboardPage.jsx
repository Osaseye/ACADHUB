import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../config/firebase';
import { collection, query, where, getCountFromServer, getDocs, limit, orderBy } from 'firebase/firestore';

export const LecturerDashboardPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { currentUser } = useAuth();
    const [greeting, setGreeting] = useState("Welcome back");
    
    // Real Data State
    const [stats, setStats] = useState({
        pendingRequests: 0,
        activeStudents: 0,
        totalPublications: 0
    });
    const [recentRequests, setRecentRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!currentUser) return;
            
            try {
                // 1. Pending Requests Count (Supervision + Project Reviews)
                const requestsRef = collection(db, "supervision_requests");
                const supervisionPendingQuery = query(
                    requestsRef, 
                    where("lecturerId", "==", currentUser.uid),
                    where("status", "==", "pending")
                );
                const supervisionPendingSnapshot = await getCountFromServer(supervisionPendingQuery);

                const projectsRef = collection(db, "projects");
                const projectReviewQuery = query(
                    projectsRef,
                    where("supervisorId", "==", currentUser.uid),
                    where("status", "==", "Pending") // Note: Case sensitive 'Pending' from upload page
                );
                const projectReviewSnapshot = await getCountFromServer(projectReviewQuery);

                const totalPending = supervisionPendingSnapshot.data().count + projectReviewSnapshot.data().count;

                // 2. Active Students Count (Accepted Requests)
                const activeQuery = query(
                    requestsRef,
                    where("lecturerId", "==", currentUser.uid),
                    where("status", "==", "approved")
                );
                const activeSnapshot = await getCountFromServer(activeQuery);

                // 3. Total Publications Count
                // projectsRef already declared above if used in block 1. Let's just create a new query.
                // Assuming 'uploadedBy' or 'studentId' for Lecturer own pubs? Lecturers usually have their own pubs.
                // Or maybe supervisor ones? Let's stick to 'uploadedBy' for their own papers.
                const pubsQuery = query(
                    projectsRef,
                    where("uploadedBy", "==", currentUser.uid) 
                );
                const pubsSnapshot = await getCountFromServer(pubsQuery);

                setStats({
                    pendingRequests: totalPending,
                    activeStudents: activeSnapshot.data().count,
                    totalPublications: pubsSnapshot.data().count
                });

                // 4. Fetch Recent Requests (Both Supervision & Projects)
                const recentQuery = query(
                    requestsRef,
                    where("lecturerId", "==", currentUser.uid),
                    where("status", "==", "pending"),
                    orderBy("createdAt", "desc"),
                    limit(5)
                );
                const recentDocs = await getDocs(recentQuery);
                const supervisionRequests = recentDocs.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    type: 'supervision'
                }));

                const recentProjectQuery = query(
                    projectsRef,
                    where("supervisorId", "==", currentUser.uid),
                    where("status", "==", "Pending"),
                    limit(5)
                );
                const recentProjectDocs = await getDocs(recentProjectQuery);
                const projectRequests = recentProjectDocs.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    type: 'project_review',
                    studentName: doc.data().studentName || 'Unknown Student',
                    // Map title to 'topic' property for consistent display in list if needed
                    topic: `Project Review: ${doc.data().title}` 
                }));

                // Combine and Sort
                const recentCombined = [...supervisionRequests, ...projectRequests]
                    .sort((a, b) => {
                        const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                        const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                        return dateB - dateA;
                    })
                    .slice(0, 5);

                setRecentRequests(recentCombined);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [currentUser]);

    const isVerified = currentUser?.verificationStatus === 'verified';
    const isPending = currentUser?.verificationStatus === 'pending';

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
                        <p className="text-sm text-gray-500 dark:text-gray-400">{greeting}, {currentUser?.displayName || 'Lecturer'}.</p>
                    </div>

                    {/* Verification Status Banner */}
                    {isPending && (
                        <div className="mb-8 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4 flex items-start gap-3">
                            <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-500 mt-0.5">verified_user</span>
                            <div>
                                <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-500">Account Verification Pending</h3>
                                <p className="text-sm text-yellow-700 dark:text-yellow-600 mt-1">
                                    Your profile is currently under review by the administration. You can browse the platform, but some features (like accepting students) will be limited until verified.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Requests</p>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.pendingRequests}</h3>
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
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.activeStudents}</h3>
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
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalPublications}</h3>
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
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</h3>
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
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Requests</h3>
                                <Link to="/lecturer/supervision" className="text-sm text-primary hover:underline">View All</Link>
                            </div>
                            <div className="divide-y divide-border-light dark:divide-border-dark">
                                {isLoading ? (
                                    <div className="p-8 text-center text-gray-500">Loading requests...</div>
                                ) : recentRequests.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        No pending supervision requests.
                                    </div>
                                ) : (
                                    recentRequests.map((request) => (
                                        <div key={request.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-sm">
                                                    {(request.studentName || 'S').charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-text-light dark:text-white">
                                                        {request.studentName || 'Student'} 
                                                        {request.type === 'project_review' ? (
                                                            <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
                                                                Project Review
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs font-normal text-text-muted-light dark:text-text-muted-dark ml-2">
                                                                ({request.degree || 'B.Sc'})
                                                            </span>
                                                        )}
                                                    </h4>
                                                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark line-clamp-1">
                                                        {request.type === 'project_review' ? request.topic : `Topic: ${request.proposedTopic || 'No topic specified'}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link 
                                                    to={request.type === 'project_review' ? `/lecturer/review/${request.id}` : `/lecturer/supervision/${request.id}`} 
                                                    className="px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Grant Alerts */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Research Grants</h3>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No active grant alerts.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};
