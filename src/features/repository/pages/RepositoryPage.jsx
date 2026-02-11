import React, { useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';

export const RepositoryPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Nigerian Context Data - Removed language/forks
    const allRepositories = [
        {
            id: 1,
            title: "fintech-adoption-lagos-sme",
            description: "An empirical analysis of Fintech adoption rates among Small and Medium Enterprises in Lagos State. Includes survey data from 500 businesses.",
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
            description: "Investigation into the viability of locally sourced laterite and bamboo as sustainable alternatives for low-cost housing in South-West Nigeria.",
            degree: "PhD",
            type: "Public",
            stars: "890",
            updated: "on Apr 14",
            author: "Dr. Funmi Adebayo",
            institution: "University of Lagos"
        },
        {
            id: 3,
            title: "malaria-vector-control-kano",
            description: "Longitudinal study on the efficacy of insecticide-treated nets in suburban Kano metropolis. Analyzing resistance patterns in Anopheles mosquitoes.",
            degree: "PhD",
            type: "Public",
            stars: "450",
            updated: "on Mar 28",
            author: "Ibrahim Musa",
            institution: "Bayero University Kano"
        },
        {
            id: 4,
            title: "igbo-nlp-sentiment-corpus",
            description: "The first large-scale annotated corpus for sentiment analysis in the Igbo language. Derived from social media text and news comments.",
            degree: "MSc",
            type: "Public",
            stars: "312",
            updated: "on Feb 10",
            author: "Ngozi Udeh",
            institution: "UNN"
        },
        {
            id: 5,
            title: "oil-spill-remediation-delta",
            description: "Comparative analysis of bioremediation techniques for crude oil contaminated soil in the Niger Delta region using native bacterial consortiums.",
            degree: "BSc",
            type: "Public",
            stars: "156",
            updated: "yesterday",
            author: "Efe Clark",
            institution: "FUPre"
        },
        {
            id: 6,
            title: "renewable-microgrid-rural-electrification",
            description: "Design and simulation of a solar-biomass hybrid microgrid for off-grid rural communities in Ogun State.",
            degree: "MSc",
            type: "Public",
            stars: "204",
            updated: "3 days ago",
            author: "Tunde Bakare",
            institution: "Covenant University"
        },
        {
            id: 7,
            title: "cassava-disease-detection-cnn",
            description: "Deep learning mobile application model for early detection of Cassava Mosaic Disease for farmers in Oyo State.",
            degree: "BSc",
            type: "Public",
            stars: "98",
            updated: "1 week ago",
            author: "Seyi Makinde",
            institution: "FUTA"
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
            id: 9,
            title: "educational-policy-nomadic-schools",
            description: "Critical review of the Nomadic Education Programme effectiveness in improving literacy rates among pastoralist communities.",
            degree: "MSc",
            type: "Public",
            stars: "134",
            updated: "3 weeks ago",
            author: "Yakubu Mohammed",
            institution: "University of Abuja"
        },
        {
            id: 10,
            title: "solid-waste-management-ibadan",
            description: "GIS-based optimization of municipal solid waste collection routes in Ibadan metropolis to reduce operational costs.",
            degree: "MSc",
            type: "Public",
            stars: "245",
            updated: "1 month ago",
            author: "Kemi Ojo",
            institution: "University of Ibadan"
        },
        {
            id: 11,
            title: "telemedicine-adoption-rural-clinics",
            description: "Barriers and facilitators to the adoption of telemedicine platforms in primary healthcare centers in Ekiti State.",
            degree: "PhD",
            type: "Public",
            stars: "310",
            updated: "1 month ago",
            author: "Dr. Bisi Fayemi",
            institution: "Ekiti State University"
        },
        {
            id: 12,
            title: "youth-unemployment-entrepreneurship",
            description: "The impact of government youth empowerment schemes (N-Power) on entrepreneurship development among graduates.",
            degree: "BSc",
            type: "Public",
            stars: "88",
            updated: "2 months ago",
            author: "Emeka Obi",
            institution: "Nnamdi Azikiwe University"
        }
    ];

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRepositories = allRepositories.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(allRepositories.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleStar = (repoTitle) => {
        // Randomly succeed or fail for demo purposes
        const isSuccess = Math.random() > 0.3; 
        if (isSuccess) {
            toast.success(`Starred "${repoTitle}" successfully!`);
        } else {
            toast.error(`Failed to star "${repoTitle}". Please try again.`);
        }
    };

    const getBadgeStyle = (degree) => {
        switch(degree) {
            case 'PhD': return "bg-[#fff8c5] dark:bg-yellow-900/20 text-[#9a6700] dark:text-yellow-500 border border-yellow-200 dark:border-yellow-700/50";
            case 'MSc': return "bg-[#dafbe1] dark:bg-green-900/20 text-[#1a7f37] dark:text-green-500 border border-green-200 dark:border-green-700/50";
            case 'BSc': return "bg-[#ddf4ff] dark:bg-blue-900/20 text-[#0969da] dark:text-blue-500 border border-blue-200 dark:border-blue-700/50";
            default: return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700";
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1 space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-4">
                            <h3 className="text-sm font-semibold mb-3">Quick Stats</h3>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Results found</span>
                                <span className="text-sm font-mono font-bold">{allRepositories.length}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                                <div className="bg-secondary h-1.5 rounded-full" style={{width: "45%"}}></div>
                            </div>
                            <span className="text-xs text-text-muted-light dark:text-text-muted-dark">Top 10% of repositories match your profile</span>
                        </div>

                        {/* Filters */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold border-b border-border-light dark:border-border-dark pb-2">Filter By</h3>
                            
                            {/* Degree Level */}
                            <div>
                                <label className="text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase mb-2 block">Degree Level</label>
                                <div className="space-y-2">
                                    {[
                                        { label: "PhD Thesis", count: 15 },
                                        { label: "MSc Dissertation", count: 42 },
                                        { label: "BSc Project", count: 88 }
                                    ].map((item, idx) => (
                                        <label key={idx} className="flex items-center gap-2 cursor-pointer group">
                                            <input className="rounded border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-primary focus:ring-0" type="checkbox"/>
                                            <span className="text-sm group-hover:text-secondary transition-colors">{item.label}</span>
                                            <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-xs px-2 py-0.5 rounded-full text-text-muted-light dark:text-text-muted-dark">{item.count}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Department */}
                            <div>
                                <label className="text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase mb-2 block">Department</label>
                                <select className="w-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-md text-sm py-1.5 px-2 focus:ring-1 focus:ring-secondary focus:border-secondary outline-none">
                                    <option>Computer Science</option>
                                    <option>Economics</option>
                                    <option>Agriculture</option>
                                    <option>Public Health</option>
                                    <option>History</option>
                                    <option>Engineering</option>
                                </select>
                            </div>

                            {/* Year Range */}
                            <div>
                                <label className="text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase mb-2 block">Year Range</label>
                                <div className="flex items-center gap-2">
                                    <input className="w-1/2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-md text-sm py-1.5 px-2 outline-none focus:border-secondary" placeholder="2020" type="number"/>
                                    <span className="text-text-muted-light dark:text-text-muted-dark">-</span>
                                    <input className="w-1/2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-md text-sm py-1.5 px-2 outline-none focus:border-secondary" placeholder="2024" type="number"/>
                                </div>
                            </div>
                        </div>

                        {/* Popular Topics */}
                        <div className="pt-4 border-t border-border-light dark:border-border-dark">
                            <h3 className="text-sm font-semibold mb-3">Popular Topics</h3>
                            <div className="flex flex-wrap gap-2">
                                {["fintech", "malaria", "agriculture", "energy", "nollywood"].map(tag => (
                                    <a key={tag} className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors cursor-pointer capitalize">
                                        {tag}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        {/* Search & Sort Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border-light dark:border-border-dark pb-4">
                            <div className="flex-1 w-full">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark group-focus-within:text-primary transition-colors text-[20px]">search</span>
                                    </div>
                                    <input 
                                        type="text" 
                                        className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-md focus:ring-2 focus:ring-secondary focus:border-secondary dark:text-white transition-shadow outline-none" 
                                        placeholder="Find a repository by title, author or keyword..."
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative inline-block text-left">
                                    <button className="inline-flex justify-center w-full rounded-md border border-border-light dark:border-border-dark px-4 py-2 bg-surface-light dark:bg-surface-dark text-sm font-medium text-text-primary-light dark:text-text-primary-dark hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none items-center" type="button">
                                        Sort: Best Match
                                        <span className="material-symbols-outlined ml-2 -mr-1 text-[20px]">arrow_drop_down</span>
                                    </button>
                                </div>
                                <button className="bg-primary hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2 text-sm transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-sm">book</span>
                                    New Project
                                </button>
                            </div>
                        </div>

                        {/* Repository List */}
                        <div className="bg-background-light dark:bg-surface-dark rounded-md border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark shadow-sm">
                            {currentRepositories.map(repo => (
                                <div key={repo.id} className="p-4 hover:bg-surface-light dark:hover:bg-background-dark transition-colors group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-[20px]">bookmark_border</span>
                                                <h3 className="text-base font-semibold">
                                                    <Link to={`/repository/${repo.id}`} className="text-secondary hover:underline break-all cursor-pointer">{repo.title}</Link>
                                                </h3>
                                                <span className={`${getBadgeStyle(repo.degree)} text-xs font-medium px-2 py-0.5 rounded-full border`}>
                                                    {repo.degree}
                                                </span>
                                                <span className="text-xs border border-border-light dark:border-border-dark rounded-full px-2 py-0.5 text-text-muted-light dark:text-text-muted-dark font-medium">
                                                    {repo.type}
                                                </span>
                                            </div>
                                            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-3 line-clamp-2 max-w-3xl">
                                                {repo.description}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-muted-light dark:text-text-muted-dark">
                                                <div className="flex items-center gap-1 hover:text-secondary cursor-pointer transition-colors">
                                                    <span className="material-symbols-outlined text-[16px]">star_border</span>
                                                    <span>{repo.stars}</span>
                                                </div>
                                                <div>
                                                    Updated <span className="font-mono">{repo.updated}</span>
                                                </div>
                                                <div className="hidden sm:block text-text-light dark:text-white opacity-60">
                                                    by <span className="font-medium">{repo.author}</span> ({repo.institution})
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden sm:flex flex-col items-end gap-2">
                                            <button 
                                                onClick={() => handleStar(repo.title)}
                                                className="flex items-center gap-1 px-3 py-1 bg-surface-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md text-xs font-medium text-text-light dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm active:scale-95"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">star_border</span>
                                                Star
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-3 py-1 text-sm text-secondary disabled:text-text-muted-light dark:disabled:text-text-muted-dark disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                            >
                                <span className="material-symbols-outlined text-base">chevron_left</span> Previous
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${
                                        currentPage === page
                                            ? "bg-primary text-white shadow-sm"
                                            : "text-text-light dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 px-3 py-1 text-sm text-secondary hover:text-blue-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors disabled:text-text-muted-light dark:disabled:text-text-muted-dark disabled:cursor-not-allowed"
                            >
                                Next <span className="material-symbols-outlined text-base">chevron_right</span>
                            </button>
                        </div>
                    </main>
                </div>
            </main>
        </div>
    );
};
