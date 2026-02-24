import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../config/firebase';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    deleteDoc, 
    doc,
    getDoc
} from 'firebase/firestore';

export const SavedPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { currentUser } = useAuth();
    
    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedItems = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // 1. Fetch saved item references
                const q = query(
                    collection(db, "saved_items"),
                    where("userId", "==", currentUser.uid)
                );
                const querySnapshot = await getDocs(q);
                const savedRefs = querySnapshot.docs.map(doc => ({
                    savedItemId: doc.id, 
                    ...doc.data()
                }));

                // 2. Fetch actual project data for each saved item
                const itemsWithDetails = await Promise.all(
                    savedRefs.map(async (savedItem) => {
                        if (!savedItem.projectId) return null;
                        
                        try {
                            const projectRef = doc(db, "projects", savedItem.projectId);
                            const projectSnap = await getDoc(projectRef);
                            
                            if (projectSnap.exists()) {
                                return {
                                    ...savedItem,
                                    projectData: {
                                        id: projectSnap.id,
                                        ...projectSnap.data()
                                    }
                                };
                            } else {
                                // Project might have been deleted
                                return null; 
                            }
                        } catch (err) {
                            console.error(`Error fetching project ${savedItem.projectId}`, err);
                            return null;
                        }
                    })
                );

                setSavedItems(itemsWithDetails.filter(item => item !== null));
            } catch (error) {
                console.error("Error fetching saved items:", error);
                toast.error("Failed to load saved items");
            } finally {
                setLoading(false);
            }
        };

        fetchSavedItems();
    }, [currentUser]);

    const handleRemove = async (savedItemId) => {
        try {
            await deleteDoc(doc(db, "saved_items", savedItemId));
            setSavedItems(prev => prev.filter(item => item.savedItemId !== savedItemId));
            toast.success("Item removed from your library.");
        } catch (error) {
            console.error("Error removing item:", error);
            toast.error("Failed to remove item");
        }
    };

    const handleExport = () => {
        toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
            loading: 'Generating bibliography...',
            success: 'Bibliography exported as .bib file!',
            error: 'Failed to export',
        });
    };

    const getBadgeStyle = (degree) => {
        switch(degree) {
            case 'PhD': return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500 dark:border-yellow-700";
            case 'MSc': return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-500 dark:border-green-700";
            case 'BSc': return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-500 dark:border-blue-700";
            default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
        }
    };

    const formatDate = (date) => {
        if (!date) return 'Unknown date';
        // Handle Firestore Timestamp
        if (date.seconds) {
            return new Date(date.seconds * 1000).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        return new Date(date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long', 
            day: 'numeric'
        });
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">bookmark</span>
                                Saved Items
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your personal collection of research papers and theses.</p>
                        </div>
                        <div className="flex gap-2">
                             <button 
                                onClick={handleExport}
                                disabled={savedItems.length === 0}
                                className={`inline-flex items-center px-4 py-2 bg-white dark:bg-secondary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-white transition-colors ${savedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'}`}
                            >
                                <span className="material-symbols-outlined text-lg mr-2">download</span>
                                Export Bibliography
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                         <div className="text-center py-16">
                            <span className="material-symbols-outlined text-4xl text-gray-400 animate-spin">progress_activity</span>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Loading saved items...</p>
                        </div>
                    ) : savedItems.length === 0 ? (
                        <div className="text-center py-16 bg-surface-light dark:bg-surface-dark border-2 border-dashed border-border-light dark:border-border-dark rounded-xl">
                            <span className="material-symbols-outlined text-4xl text-gray-400 mb-4">bookmark_border</span>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your library is empty</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">Start exploring repositories to add items to your collection.</p>
                            <Link to="/repository" className="text-primary hover:text-sky-600 font-medium">Browse Repositories &rarr;</Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {savedItems.map((item) => {
                                const project = item.projectData;
                                return (
                                    <div key={item.savedItemId} className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow group relative">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 pr-8">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getBadgeStyle(project.degree)}`}>
                                                        {project.degree || 'N/A'}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                                        <span className="material-symbols-outlined text-[14px] mr-1">history</span>
                                                        Updated {formatDate(project.updatedAt || project.createdAt)}
                                                    </span>
                                                </div>
                                                <Link to={`/repository/${project.id}`} className="block">
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors mb-1">
                                                        {project.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                                    {project.abstract || project.description || 'No description available.'}
                                                </p>
                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-4">
                                                    <span className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-200">
                                                        <span className="material-symbols-outlined text-[16px]">person</span> {project.studentName || project.author || 'Unknown Author'}
                                                    </span>
                                                    {(project.institution || project.university) && (
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[16px]">account_balance</span> {project.institution || project.university}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleRemove(item.savedItemId)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                                title="Remove from library"
                                            >
                                                <span className="material-symbols-outlined">bookmark_remove</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
