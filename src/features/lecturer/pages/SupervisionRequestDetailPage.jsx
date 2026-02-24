import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { toast } from 'sonner';
import { db } from '../../../config/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

export const SupervisionRequestDetailPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { requestId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchRequest = async () => {
            if (!requestId) return;
            try {
                const docRef = doc(db, 'supervision_requests', requestId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setRequest({ id: docSnap.id, ...docSnap.data() });
                } else {
                    toast.error("Request not found");
                }
            } catch (error) {
                console.error("Error fetching request:", error);
                toast.error("Failed to load request");
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [requestId]);

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50 font-sans text-slate-800 overflow-hidden">
                 <Sidebar 
                    role="lecturer" 
                    isCollapsed={isSidebarCollapsed}
                    toggleSidebar={toggleSidebar}
                />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="flex h-screen bg-gray-50 font-sans text-slate-800 overflow-hidden">
                 <Sidebar 
                    role="lecturer" 
                    isCollapsed={isSidebarCollapsed}
                    toggleSidebar={toggleSidebar}
                />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-gray-700">Request Not Found</h2>
                        <Link to="/lecturer/supervision" className="text-primary hover:underline mt-2 inline-block">Back to Supervision</Link>
                    </div>
                </div>
            </div>
        )
    }

    const handleAccept = async () => {
        if (!window.confirm(`Are you sure you want to accept supervision for ${request.studentName}?`)) return;
        
        setIsProcessing(true);
        try {
            await updateDoc(doc(db, 'supervision_requests', requestId), {
                status: 'approved',
                reviewedAt: serverTimestamp(),
                // Initialize progress tracking fields if they don't exist
                progress: 0,
                lastMeet: null
            });
            toast.success(`Supervision request for ${request.studentName} accepted.`);
            navigate('/lecturer/supervision');
        } catch (error) {
            console.error("Error accepting request:", error);
            toast.error("Failed to accept request.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDecline = async () => {
        if (!window.confirm(`Are you sure you want to decline this request?`)) return;

        setIsProcessing(true);
        try {
            await updateDoc(doc(db, 'supervision_requests', requestId), {
                status: 'rejected',
                reviewedAt: serverTimestamp()
            });
            toast.info(`Supervision request for ${request.studentName} declined.`);
            navigate('/lecturer/supervision');
        } catch (error) {
            console.error("Error declining request:", error);
            toast.error("Failed to decline request.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Format date helper
    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown';
        // Handle Firestore Timestamp or Date object or string
        if (timestamp.toDate) return timestamp.toDate().toLocaleDateString();
        return new Date(timestamp).toLocaleDateString();
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-slate-800 overflow-hidden">
            <Sidebar 
                role="lecturer" 
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
            />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header / Breadcrumbs */}
                <header className="w-full h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-30">
                    <div className="flex items-center gap-4">
                        <Link to="/lecturer/supervision" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium">
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Back to Supervision
                        </Link>
                        <div className="h-6 w-px bg-slate-200 mx-2"></div>
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="flex items-center space-x-2">
                                <li>
                                    <Link to="/lecturer/dashboard" className="text-slate-400 hover:text-slate-600 text-sm">Dashboard</Link>
                                </li>
                                <li><span className="text-slate-300">/</span></li>
                                <li>
                                    <Link to="/lecturer/supervision" className="text-slate-400 hover:text-slate-600 text-sm">Supervision</Link>
                                </li>
                                <li><span className="text-slate-300">/</span></li>
                                <li>
                                    <span className="text-primary font-medium text-sm">Request #{requestId.substring(0,6)}...</span>
                                </li>
                            </ol>
                        </nav>
                    </div>
                    
                    {request.status === 'pending' && (
                        <div className="flex items-center gap-3">
                             {/* Action Buttons */}
                            <button 
                                onClick={handleDecline}
                                disabled={isProcessing}
                                className="px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                                Decline
                            </button>
                            <button 
                                onClick={handleAccept}
                                disabled={isProcessing}
                                className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-lg">check</span>
                                Accept Request
                            </button>
                        </div>
                    )}
                </header>

                <main className="flex-grow flex overflow-hidden">
                    {/* Main Content Area (Left) */}
                    <section className="flex-grow bg-slate-50 relative flex flex-col w-2/3 border-r border-slate-200 overflow-y-auto custom-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                        <div className="p-8 max-w-4xl mx-auto w-full">
                             {/* Request Header */}
                             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                request.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                                                'bg-red-100 text-red-800 border-red-200'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    request.status === 'pending' ? 'bg-yellow-500' :
                                                    request.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                                                }`}></span>
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                            <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-2">
                                                {request.topic || "Untitled Topic"}
                                            </h1>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 text-sm text-slate-500 border-t border-slate-100 pt-4 mt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                                                {request.studentName ? request.studentName.charAt(0) : '?'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-700">{request.studentName}</p>
                                                <p className="text-xs">{request.matricNo || "No Matric No"}</p>
                                            </div>
                                        </div>
                                        <div className="h-8 w-px bg-slate-200"></div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400 uppercase tracking-wide">Program</span>
                                            <span className="font-medium text-slate-700">{request.degree || "Unknown Program"}</span>
                                        </div>
                                        <div className="h-8 w-px bg-slate-200"></div>
                                         <div className="flex flex-col">
                                            <span className="text-xs text-slate-400 uppercase tracking-wide">Submitted</span>
                                            <span className="font-medium text-slate-700">{formatDate(request.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Abstract Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
                                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">description</span>
                                    Proposal Abstract
                                </h2>
                                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm">
                                    {request.abstract ? (
                                        request.abstract.split('\n\n').map((paragraph, idx) => (
                                            <p key={idx} className="mb-4 last:mb-0">{paragraph}</p>
                                        ))
                                    ) : (
                                        <p className="italic text-gray-400">No abstract provided.</p>
                                    )}
                                </div>
                            </div>

                            {/* Attachments Section */}
                           {request.fileUrl && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">attachment</span>
                                        Attachments
                                    </h2>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg group hover:border-primary/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                                                <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800 group-hover:text-primary transition-colors">{request.fileName || "Document.pdf"}</p>
                                                <p className="text-xs text-slate-500">{request.fileSize || "Unknown size"}</p>
                                            </div>
                                        </div>
                                        <a href={request.fileUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-primary hover:border-primary/30 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2">
                                            <span className="material-symbols-outlined">download</span>
                                            Download
                                        </a>
                                    </div>
                                </div>
                           )}

                        </div>
                    </section>

                    {/* Right Sidebar (AI Assistant) - w-1/3 */}
                    <aside className="w-1/3 min-w-[350px] bg-white flex flex-col h-full overflow-hidden shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gradient-to-r from-white to-indigo-50/30">
                            <span className="material-symbols-outlined text-teal-600 text-2xl">auto_awesome</span>
                            <h2 className="font-bold text-slate-800">AI Review Assistant</h2>
                        </div>
                        
                        <div className="flex-grow overflow-y-auto custom-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] p-6 space-y-6">
                            {/* Paper Insights */}
                            <div className="bg-white rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
                                <div className="bg-indigo-50/50 px-4 py-3 border-b border-indigo-100 flex justify-between items-center">
                                    <span className="text-sm font-semibold text-primary">Paper Insights</span>
                                    <span className="bg-white text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wide">Analysis Complete</span>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div>
                                        <span className="text-xs text-slate-500 uppercase font-semibold">Novelty Score</span>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-[85%] h-full rounded-full"></div>
                                            </div>
                                            <span className="text-lg font-bold text-indigo-900">85<span className="text-sm text-slate-400 font-normal">/100</span></span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">High novelty in "dynamic thresholding mechanism" application.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Methodology</span>
                                            <span className="text-xs font-medium text-slate-700 block">Structured Pruning, Empirical Analysis</span>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Impact</span>
                                            <span className="text-xs font-medium text-slate-700 block">Energy Efficiency, Edge Computing</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Consistency Check */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                                <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-500 text-lg">warning</span>
                                    <span className="text-sm font-semibold text-slate-800">Consistency Check</span>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></div>
                                        <div>
                                            <p className="text-xs text-slate-700 font-medium">Citation Anomaly Detected</p>
                                            <p className="text-xs text-slate-500 mt-0.5">Reference [12] is from 2018, but a more recent 2022 survey contradicts its primary claim. Consider suggesting an update.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></div>
                                        <div>
                                            <p className="text-xs text-slate-700 font-medium">Data Integrity</p>
                                            <p className="text-xs text-slate-500 mt-0.5">Statistical variance in Table 3 aligns with reported standard deviations.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Department Alignment */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                                <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-teal-600 text-lg">hub</span>
                                    <span className="text-sm font-semibold text-slate-800">Department Alignment</span>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-slate-600">Match with Dept. Trends</span>
                                        <span className="text-xs font-bold text-teal-600">Strong Match</span>
                                    </div>
                                    <div className="flex gap-1 mb-3">
                                        <span className="h-1.5 flex-1 bg-teal-600 rounded-l-full"></span>
                                        <span className="h-1.5 flex-1 bg-teal-600"></span>
                                        <span className="h-1.5 flex-1 bg-teal-600"></span>
                                        <span className="h-1.5 flex-1 bg-teal-600/30 rounded-r-full"></span>
                                    </div>
                                    <p className="text-xs text-slate-500">This paper contributes directly to the "Green AI" strategic pillar initiated last semester.</p>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-semibold text-slate-800">General Feedback</span>
                                    <span className="text-xs text-slate-400">Markdown supported</span>
                                </div>
                                <textarea 
                                    className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-shadow resize-none h-32 bg-slate-50" 
                                    placeholder="Add your summary comments here..."
                                ></textarea>
                                
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm text-teal-600">smart_toy</span>
                                        AI Suggested Feedback
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        <button className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors text-left truncate max-w-full">
                                            "Clarify the pruning threshold selection..."
                                        </button>
                                        <button className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors text-left truncate max-w-full">
                                            "Expand on real-world energy savings..."
                                        </button>
                                        <button className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors">
                                            "Good structure."
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end pt-2">
                                    <button className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
                                        Post Comment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
};
