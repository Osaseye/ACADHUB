import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    doc, 
    getDoc, 
    updateDoc, 
    increment, 
    addDoc, 
    collection, 
    query, 
    where, 
    deleteDoc,
    getDocs
} from 'firebase/firestore';
import { db, app } from '../../../config/firebase';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
// Attempting to use the preview path if the main one is missing in the installed version
import { getAI, getGenerativeModel, VertexAIBackend } from "firebase/ai";
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { PageLoader } from '../../../components/common/PageLoader';
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

export const RepositoryDetailPage = () => {
    const { id } = useParams();
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiInsight, setAiInsight] = useState('');
    const [generatingInsight, setGeneratingInsight] = useState(false);
    const [insightError, setInsightError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const checkSavedStatus = async () => {
            if (currentUser && project) {
                try {
                    const q = query(
                        collection(db, 'saved_items'),
                        where('userId', '==', currentUser.uid),
                        where('projectId', '==', project.id)
                    );
                    const querySnapshot = await getDocs(q);
                    setIsSaved(!querySnapshot.empty);
                } catch (error) {
                    console.error("Error checking saved status:", error);
                }
            }
        };

        checkSavedStatus();
    }, [currentUser, project]);

    const handleSaveProject = async () => {
        if (!currentUser) {
            toast.error("Please login to save projects.");
            return;
        }

        try {
            if (isSaved) {
                // Remove from saved
                const q = query(
                    collection(db, 'saved_items'),
                    where('userId', '==', currentUser.uid),
                    where('projectId', '==', project.id)
                );
                const querySnapshot = await getDocs(q);
                
                const deletePromises = querySnapshot.docs.map(docSnap => 
                    deleteDoc(doc(db, 'saved_items', docSnap.id))
                );
                await Promise.all(deletePromises);
                
                setIsSaved(false);
                toast.success("Project removed from saved items.");
            } else {
                // Add to saved
                await addDoc(collection(db, 'saved_items'), {
                    userId: currentUser.uid,
                    projectId: project.id,
                    projectTitle: project.title,
                    savedAt: new Date()
                });
                setIsSaved(true);
                toast.success("Project saved successfully!");
            }
        } catch (error) {
            console.error("Error toggling save:", error);
            toast.error("Failed to update saved status.");
        }
    };

    const handleCite = () => {
        if (!project) return;
        const year = project.year || new Date().getFullYear();
        const author = project.studentName || "Author";
        const title = project.title || "Untitled Project";
        const citation = `${author}. (${year}). ${title}. AcadHub.`;
        
        navigator.clipboard.writeText(citation).then(() => {
            toast.success("Citation copied to clipboard!");
        }).catch(err => {
            console.error('Failed to copy: ', err);
            toast.error("Failed to copy citation.");
        });
    };

    const handleDownload = async () => {
        if (!project) return;
        
        try {
            const projectRef = doc(db, 'projects', project.id);
            await updateDoc(projectRef, {
                downloads: increment(1)
            });
            // Update local state to reflect new download count immediately
            setProject(prev => ({
                ...prev,
                downloads: (prev.downloads || 0) + 1
            }));
            
            // The actual download happens via the link's href, so we don't need to trigger it here.
            // But we can show a toast.
            toast.success("Download started.");
        } catch (error) {
            console.error("Error updating download count:", error);
        }
    };

    const generateInsight = async () => {
        if (!project || !project.abstract || aiInsight || generatingInsight) return;

        setGeneratingInsight(true);
        setInsightError(null);
        try {
            const ai = getAI(app, { backend: new VertexAIBackend() });
            const model = getGenerativeModel(ai, { model: "gemini-2.0-flash-lite-001" });
            const prompt = `Analyze the following academic project abstract and provide 3 key insights or potential impact areas:\n\nTitle: ${project.title}\nAbstract: ${project.abstract}`;
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            setAiInsight(text);
        } catch (error) {
            console.error("Error generating insight:", error);
            setInsightError("Failed to generate insights. Please try again later. Ensure Firebase Vertex AI is enabled.");
        } finally {
            setGeneratingInsight(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'ai-insights' && project && !aiInsight) {
            generateInsight();
        }
    }, [activeTab, project]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const docRef = doc(db, 'projects', id);
                const docSnap = getDoc(docRef);
                const docData = await docSnap;

                if (docData.exists()) {
                    setProject({ id: docData.id, ...docData.data() });
                } else {
                    console.log("No such document!");
                    setProject(null);
                }
            } catch (error) {
                console.error("Error fetching project:", error);
                setProject(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    // Chart Data (Static for now as requested)
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Monthly Views',
                data: [65, 59, 80, 81, 56, 55],
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.4
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
        },
        scales: {
            y: { display: false },
            x: { display: false }
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
                <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
                <main className="flex-1 flex items-center justify-center">
                    <PageLoader />
                </main>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
                <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8">
                    <div className="max-w-7xl mx-auto text-center">
                         <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">Project not found</h1>
                         <Link to="/repository" className="text-primary hover:underline mt-4 inline-block">Back to Repository</Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* Breadcrumbs */}
                    <nav className="flex mb-4 text-sm font-medium text-text-muted-light dark:text-text-muted-dark" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link to="/dashboard" className="hover:text-primary transition-colors">Home</Link>
                            </li>
                            <li className="flex items-center">
                                <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                                <Link to="/repository" className="hover:text-primary transition-colors">Repository</Link>
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
                                    {project.type && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                                            {project.type}
                                        </span>
                                    )}
                                    {project.year && (  
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                            {project.year}
                                        </span>
                                    )}
                                    {project.department && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 border border-purple-200 dark:border-purple-800">
                                            <span className="material-symbols-outlined !text-[14px]">school</span> {project.department}
                                        </span>
                                    )}
                                    <span className="font-mono text-xs text-text-muted-light dark:text-text-muted-dark ml-2">ID: <span className="select-all">{project.id?.substring(0, 8)}...</span></span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold leading-7 text-text-light dark:text-white sm:truncate sm:tracking-tight mb-2">
                                    {project.title}
                                </h1>
                                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                                    <div className="mt-2 flex items-center text-sm text-text-muted-light dark:text-text-muted-dark">
                                        <span className="material-symbols-outlined mr-1.5 text-[18px]">person</span>
                                        <span className="text-text-light dark:text-white font-medium">{project.studentName || 'Unknown Author'}</span>
                                    </div>
                                    {project.supervisorName && (
                                        <div className="mt-2 flex items-center text-sm text-text-muted-light dark:text-text-muted-dark">
                                            <span className="material-symbols-outlined mr-1.5 text-[18px]">supervisor_account</span>
                                            Sup: {project.supervisorName}
                                        </div>
                                    )}
                                    <div className="mt-2 flex items-center text-sm text-green-600 dark:text-green-400">
                                        <span className="material-symbols-outlined mr-1.5 text-[18px]">check_circle</span>
                                        {project.status || 'Active'}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 flex lg:mt-0 lg:ml-4 gap-3">
                                {/* Action buttons */}
                                <span className="hidden sm:block">
                                    <button 
                                        onClick={handleSaveProject}
                                        className={`inline-flex items-center px-4 py-2 border border-border-light dark:border-border-dark rounded-md shadow-sm text-sm font-medium ${isSaved ? 'text-primary bg-primary/10 border-primary' : 'text-text-light dark:text-text-dark bg-white dark:bg-[#21262d] hover:bg-slate-50 dark:hover:bg-[#30363d]'} focus:outline-none transition-colors`}
                                        type="button"
                                    >
                                        <span className={`material-symbols-outlined mr-2 !text-lg ${isSaved ? 'fill-current' : ''}`}>bookmark</span>
                                        {isSaved ? 'Saved' : 'Save'}
                                    </button>
                                </span>
                                <span className="hidden sm:block">
                                    <button 
                                        onClick={handleCite}
                                        className="inline-flex items-center px-4 py-2 border border-border-light dark:border-border-dark rounded-md shadow-sm text-sm font-medium text-text-light dark:text-text-dark bg-white dark:bg-[#21262d] hover:bg-slate-50 dark:hover:bg-[#30363d] focus:outline-none transition-colors" type="button">
                                        <span className="material-symbols-outlined mr-2 !text-lg">format_quote</span>
                                        Cite
                                    </button>
                                </span>
                                {project.fileUrl && (
                                    <span className="sm:ml-3">
                                        <a 
                                            href={project.fileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            onClick={handleDownload}
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none transition-colors"
                                        >
                                            <span className="material-symbols-outlined mr-2 !text-lg">download</span>
                                            Download PDF
                                        </a>
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {/* Tabs */}
                        <div className="mt-8 border-b border-border-light dark:border-border-dark">
                            <nav className="-mb-px flex space-x-8 overflow-x-auto">
                                {[
                                    { id: 'overview', label: 'Overview', icon: 'article' },
                                    { id: 'full-doc', label: 'Full Document', icon: 'picture_as_pdf' },
                                    { id: 'ai-insights', label: 'AI Insights', icon: 'auto_awesome', beta: true },
                                    { id: 'trends', label: 'Trends & Impact', icon: 'show_chart' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`${
                                            activeTab === tab.id
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:border-gray-300 dark:hover:border-gray-600'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
                                    >
                                        <span className={`material-symbols-outlined mr-2 !text-lg ${tab.id === 'ai-insights' ? 'text-purple-500' : ''}`}>{tab.icon}</span>
                                        {tab.label}
                                        {tab.beta && (
                                            <span className="ml-2 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 py-0.5 px-2 rounded-full text-xs">Beta</span>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content Area */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Abstract Section */}
                            <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <span className="material-symbols-outlined text-8xl">description</span>
                                </div>
                                <h2 className="text-lg font-semibold text-text-light dark:text-white mb-4 flex items-center">Abstract</h2>
                                <div className="prose dark:prose-invert max-w-none text-text-muted-light dark:text-text-muted-dark text-sm leading-relaxed text-justify">
                                    <p>
                                        {project.abstract || 'No abstract available.'}
                                    </p>
                                </div>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {project.keywords ? (
                                        project.keywords.split(',').map((keyword, index) => (
                                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                                                {keyword.trim()}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-text-muted-light dark:text-text-muted-dark italic">No keywords</span>
                                    )}
                                </div>
                            </section>

                            {/* Full Document Tab */}
                            {activeTab === 'full-doc' && (
                                <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 text-center min-h-[500px]">
                                    {project.fileUrl ? (
                                        <div className="w-full h-full flex flex-col">
                                             <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-xl font-semibold text-text-light dark:text-white">
                                                    Full Document Preview
                                                </h3>
                                                <a 
                                                    href={project.fileUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none transition-colors"
                                                >
                                                    <span className="material-symbols-outlined mr-2 !text-lg">download</span>
                                                    Download
                                                </a>
                                             </div>
                                            <div className="flex-1 w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-border-light dark:border-border-dark">
                                                {project.fileName?.toLowerCase().endsWith('.pdf') ? (
                                                    <iframe 
                                                        src={project.fileUrl} 
                                                        className="w-full h-[800px]" 
                                                        title="Project Document"
                                                    >
                                                        <p>Your browser does not support PDFs. <a href={project.fileUrl}>Download the PDF</a>.</p>
                                                    </iframe>
                                                ) : (
                                                    <iframe 
                                                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(project.fileUrl)}&embedded=true`}
                                                        className="w-full h-[800px]" 
                                                        title="Project Document Viewer"
                                                    >
                                                        <p>Your browser cannot display this file. <a href={project.fileUrl}>Download the file</a>.</p>
                                                    </iframe>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full py-12">
                                            <div className="mx-auto w-24 h-24 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
                                                <span className="material-symbols-outlined text-5xl">picture_as_pdf</span>
                                            </div>
                                            <h3 className="text-xl font-semibold text-text-light dark:text-white mb-2">Document Unavailable</h3>
                                            <p className="text-text-muted-light dark:text-text-muted-dark mb-6">File details pending or not uploaded.</p>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* Trends Tab (Keeping simplified view) */}
                            {activeTab === 'trends' && (
                                <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-text-light dark:text-white mb-6">Engagement Analytics</h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="material-symbols-outlined text-blue-500">visibility</span>
                                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Views</p>
                                            </div>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{project.views || 0}</p>
                                        </div>
                                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="material-symbols-outlined text-green-500">download</span>
                                                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Downloads</p>
                                            </div>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{project.downloads || 0}</p>
                                        </div>
                                        {project.citations !== undefined && (
                                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                                                <div className="flex items-center gap-2 mb-1">
                                                     <span className="material-symbols-outlined text-purple-500">format_quote</span>
                                                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Citations</p>
                                                </div>
                                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{project.citations}</p>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-text-muted-light dark:text-text-muted-dark mb-4">View how this project is performing over time.</p>
                                    <div className="h-64 w-full">
                                        <Line data={chartData} options={chartOptions} />
                                    </div>
                                </section>
                            )}
                            
                             {/* AI Insights Tab */}
                             {activeTab === 'ai-insights' && (
                                <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm p-6 space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">auto_awesome</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-text-light dark:text-white">AI-Generated Insights</h3>
                                    </div>
                                    
                                    {generatingInsight ? (
                                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                            <p className="text-sm text-text-muted-light dark:text-text-muted-dark animate-pulse">Analyzing with Gemini AI...</p>
                                        </div>
                                    ) : insightError ? (
                                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm border border-red-200 dark:border-red-800">
                                            <div className="flex items-center gap-2 font-medium mb-1">
                                                <span className="material-symbols-outlined text-base">error</span>
                                                Error
                                            </div>
                                            {insightError}
                                             <button 
                                                onClick={() => generateInsight()} 
                                                className="mt-3 block px-3 py-1.5 bg-white dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-red-900/50 transition-colors"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    ) : aiInsight ? (
                                        <div className="prose dark:prose-invert max-w-none text-text-muted-light dark:text-text-muted-dark text-sm leading-relaxed whitespace-pre-wrap">
                                            <ReactMarkdown>
                                                {aiInsight}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-text-muted-light dark:text-text-muted-dark">
                                            <p>No insights generated yet.</p>
                                            <button 
                                                onClick={generateInsight}
                                                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                                            >
                                                Generate Analysis
                                            </button>
                                        </div>
                                    )}
                                    <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark flex justify-between items-center text-xs text-text-muted-light dark:text-text-muted-dark">
                                        <span>Powered by Google Gemini</span>
                                        <span>Analysis based on project abstract</span>
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Sidebar Information */}
                        <div className="space-y-8">
                            {/* Authors Card */}
                            <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm p-6">
                                <h3 className="text-sm font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mb-4">Contributors</h3>
                                <div className="space-y-4">
                                    <Link to={`/profile/${project.studentId}`} className="flex items-center group cursor-pointer">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-3">
                                            {project.studentName?.charAt(0) || 'A'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-light dark:text-white group-hover:text-primary transition-colors">{project.studentName}</p>
                                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Author</p>
                                        </div>
                                    </Link>
                                    {project.supervisorName && (
                                        project.supervisorId ? (
                                            <Link to={`/profile/${project.supervisorId}`} className="flex items-center group cursor-pointer">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold mr-3">
                                                    {project.supervisorName?.charAt(0) || 'S'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-text-light dark:text-white group-hover:text-primary transition-colors">{project.supervisorName}</p>
                                                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Supervisor</p>
                                                </div>
                                            </Link>
                                        ) : (
                                            <div className="flex items-center group cursor-pointer">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold mr-3">
                                                    {project.supervisorName?.charAt(0) || 'S'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-text-light dark:text-white group-hover:text-primary transition-colors">{project.supervisorName}</p>
                                                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Supervisor</p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                    {project.coAuthors && Array.isArray(project.coAuthors) && project.coAuthors.map((coAuthor, idx) => (
                                         <div key={idx} className="flex items-center group cursor-pointer">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold mr-3">
                                                {coAuthor.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-text-light dark:text-white group-hover:text-primary transition-colors">{coAuthor}</p>
                                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Co-Author</p>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Fallback for coAuthors as string or comma separated if that's how it's stored */}
                                     {project.coAuthors && typeof project.coAuthors === 'string' && project.coAuthors.split(',').map((coAuthor, idx) => (
                                         <div key={idx} className="flex items-center group cursor-pointer">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold mr-3">
                                                {coAuthor.trim().charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-text-light dark:text-white group-hover:text-primary transition-colors">{coAuthor.trim()}</p>
                                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Co-Author</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Info Card */}
                            <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm p-6">
                                <h3 className="text-sm font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mb-4">Project Details</h3>
                                <dl className="space-y-3">
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-text-muted-light dark:text-text-muted-dark">Published</dt>
                                        <dd className="text-sm font-medium text-text-light dark:text-white">{project.createdAt ? new Date(project.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-text-muted-light dark:text-text-muted-dark">Language</dt>
                                        <dd className="text-sm font-medium text-text-light dark:text-white">English</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-text-muted-light dark:text-text-muted-dark">License</dt>
                                        <dd className="text-sm font-medium text-text-light dark:text-white">Academic Use</dd>
                                    </div>
                                </dl>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};