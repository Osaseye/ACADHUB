import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import { db } from '../../../config/firebase';
import { collection, query, orderBy, onSnapshot, limit, where, getDocs, documentId } from 'firebase/firestore';

export const LecturerRepositoryPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { currentUser, loading: authLoading } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading || !currentUser) return;

        // Fetch verified projects only
        const q = query(
            collection(db, 'projects'),
            where('status', '==', 'verified'),
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const fetchedProjects = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                description: doc.data().abstract || "No description provided",
                // Store raw data for fallback fetching
                rawAuthor: doc.data().authorName,
                rawInstitution: doc.data().university,
                studentId: doc.data().studentId,
                updated: doc.data().createdAt?.toDate().toLocaleDateString() || 'Recently',
                stars: doc.data().likes || 0,
                degree: "Research" // Default tag
            }));
            
            // Identify missing authors or institutions
            const missingAuthorIds = [...new Set(fetchedProjects
                .filter(p => !p.rawAuthor || !p.rawInstitution)
                .filter(p => p.studentId)
                .map(p => p.studentId))];
            
            let userMap = {};
            if (missingAuthorIds.length > 0) {
                try {
                    // Fetch users in batches of 10 (Firestore 'in' limit)
                    const chunks = [];
                    for (let i = 0; i < missingAuthorIds.length; i += 10) {
                        chunks.push(missingAuthorIds.slice(i, i + 10));
                    }

                    for (const chunk of chunks) {
                        const usersQ = query(collection(db, "users"), where(documentId(), 'in', chunk));
                        const userSnaps = await getDocs(usersQ);
                        userSnaps.forEach(doc => {
                            userMap[doc.id] = doc.data();
                        });
                    }
                } catch (err) {
                    console.error("Error fetching missing authors:", err);
                }
            }

            // Map final data
            const finalProjects = fetchedProjects.map(p => {
                const user = userMap[p.studentId];
                const fallbackName = user ? (user.displayName || (user.firstName ? `${user.firstName} ${user.lastName}` : "Unknown Student")) : "Unknown Author";
                const fallbackInst = user ? (user.institution || "Unknown Institution") : "Unknown Institution";

                return {
                    ...p,
                    author: p.rawAuthor || fallbackName,
                    institution: p.rawInstitution || fallbackInst,
                    // Ensure description isn't undefined if abstract missing
                    description: p.description || "No description provided"
                };
            });

            setProjects(finalProjects);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser, authLoading]);

     const filteredRepos = projects.filter(repo => 
        (repo.title && repo.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (repo.author && repo.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
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
                        {loading || authLoading ? (
                             <div className="text-center py-12">
                                <span className="text-gray-500">Loading repository...</span>
                             </div>
                        ) : filteredRepos.length === 0 ? (
                            <div className="text-center py-12 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
                                <span className="material-symbols-outlined text-4xl text-gray-400 mb-3">search_off</span>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No repositories found</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search or filters.</p>
                            </div>
                        ) : (
                            filteredRepos.map((repo) => (
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
                            ))
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};
