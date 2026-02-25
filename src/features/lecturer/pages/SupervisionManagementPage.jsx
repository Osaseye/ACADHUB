import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../config/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export const SupervisionManagementPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('requests'); // requests | active
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [projectReviews, setProjectReviews] = useState([]);
    const [activeStudents, setActiveStudents] = useState([]);
    // Helper states for merging active students list
    const [activeRequestsList, setActiveRequestsList] = useState([]);
    const [activeProjectsList, setActiveProjectsList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        // 1. Listen for Supervision Requests History (All Statuses)
        const qRequests = query(
            collection(db, 'supervision_requests'),
            where('lecturerId', '==', currentUser.uid),
            // Removed status filter to show history
            orderBy('createdAt', 'desc')
        );

        const unsubscribeRequests = onSnapshot(qRequests, (snapshot) => {
            const reqs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().createdAt?.toDate().toLocaleDateString() || 'Recently'
            }));
            setRequests(reqs);
        }, (error) => {
            console.error("Error fetching requests:", error);
        });

        // 2. Listen for Pending Project Reviews
        // Removed orderBy for now to debug if it's an index issue causing empty results
        const qProjectReviews = query(
            collection(db, 'projects'),
            where('supervisorId', '==', currentUser.uid),
            where('status', '==', 'Pending')
        );

        const unsubscribeReviews = onSnapshot(qProjectReviews, (snapshot) => {
            const reviews = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Handle timestamp properly, fallback to current date if missing
                    date: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString() : 'Recently',
                    title: data.title || 'Untitled Project',
                    studentName: data.studentName || 'Unknown Student',
                    isProjectReview: true
                };
            });
            setProjectReviews(reviews);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching project reviews:", error);
            setLoading(false);
        });

        // 3. Listen for Active Students (Approved Requests & Verified Projects)
        const qActiveRequests = query(
            collection(db, 'supervision_requests'),
            where('lecturerId', '==', currentUser.uid),
            where('status', '==', 'approved')
        );

        const qActiveProjects = query(
            collection(db, 'projects'),
            where('supervisorId', '==', currentUser.uid),
            where('status', '==', 'verified')
        );

        // We need to merge these two streams, but onSnapshot makes it tricky to merge effectively without complex state management.
        // For simplicity in this context, we'll listen to both and merge in state setter or effect.
        // But separate listeners might overwrite state.
        // Strategy: Use two state variables activeReqs and activeProjs, and merge them in a useEffect.
        
        // Wait, I can just use one listener for Requests, and another for Projects, and merge them?
        // Let's refactor slightly to precise Active Students list.
        // Actually, let's keep it simple. Students from approved requests are definitely active.
        // Students with processed projects might be alumni? "become part of his active students".
        // Let's just create a combined list.
        
        const unsubscribeActiveRequests = onSnapshot(qActiveRequests, (snapshot) => {
             const reqs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                name: doc.data().studentName,
                topic: doc.data().topic,
                progress: doc.data().progress || 0,
                lastMeet: doc.data().lastMeet?.toDate().toLocaleDateString() || 'Not scheduled',
                source: 'request'
            }));
            setActiveRequestsList(reqs);
        });

        const unsubscribeActiveProjects = onSnapshot(qActiveProjects, (snapshot) => {
            const projs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                name: doc.data().studentName,
                topic: doc.data().title,
                progress: 100, // Completed/Verified
                lastMeet: doc.data().updatedAt?.toDate().toLocaleDateString() || 'Completed',
                source: 'project'
            }));
            setActiveProjectsList(projs);
        });

        return () => {
            unsubscribeRequests();
            unsubscribeReviews();
            unsubscribeActiveRequests();
            unsubscribeActiveProjects();
        };
    }, [currentUser]);


    // Merge active lists (Requests + Projects)
    useEffect(() => {
        // Simple deduplication by studentId/name could be added if needed
        // Assuming studentId is available.
        const combined = [...activeRequestsList];
        
        activeProjectsList.forEach(proj => {
            // Check if student already exists from requests
            const exists = combined.find(s => s.studentId === proj.studentId || s.name === proj.name);
            if (!exists) {
                combined.push(proj);
            }
        });
        
        setActiveStudents(combined);
    }, [activeRequestsList, activeProjectsList]);

    // Auto-switch tab if only project reviews exist
    useEffect(() => {
        if (!loading && requests.length === 0 && projectReviews.length > 0 && activeTab === 'requests') {
            setActiveTab('reviews');
        }
    }, [loading, requests.length, projectReviews.length, activeTab]);

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
                role="lecturer"
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Supervision Management</h1>

                    {/* Tabs */}
                    <div className="border-b border-border-light dark:border-border-dark mb-6">
                        <div className="flex space-x-8 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('requests')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            >
                                History
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            >
                                Project Reviews
                                {projectReviews.length > 0 && <span className="ml-2 bg-orange-100 text-orange-800 py-0.5 px-2 rounded-full text-xs">{projectReviews.length}</span>}
                            </button>
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'active' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            >
                                Active Students
                                <span className="ml-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-0.5 px-2 rounded-full text-xs">{activeStudents.length}</span>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {activeTab === 'requests' ? (
                        <div className="space-y-6">
                            {requests.length === 0 ? (
                                <p className="text-gray-500 text-center py-12">No pending supervision requests.</p>
                            ) : (
                                requests.map((req) => (
                                    <div 
                                        key={req.id} 
                                        onClick={() => navigate(`/lecturer/supervision/${req.id}`)}
                                        className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{req.studentName}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                                                        req.degree === 'PhD' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                        req.degree === 'MSc' ? 'bg-green-100 text-green-800 border-green-200' :
                                                        'bg-blue-100 text-blue-800 border-blue-200'
                                                    }`}>
                                                        {req.degree} Student
                                                    </span>
                                                    <span className="text-xs text-gray-500">{req.date}</span>
                                                    <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium border uppercase ${
                                                        (req.status === 'approved' || req.status === 'Approved') ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30' :
                                                        (req.status === 'rejected' || req.status === 'Rejected') ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30' :
                                                        'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30'
                                                    }`}>
                                                        {req.status || 'Pending'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1"><span className="font-semibold">Matric No:</span> {req.matricNo}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3"><span className="font-semibold">Target Topic:</span> {req.topic}</p>
                                                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Abstract Preview</p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 italic line-clamp-2">"{req.abstract}"</p>
                                                </div>
                                            </div>
                                            <div className="flex md:flex-col gap-3 min-w-[120px]">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/lecturer/supervision/${req.id}`);
                                                    }}
                                                    className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors"
                                                >
                                                    Review Proposal
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : activeTab === 'reviews' ? (
                        <div className="space-y-6">
                            {projectReviews.length === 0 ? (
                                <p className="text-gray-500 text-center py-12">No pending project reviews.</p>
                            ) : (
                                projectReviews.map((review) => (
                                    <div 
                                        key={review.id} 
                                        onClick={() => navigate(`/lecturer/review/${review.id}`)}
                                        className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{review.title}</h3>
                                                    <span className="px-2 py-0.5 rounded text-xs font-medium border bg-purple-100 text-purple-800 border-purple-200">
                                                        Project Review
                                                    </span>
                                                    <span className="text-xs text-gray-500">{review.date}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1"><span className="font-semibold">Student:</span> {review.studentName}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3"><span className="font-semibold">Submitted:</span> {review.date}</p>
                                                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Abstract</p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 italic line-clamp-2">"{review.abstract || 'No abstract provided'}"</p>
                                                </div>
                                            </div>
                                            <div className="flex md:flex-col gap-3 min-w-[120px]">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/lecturer/review/${review.id}`);
                                                    }}
                                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors"
                                                >
                                                    Review Project
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activeStudents.map((student) => (
                                <div key={student.id} className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col h-full">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-lg">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{student.name}</h3>
                                            <p className="text-xs text-green-600 dark:text-green-400">Active - On Track</p>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{student.topic}</p>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                                            <div className="bg-primary h-2 rounded-full" style={{ width: `${student.progress}%` }}></div>
                                        </div>
                                        <p className="text-xs text-right text-gray-500 mb-4">{student.progress}% Complete</p>
                                        
                                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                            <p>Last Meeting: {student.lastMeet}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark flex gap-2">
                                        <button 
                                            onClick={() => navigate('/repository')} 
                                            className="flex-1 border border-border-light dark:border-border-dark py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                                        >
                                            View Work
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};
