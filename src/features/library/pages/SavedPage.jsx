import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Sidebar } from '../../../components/layout/Sidebar';

export const SavedPage = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    
    // Mock saved items (Nigerian Context)
    const [savedItems, setSavedItems] = useState([
        {
            id: 2,
            title: "AI-driven-traffic-control-lagos",
            description: "A proposal for an automated traffic light control system using computer vision to mitigate gridlock in Lagos metropolis.",
            degree: "BSc",
            type: "Public",
            stars: "89",
            updated: "1 week ago",
            author: "Chinedu Okeke",
            institution: "UNILAG"
        },
        {
            id: 8,
            title: "history-pre-colonial-trade-routes",
            description: "Re-mapping the trans-Saharan trade routes of the 14th century emphasizing the role of the Kanem-Bornu Empire.",
            degree: "PhD",
            type: "Public",
            stars: "567",
            updated: "2 weeks ago",
            author: "Dr. Amina Yusuf",
            institution: "Ahmadu Bello University"
        },
        {
            id: 12,
            title: "cryptocurrency-regulation-policy",
            description: "Analyzing the impact of CBN's crypto ban on peer-to-peer trading volumes in Nigeria (2021-2023).",
            degree: "MSc",
            type: "Public",
            stars: "230",
            updated: "3 days ago",
            author: "Folake Adebayo",
            institution: "Covenant University"
        }
    ]);

    const handleRemove = (id) => {
        setSavedItems(savedItems.filter(item => item.id !== id));
        toast.success("Item removed from your library.");
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

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
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
                                className="inline-flex items-center px-4 py-2 bg-white dark:bg-secondary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg mr-2">download</span>
                                Export Bibliography
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {savedItems.length === 0 ? (
                        <div className="text-center py-16 bg-surface-light dark:bg-surface-dark border-2 border-dashed border-border-light dark:border-border-dark rounded-xl">
                            <span className="material-symbols-outlined text-4xl text-gray-400 mb-4">bookmark_border</span>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your library is empty</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">Start exploring repositories to add items to your collection.</p>
                            <Link to="/repository" className="text-primary hover:text-sky-600 font-medium">Browse Repositories &rarr;</Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {savedItems.map((item) => (
                                <div key={item.id} className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow group relative">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 pr-8">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getBadgeStyle(item.degree)}`}>
                                                    {item.degree}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                                    <span className="material-symbols-outlined text-[14px] mr-1">history</span>
                                                    Updated {item.updated}
                                                </span>
                                            </div>
                                            <Link to={`/repository/${item.id}`} className="block">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors mb-1">
                                                    {item.title}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                                {item.description}
                                            </p>
                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-4">
                                                <span className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-200">
                                                    <span className="material-symbols-outlined text-[16px]">person</span> {item.author}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[16px]">account_balance</span> {item.institution}
                                                </span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleRemove(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                            title="Remove from saved"
                                        >
                                            <span className="material-symbols-outlined">bookmark_remove</span>
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
