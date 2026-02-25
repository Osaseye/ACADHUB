import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../config/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
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
import { toast } from 'sonner';

// Register ChartJS components
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

export const LecturerRepositoryDetailPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { currentUser } = useAuth();
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
          try {
            const docRef = doc(db, 'projects', id);
            const docSnap = await getDoc(docRef);
  
            if (docSnap.exists()) {
              const data = docSnap.data();
              // Fetch Author/University Details if missing
              let authorName = data.authorName;
              let university = data.university;

              if ((!authorName || !university) && data.studentId) {
                 const userSnap = await getDoc(doc(db, "users", data.studentId));
                 if (userSnap.exists()) {
                     authorName = authorName || userSnap.data().displayName || userSnap.data().firstName + ' ' + userSnap.data().lastName;
                     university = university || userSnap.data().institution;
                 }
              }

              setProject({ 
                  id: docSnap.id, 
                  ...data,
                  authorName: authorName || 'Unknown Author',
                  university: university || 'Unknown Institution'
              });
            } else {
              console.log('No such document!');
            }
          } catch (error) {
            console.error('Error fetching project:', error);
          } finally {
            setLoading(false);
          }
        };
  
        fetchProject();
        
        // Fetch Notes Realtime
        const notesQ = query(collection(db, `projects/${id}/notes`), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(notesQ, (snapshot) => {
            const fetchedNotes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotes(fetchedNotes);
        });

        return () => unsubscribe();
    }, [id]);

    const handleAddNote = async (e) => {
        e.preventDefault();
        if(!newNote.trim()) return;
        
        try {
            await addDoc(collection(db, `projects/${id}/notes`), {
                content: newNote,
                authorId: currentUser.uid,
                authorName: currentUser.displayName || 'Lecturer',
                createdAt: new Date()
            });
            setNewNote('');
            toast.success("Note added");
        } catch (error) {
            console.error("Error adding note:", error);
            toast.error("Failed to add note");
        }
    };

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                fill: true,
                label: 'Citations',
                data: [1, 3, 5, 8, 12, 16], // Mock data until we have real history collection
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        performant: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
             tooltip: { enabled: false }
        },
        scales: {
             y: { display: false },
             x: { display: false }
        }
    };

    const handleVerify = async () => {
        try {
            const docRef = doc(db, 'projects', id);
            await updateDoc(docRef, {
                status: 'verified',
                verifiedBy: currentUser.uid, 
                verifiedAt: new Date()
            });
        
        // Add note indicating verification
        await addDoc(collection(db, `projects/${id}/notes`), {
            content: `Project Verified by ${currentUser.displayName}`,
            authorId: currentUser.uid,
            authorName: currentUser.displayName || 'Supervisor',
            type: 'system',
            createdAt: new Date()
        });

        // Update local state
        setProject(prev => ({ ...prev, status: 'verified' }));
        toast.success("Project verified successfully!");
    } catch (error) {
        console.error('Error verifying project:', error);
        toast.error("Failed to verify project");
    }
};

const handleReject = async () => {
    if (!window.confirm("Are you sure you want to reject this project? This will change the status back to Draft/Rejected.")) return;
    try {
        const docRef = doc(db, 'projects', id);
        await updateDoc(docRef, {
            status: 'Rejected',
            verifiedBy: currentUser.uid, 
            verifiedAt: new Date()
        });
        
        // Add note indicating rejection
        await addDoc(collection(db, `projects/${id}/notes`), {
            content: `Project Rejected/Returned by ${currentUser.displayName}`,
            authorId: currentUser.uid,
            authorName: currentUser.displayName || 'Supervisor',
            type: 'system',
            createdAt: new Date()
        });

        // Update local state
        setProject(prev => ({ ...prev, status: 'Rejected' }));
        toast.success("Project rejected.");
    } catch (error) {
        console.error('Error rejecting project:', error);
        toast.error("Failed to reject project");
    }
};

