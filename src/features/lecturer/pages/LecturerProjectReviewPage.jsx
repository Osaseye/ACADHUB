import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../config/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';
import { toast } from 'sonner';

export const LecturerProjectReviewPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { currentUser } = useAuth();
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [studentOtherDocs, setStudentOtherDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewNote, setReviewNote] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchProjectData = async () => {
            if (!currentUser) return;

            try {
                // 1. Fetch Project Details
                const docRef = doc(db, 'projects', projectId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const projectData = { id: docSnap.id, ...docSnap.data() };
                    setProject(projectData);

                    // 2. Fetch Other Documents by this Student
                    if (projectData.studentId) {
                        const q = query(
                            collection(db, 'projects'), 
                            where('studentId', '==', projectData.studentId),
                            where('id', '!=', projectId), // Exclude current one if possible, but 'id' field might not be in doc data unless set.
                            orderBy('createdAt', 'desc')
                        );
                        // Note: Inequality filter on 'id' might require index or be tricky if 'id' isn't a field. 
                        // Simpler: Just fetch all by student and filter in JS.
                        const qSimple = query(
                            collection(db, 'projects'), 
                            where('studentId', '==', projectData.studentId),
                            orderBy('createdAt', 'desc')
                        );
                        
                        const docsSnap = await getDocs(qSimple);
                        const docs = docsSnap.docs
                            .map(d => ({ id: d.id, ...d.data() }))
                            .filter(d => d.id !== projectId);
                        
                        setStudentOtherDocs(docs);
                    }
                } else {
                    toast.error("Project not found");
                    navigate('/lecturer/supervision');
                }
            } catch (error) {
                console.error("Error fetching project details:", error);
                toast.error("Failed to load project details");
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [projectId, currentUser, navigate]);

    const handleUpdateStatus = (newStatus) => {
        toast(`Are you sure you want to ${newStatus === 'verified' ? 'approve' : 'return'} this project?`, {
            action: {
                label: 'Confirm',
                onClick: () => processStatusUpdate(newStatus),
            },
            cancel: {
                label: 'Cancel',
            },
            duration: 5000,
        });
    };

    const processStatusUpdate = async (newStatus) => {
        setProcessing(true);
        try {
            const docRef = doc(db, 'projects', projectId);
            await updateDoc(docRef, {
                status: newStatus,
                verifiedBy: currentUser.uid,
                verifiedAt: new Date(),
                lecturerFeedback: reviewNote
            });

            // Notify Student
            if (project.studentId) {
                await addDoc(collection(db, "notifications"), {
                    recipientId: project.studentId,
                    type: "project_status_update",
                    title: `Project ${newStatus === 'verified' ? 'Approved' : 'Returned'}`,
                    message: `Your project "${project.title}" has been ${newStatus === 'verified' ? 'approved' : 'returned'} by your supervisor.${reviewNote ? ' Feedback: ' + reviewNote : ''}`,
                    read: false,
                    createdAt: serverTimestamp(),
                    link: `/repository/${projectId}`
                });
            }

            toast.success(`Project ${newStatus === 'verified' ? 'approved' : 'rejected'} successfully`);
            navigate('/lecturer/supervision');
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
                role="lecturer"
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* Header / Breadcrumb */}
                    <nav className="flex mb-6 text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                        <Link to="/lecturer/dashboard" className="hover:text-primary">Home</Link>
                        <span className="mx-2">/</span>
                        <Link to="/lecturer/supervision" className="hover:text-primary">Supervision</Link>
                        <span className="mx-2">/</span>
                        <span className="text-text-light dark:text-white">Review: {project.title}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Review Area */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Project Header Card */}
                            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                                <div className="flex gap-4">
                                    <div className="h-16 w-16 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <span className="material-symbols-outlined text-3xl">menu_book</span>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                                {project.type || 'Research Project'}
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                                                {project.department || 'Department'}
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
                                                Status: {project.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-border-light dark:border-border-dark">
                                    <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Abstract</h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {project.abstract || "No abstract provided."}
                                    </p>
                                </div>
                            </div>

                            {/* AI Insights (Mocked for Demo) */}
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">auto_awesome</span>
                                    <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">AI Analysis & Insights</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white/60 dark:bg-black/20 p-4 rounded-lg">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Originality Score</h4>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-bold text-green-600">92%</span>
                                            <span className="text-xs text-green-700 mb-1">Unique Content</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2">
                                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>
                                    <div className="bg-white/60 dark:bg-black/20 p-4 rounded-lg">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Keywords Detected</h4>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {(project.keywords ? project.keywords.split(',') : ['Analysis', 'Research', 'Study']).map((k, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded border border-indigo-200">
                                                    {k.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-white/60 dark:bg-black/20 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                                    <strong>Trend Analysis:</strong> This topic aligns with top 4 trending research areas in {project.department || 'the field'} this year. Similar projects have high citation potential.
                                </div>
                            </div>

                            {/* Document Preview / Download */}
                            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Submitted Document</h3>
                                {project.fileUrl ? (
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-red-500 text-3xl">picture_as_pdf</span>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">{project.fileName || 'Project_Document.pdf'}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    {project.fileSize ? (project.fileSize / 1024 / 1024).toFixed(2) + ' MB' : 'PDF Document'}
                                                    <span>•</span>
                                                    Uploaded {new Date(project.createdAt?.seconds * 1000).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <a 
                                            href={project.fileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            View / Download
                                        </a>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No document file attached.</p>
                                )}
                            </div>

                        </div>

                        {/* Sidebar: Actions & Student History */}
                        <div className="space-y-6">
                            
                            {/* Review Actions */}
                            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm sticky top-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Review Decision</h3>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Supervisor Feedack / Comments
                                    </label>
                                    <textarea
                                        rows="4"
                                        className="w-full p-3 bg-white dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                                        placeholder="Enter your feedback for the student here..."
                                        value={reviewNote}
                                        onChange={(e) => setReviewNote(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleUpdateStatus('Rejected')}
                                        disabled={processing}
                                        className="px-4 py-2 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                    >
                                        Return for Edits
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus('verified')}
                                        disabled={processing}
                                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
                                    >
                                        Approve Project
                                    </button>
                                </div>
                            </div>

                            {/* Student Profile / History */}
                            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border-light dark:border-border-dark">
                                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                                        {project.studentName?.charAt(0) || 'S'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{project.studentName || 'Student Name'}</p>
                                        <p className="text-xs text-gray-500">Submitted {studentOtherDocs.length + 1} items</p>
                                    </div>
                                </div>

                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Previous Submissions</h4>
                                <div className="space-y-3">
                                    {studentOtherDocs.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic">No other submissions found.</p>
                                    ) : (
                                        studentOtherDocs.map((doc) => (
                                            <Link 
                                                key={doc.id} 
                                                to={`/lecturer/repository/${doc.id}`}
                                                className="block p-3 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark hover:border-primary/50 transition-colors"
                                            >
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{doc.title}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                                        doc.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {doc.status || 'Pending'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">
                                                        {doc.createdAt?.toDate ? doc.createdAt.toDate().toLocaleDateString() : ''}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
