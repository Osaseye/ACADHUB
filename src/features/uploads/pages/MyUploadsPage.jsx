import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../context/AuthContext';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';

export const MyUploadsPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { currentUser } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!currentUser) return;

            try {
                const projectsRef = collection(db, 'projects');
                // Removed orderBy('createdAt', 'desc') to avoid composite index requirement
                const q = query(
                    projectsRef, 
                    where('studentId', '==', currentUser.uid)
                );
                
                const querySnapshot = await getDocs(q);
                const projectsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                // Sort client-side
                projectsData.sort((a, b) => {
                    const dateA = a.createdAt?.seconds || 0;
                    const dateB = b.createdAt?.seconds || 0;
                    return dateB - dateA;
                });
                
                setProjects(projectsData);
            } catch (error) {
                console.error("Error fetching projects:", error);
                if (error.code === 'failed-precondition') {
                    console.error("Missing index. Please create the index in Firebase console.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [currentUser]);

    const getStatusStyle = (status) => {
        switch(status?.toLowerCase()) {
            case 'verified': 
            case 'published':
                return "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800";
            case 'pending': 
                return "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800";
            case 'rejected':
            case 'returned':
                return "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800";
            default: 
                return "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700";
        }
    };

    const handleViewFeedback = (project) => {
        if (project.lecturerFeedback) {
            // Simple alert for now, could be a modal
            alert(`Supervisor Feedback:\n\n${project.lecturerFeedback}`);
        }
    };

    const totalUploads = projects.length;
    const totalViews = projects.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const pendingReviews = projects.filter(p => (p.status || 'Pending').toLowerCase() === 'pending').length;

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-4 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-text-light dark:text-white">My Uploads</h1>
                            <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Manage your research submissions and track their performance.</p>
                        </div>
                        <Link to="/uploads/new" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                            <span className="material-symbols-outlined mr-2">add</span>
                            New Project
                        </Link>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                            <div className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium mb-1">Total Uploads</div>
                            <div className="text-3xl font-bold text-text-light dark:text-white">{totalUploads}</div>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                            <div className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium mb-1">Total Views</div>
                            <div className="text-3xl font-bold text-text-light dark:text-white">
                                {totalViews}
                            </div>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                            <div className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium mb-1">Pending Reviews</div>
                            <div className="text-3xl font-bold text-text-light dark:text-white">
                                {pendingReviews}
                            </div>
                        </div>
                    </div>

                    {/* Uploads List */}
                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                            <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                                <thead className="bg-slate-50 dark:bg-[#161b22]">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Project Title</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Type</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Department</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Performance</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-surface-light dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-text-muted-light dark:text-text-muted-dark">
                                                Loading projects...
                                            </td>
                                        </tr>
                                    ) : projects.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center">
                                                <span className="material-symbols-outlined text-4xl text-text-muted-light dark:text-text-muted-dark mb-3">folder_open</span>
                                                <p className="text-text-muted-light dark:text-text-muted-dark">No uploads found. Start by creating a new project.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        projects.map((project) => (
                                        <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-[#1f242c] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-text-light dark:text-white max-w-sm truncate" title={project.title}>
                                                    {project.title}
                                                </div>
                                                <div className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                                                    Uploaded {project.createdAt?.toDate().toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted-light dark:text-text-muted-dark">
                                                {project.type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted-light dark:text-text-muted-dark">
                                                {project.department}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(project.status || 'Pending')}`}>
                                                    {project.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted-light dark:text-text-muted-dark">
                                                <div className="flex space-x-4">
                                                    <div className="flex items-center gap-1 text-gray-500 text-xs text-opacity-80">
                                                        <span className="material-symbols-outlined text-[16px]">visibility</span> 
                                                        <span>{project.views || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-gray-500 text-xs text-opacity-80">
                                                        <span className="material-symbols-outlined text-[16px]">download</span> 
                                                        <span>{project.downloads || 0}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end items-center gap-3">
                                                    {project.lecturerFeedback && (
                                                        <button 
                                                            onClick={() => handleViewFeedback(project)}
                                                            className="text-yellow-600 hover:text-yellow-700 bg-yellow-50 dark:bg-yellow-900/10 px-2 py-1 rounded text-xs border border-yellow-200 dark:border-yellow-800"
                                                            title="View Feedback"
                                                        >
                                                            Feedback
                                                        </button>
                                                    )}
                                                    {(project.status === 'rejected' || project.status === 'returned' || project.status === 'draft') ? (
                                                        <Link 
                                                            to={`/uploads/edit/${project.id}`} 
                                                            className="text-primary hover:text-sky-700 dark:hover:text-sky-400 font-medium"
                                                        >
                                                            Edit
                                                        </Link>
                                                    ) : (
                                                        <Link 
                                                            to={`/repository/${project.id}`} 
                                                            className="text-green-600 hover:text-green-700 font-medium"
                                                        >
                                                            View
                                                        </Link>
                                                    )}
                                                    
                                                    {project.status === 'verified' && (
                                                        <span className="text-gray-300 pointer-events-none select-none material-symbols-outlined text-[20px]">
                                                            lock
                                                        </span>
                                                    )}
                                                    
                                                    {project.status !== 'verified' && (
                                                        <button className="text-text-muted-light dark:text-text-muted-dark hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};