if (!project) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark text-text-light dark:text-white">
                 <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Project Not Found</h2>
                    <Link to="/lecturer/repository" className="text-primary hover:underline">Return to Repository</Link>
                 </div>
            </div>
        );
    }
    
    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
                role="lecturer"
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* Breadcrumbs for Lecturer */}
                    <nav className="flex mb-4 text-sm font-medium text-text-muted-light dark:text-text-muted-dark" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link to="/lecturer/dashboard" className="hover:text-primary transition-colors">Home</Link>
                            </li>
                            <li className="flex items-center">
                                <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                                <Link to="/lecturer/repository" className="hover:text-primary transition-colors">Repository</Link>
                            </li>
                            <li className="flex items-center">
                                <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                                <span className="text-text-light dark:text-white truncate max-w-[200px]" aria-current="page">{project.title}</span>
                            </li>
                        </ol>
                    </nav>

                    {/* Header Section */}
                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6 mb-8 shadow-sm">
                        <div className="lg:flex lg:items-start lg:justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                                        {project.projectType || 'Research Paper'}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        {project.createdAt?.seconds ? new Date(project.createdAt.seconds * 1000).getFullYear() : '2024'}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 border border-purple-200 dark:border-purple-800">
                                        <span className="material-symbols-outlined !text-[14px]">psychology</span> {project.department || 'General'}
                                    </span>
                                    <span className="font-mono text-xs text-text-muted-light dark:text-text-muted-dark ml-2">ID: <span className="select-all">{id.substring(0, 8)}...</span></span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold leading-7 text-text-light dark:text-white sm:truncate sm:tracking-tight mb-2">
                                    {project.title}
                                </h1>
                                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                                    <div className="mt-2 flex items-center text-sm text-text-muted-light dark:text-text-muted-dark">
                                        <span className="material-symbols-outlined mr-1.5 text-[18px]">person</span>
                                        <span className="hover:underline text-primary cursor-pointer">{project.authorName || 'Unknown Author'}</span>
                                        {project.supervisorName && (
                                            <>
                                                <span className="mx-1">Checked by</span>
                                                <span className="hover:underline text-primary cursor-pointer">{project.supervisorName}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-text-muted-light dark:text-text-muted-dark">
                                        <span className="material-symbols-outlined mr-1.5 text-[18px]">account_balance</span>
                                        {project.university || 'University Unavailable'}
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-green-600 dark:text-green-400">
                                        <span className="material-symbols-outlined mr-1.5 text-[18px]">check_circle</span>
                                        {project.status === 'verified' ? 'Peer Reviewed' : 'Pending Review'}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Lecturer Specific Actions */}
                            <div className="mt-5 flex lg:mt-0 lg:ml-4 gap-3">
                                {project.status === 'verified' ? (
                                    <button
                                        type="button"
                                        disabled
                                        className="inline-flex items-center px-4 py-2 border border-green-600 text-sm font-medium rounded-md shadow-sm text-green-600 bg-green-50 dark:bg-green-900/20 cursor-default"
                                    >
                                        <span className="material-symbols-outlined mr-2 -ml-1 text-[20px]">verified</span>
                                        Verified
                                    </button>
                                ) : project.status === 'Rejected' ? (
                                    <div className="flex gap-2 items-center">
                                         <span className="inline-flex items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md shadow-sm text-red-600 bg-red-50 dark:bg-red-900/20 cursor-default">
                                            <span className="material-symbols-outlined mr-2 -ml-1 text-[20px]">block</span>
                                            Rejected
                                        </span>
                                        {project.supervisorId === currentUser?.uid && (
                                            <button
                                                type="button"
                                                onClick={handleVerify}
                                                className="text-xs text-blue-600 underline"
                                            >
                                                Re-Approve?
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    project.supervisorId === currentUser?.uid ? (
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={handleReject}
                                                className="inline-flex items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md shadow-sm text-red-600 bg-white dark:bg-surface-dark hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                <span className="material-symbols-outlined mr-2 -ml-1 text-[20px]">block</span>
                                                Reject
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleVerify}
                                                className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md shadow-sm text-blue-600 dark:text-blue-400 bg-white dark:bg-surface-dark hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <span className="material-symbols-outlined mr-2 -ml-1 text-[20px]">fact_check</span>
                                                Verify Project (Supervisor Action)
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800 cursor-default">
                                            <span className="material-symbols-outlined mr-2 -ml-1 text-[20px]">hourglass_empty</span>
                                            Pending Review
                                        </span>
                                    )
                                )}
                                {project.fileUrl && (
                                    <a
                                        href={project.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    >
                                        <span className="material-symbols-outlined mr-2 -ml-1 text-[20px]">download</span>
                                        Download Full Text
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                             {/* Abstract */}
                             <section className="bg-surface-light dark:bg-surface-dark rounded-lg p-6 border border-border-light dark:border-border-dark shadow-sm">
                                <h2 className="text-lg font-bold text-text-light dark:text-white mb-4">Abstract</h2>
                                <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed whitespace-pre-wrap">
                                    {project.abstract || 'No abstract available.'}
                                </p>
                            </section>

                            {/* Analytics (Citations) */}
                            <section className="bg-surface-light dark:bg-surface-dark rounded-lg p-6 border border-border-light dark:border-border-dark shadow-sm">
                                <h2 className="text-lg font-bold text-text-light dark:text-white mb-4">Citation Growth</h2>
                                <div className="h-64">
                                     <Line data={chartData} options={chartOptions} />
                                </div>
                            </section>

                            {/* Lecturer Only: Grading / Internal Notes */}
                             <section className="bg-yellow-50 dark:bg-yellow-900/10 rounded-lg p-6 border border-yellow-200 dark:border-yellow-900 shadow-sm">
                                <h2 className="text-lg font-bold text-yellow-800 dark:text-yellow-500 mb-4 flex items-center">
                                    <span className="material-symbols-outlined mr-2">lock</span> 
                                    Internal Lecturer Notes
                                </h2>
                                
                                {/* Existing Feedback from Project Doc */}
                                {project.lecturerFeedback && (
                                    <div className="mb-4 p-4 bg-white dark:bg-black/20 rounded border-l-4 border-yellow-400 dark:border-yellow-600 shadow-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-yellow-700 dark:text-yellow-600">Supervisor Feedback</span>
                                        </div>
                                        <p className="text-sm text-gray-800 dark:text-gray-200">{project.lecturerFeedback}</p>
                                    </div>
                                )}

                                {/* Notes List */}
                                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                                    {notes.length === 0 && !project.lecturerFeedback ? (
                                        <div className="p-3 bg-white dark:bg-black/20 rounded border border-yellow-100 dark:border-yellow-900/30">
                                            <p className="text-sm text-text-muted-light dark:text-text-muted-dark italic">
                                                No notes available yet.
                                            </p>
                                        </div>
                                    ) : (
                                        notes.map(note => (
                                            <div key={note.id} className={`p-3 rounded border text-sm ${note.type === 'system' ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'bg-white dark:bg-black/20 border-yellow-100 dark:border-yellow-900/30'}`}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-xs">{note.authorName}</span>
                                                    <span className="text-[10px] text-gray-500">
                                                        {note.createdAt?.seconds ? new Date(note.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{note.content}</p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <form onSubmit={handleAddNote} className="space-y-2">
                                    <textarea 
                                        className="w-full p-2 text-sm border border-border-light dark:border-border-dark rounded-md bg-white dark:bg-black/30 text-text-light dark:text-text-dark focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                                        placeholder="Add a note visible to other lecturers..."
                                        rows="2"
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                    ></textarea>
                                    <div className="flex justify-end">
                                        <button 
                                            type="submit"
                                            disabled={!newNote.trim()}
                                            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded shadow-sm transition-colors"
                                        >
                                            Add Note
                                        </button>
                                    </div>
                                </form>
                            </section>
                        </div>
                        
                        {/* Sidebar Info */}
                         <div className="space-y-6">
                            {/* Paper Stats */}
                            <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-6 border border-border-light dark:border-border-dark shadow-sm">
                                <h3 className="text-sm font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mb-4">Paper Statistics</h3>
                                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="px-4 py-3 bg-background-light dark:bg-background-dark rounded-lg">
                                        <dt className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark truncate">Views</dt>
                                        <dd className="mt-1 text-xl font-semibold text-text-light dark:text-white">{project.views || 0}</dd>
                                    </div>
                                    <div className="px-4 py-3 bg-background-light dark:bg-background-dark rounded-lg">
                                        <dt className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark truncate">Downloads</dt>
                                        <dd className="mt-1 text-xl font-semibold text-text-light dark:text-white">{project.downloads || 0}</dd>
                                    </div>
                                    <div className="px-4 py-3 bg-background-light dark:bg-background-dark rounded-lg">
                                        <dt className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark truncate">Citations</dt>
                                        <dd className="mt-1 text-xl font-semibold text-text-light dark:text-white">{project.citations || 0}</dd>
                                    </div>
                                     <div className="px-4 py-3 bg-background-light dark:bg-background-dark rounded-lg">
                                        <dt className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark truncate">Plagiarism Score</dt>
                                        <dd className="mt-1 text-xl font-semibold text-green-600 dark:text-green-500">{project.plagiarismScore ? project.plagiarismScore + '%' : 'N/A'}</dd>
                                    </div>
                                </dl>
                            </div>
                         </div>
                    </div>

                </div>
            </main>
        </div>
    );
};
