import React, { useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Link } from 'react-router-dom';

export const LecturerRepositoryPage = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Lecturer-focused mock data (perhaps larger scope or includes restricted papers)
    const allRepositories = [
        {
            id: 1,
            title: "fintech-adoption-lagos-sme",
            description: "An empirical analysis of Fintech adoption rates among Small and Medium Enterprises in Lagos State.",
            degree: "MSc",
            type: "Public",
            stars: "1.2k",
            updated: "2 days ago",
            author: "Chinedu Okeke",
            institution: "LBS (Pan-Atlantic University)"
        },
        {
            id: 2,
            title: "sustainable-housing-materials-ng",
            description: "Investigation into the viability of locally sourced laterite and bamboo as sustainable alternatives.",
            degree: "PhD",
            type: "Public",
            stars: "890",
            updated: "on Apr 14",
            author: "Dr. Funmi Adebayo",
            institution: "University of Lagos"
        },
        // ... more items
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
    ];

     const filteredRepos = allRepositories.filter(repo => 
        repo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                role="lecturer"
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-4 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-text-light dark:text-white">Research Repository (Lecturer Access)</h1>
                            <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Search the complete academic database including restricted archives.</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-8">
                        <div className="relative max-w-2xl">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-gray-400">search</span>
                            </span>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-3 border border-border-light dark:border-border-dark rounded-lg leading-5 bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder-text-muted-light dark:placeholder-text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm shadow-sm"
                                placeholder="Search by title, author, or keyword..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                     {/* Filters (Lecturer specific?) */}
                     <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        <button className="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-medium whitespace-nowrap">All Research</button>
                        <button className="px-4 py-1.5 rounded-full bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium whitespace-nowrap hover:bg-gray-50 dark:hover:bg-gray-700">Theses & Dissertations</button>
                        <button className="px-4 py-1.5 rounded-full bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium whitespace-nowrap hover:bg-gray-50 dark:hover:bg-gray-700">Faculty Publications</button>
                        <button className="px-4 py-1.5 rounded-full bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium whitespace-nowrap hover:bg-gray-50 dark:hover:bg-gray-700">Grant Proposals</button>
                    </div>

                    {/* Repo Grid */}
                    <div className="space-y-4">
                        {filteredRepos.map((repo) => (
                             <div key={repo.id} className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                         <div className="flex items-center gap-2 mb-1">
                                            <Link to={`/lecturer/repository/${repo.id}`} className="text-lg font-bold text-primary dark:text-sky-400 hover:underline">
                                                {repo.title}
                                            </Link>
                                            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs border border-gray-200 dark:border-gray-700">
                                                {repo.type}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-3 line-clamp-2 max-w-3xl">
                                            {repo.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">school</span>
                                                {repo.degree}
                                            </span>
                                            <span className="flex items-center gap-1">
                                               <span className="material-symbols-outlined text-sm">person</span>
                                               {repo.author} ({repo.institution})
                                            </span>
                                             <span>Updated {repo.updated}</span>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex flex-col items-end gap-2">
                                         <button className="flex items-center gap-1 text-gray-500 hover:text-yellow-500 transition-colors">
                                            <span className="material-symbols-outlined text-lg">star</span>
                                            <span className="text-xs font-medium">{repo.stars}</span>
                                        </button>
                                    </div>
                                </div>
                             </div>
                        ))}
                    </div>

                </div>
            </main>
        </div>
    );
};
