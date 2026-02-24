import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../config/firebase';
import { collection, getDocs, query, orderBy, where, addDoc, deleteDoc, doc } from 'firebase/firestore';

export const RepositoryPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { currentUser } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // State for projects and filtering
    const [projects, setProjects] = useState([]);
    const [savedProjectIds, setSavedProjectIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDegree, setSelectedDegree] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('All');

    // Fetch projects and saved items
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Verified Projects
                const projectsRef = collection(db, 'projects');
                const qProjects = query(projectsRef, where('status', '==', 'verified'), orderBy('createdAt', 'desc'));
                const projectsSnapshot = await getDocs(qProjects);
                
                const projectsData = projectsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setProjects(projectsData);

                // Fetch Saved Items if user is logged in
                if (currentUser) {
                    const savedRef = collection(db, 'saved_items');
                    const qSaved = query(savedRef, where("userId", "==", currentUser.uid));
                    const savedSnapshot = await getDocs(qSaved);
                    const savedIds = new Set(savedSnapshot.docs.map(doc => doc.data().projectId));
                    setSavedProjectIds(savedIds);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load repository data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);

    // Handle Degree Filter Change
    const handleDegreeChange = (degree) => {
        setSelectedDegree(prev => {
            if (prev.includes(degree)) {
                return prev.filter(d => d !== degree);
            } else {
                return [...prev, degree];
            }
        });
    };

    // Filter Logic
    const filteredProjects = projects.filter(project => {
        const matchesSearch = (project.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                              (project.abstract?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesDepartment = selectedDepartment === 'All' || project.department === selectedDepartment;
        const matchesDegree = selectedDegree.length === 0 || selectedDegree.includes(project.degree);

        return matchesSearch && matchesDepartment && matchesDegree;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRepositories = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleStar = async (project) => {
        if (!currentUser) {
            toast.error("Please log in to save items");
            return;
        }

        try {
            if (savedProjectIds.has(project.id)) {
                // Remove from saved
                const q = query(
                    collection(db, 'saved_items'), 
                    where("userId", "==", currentUser.uid),
                    where("projectId", "==", project.id)
                );
                const querySnapshot = await getDocs(q);
                
                querySnapshot.forEach(async (docSnap) => {
                    await deleteDoc(doc(db, 'saved_items', docSnap.id));
                });

                setSavedProjectIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(project.id);
                    return newSet;
                });
                toast.success(`Removed "${project.title}" from saved items`);
            } else {
                // Add to saved
                await addDoc(collection(db, 'saved_items'), {
                    userId: currentUser.uid,
                    projectId: project.id,
                    projectTitle: project.title,
                    savedAt: new Date()
                });

                setSavedProjectIds(prev => {
                    const newSet = new Set(prev);
                    newSet.add(project.id);
                    return newSet;
                });
                toast.success(`Saved "${project.title}"`);
            }
        } catch (error) {
            console.error("Error toggling save:", error);
            toast.error("Failed to update saved status");
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
                                <span className="text-sm font-mono font-bold">{filteredProjects.length}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                                <div className="bg-secondary h-1.5 rounded-full" style={{width: `${Math.min((filteredProjects.length / projects.length) * 100, 100)}%`}}></div>
                            </div>
                            <span className="text-xs text-text-muted-light dark:text-text-muted-dark">Showing {itemsPerPage} items per page</span>
                        </div>

                        {/* Filters */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold border-b border-border-light dark:border-border-dark pb-2">Filter By</h3>
                            
                            {/* Degree Level */}
                            <div>
                                <label className="text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase mb-2 block">Degree Level</label>
                                <div className="space-y-2">
                                    {['PhD', 'MSc', 'BSc'].map((degree) => (
                                        <label key={degree} className="flex items-center gap-2 cursor-pointer group">
                                            <input 
                                                className="rounded border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-primary focus:ring-0" 
                                                type="checkbox"
                                                checked={selectedDegree.includes(degree)}
                                                onChange={() => handleDegreeChange(degree)}
                                            />
                                            <span className="text-sm group-hover:text-secondary transition-colors">{degree}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Department */}
                            <div>
                                <label className="text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase mb-2 block">Department</label>
                                <select 
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    className="w-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-md text-sm py-1.5 px-2 focus:ring-1 focus:ring-secondary focus:border-secondary outline-none"
                                >
                                    <option value="All">All Departments</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Economics">Economics</option>
                                    <option value="Agriculture">Agriculture</option>
                                    <option value="Public Health">Public Health</option>
                                    <option value="History">History</option>
                                    <option value="Engineering">Engineering</option>
                                    {/* Add other departments as needed */}
                                </select>
                            </div>

                            {/* Year Range (Placeholder for now but kept structure) */}
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
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
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
                                <Link to="/uploads/new" className="bg-primary hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2 text-sm transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-sm">book</span>
                                    New Project
                                </Link>
                            </div>
                        </div>

                        {/* Repository List */}
                        <div className="bg-background-light dark:bg-surface-dark rounded-md border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark shadow-sm">
                            {loading ? (
                                <div className="text-center py-12 px-4">
                                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                     <p className="text-text-muted-light dark:text-text-muted-dark">Loading projects...</p>
                                </div>
                            ) : currentRepositories.length === 0 ? (
                                <div className="text-center py-12 px-4">
                                    <span className="material-symbols-outlined text-4xl text-text-muted-light dark:text-text-muted-dark mb-3">library_books</span>
                                    <h3 className="text-lg font-medium text-text-light dark:text-white">No research papers found</h3>
                                    <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Try adjusting your search criteria or check back later.</p>
                                </div>
                            ) : (
                                currentRepositories.map(repo => (
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
                                                </div>
                                                <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-3 line-clamp-2 max-w-3xl">
                                                    {repo.abstract || repo.description || "No description available."}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-muted-light dark:text-text-muted-dark">
                                                    <div className="flex items-center gap-1 hover:text-secondary cursor-pointer transition-colors">
                                                        <span className="material-symbols-outlined text-[16px]">star_border</span>
                                                        <span>{repo.stars || 0}</span>
                                                    </div>
                                                    <div>
                                                        Year <span className="font-mono">{repo.year}</span>
                                                    </div>
                                                    <div className="hidden sm:block text-text-light dark:text-white opacity-60">
                                                        by <span className="font-medium">{repo.studentName}</span> ({repo.department})
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="hidden sm:flex flex-col items-end gap-2">
                                                <button 
                                                    onClick={() => handleStar(repo)}
                                                    className={`flex items-center gap-1 px-3 py-1 border rounded-md text-xs font-medium transition-colors shadow-sm active:scale-95 ${
                                                        savedProjectIds.has(repo.id)
                                                        ? "bg-primary text-white border-primary hover:bg-primary/90"
                                                        : "bg-surface-light dark:bg-background-dark border-border-light dark:border-border-dark text-text-light dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                                                    }`}
                                                >
                                                    <span className={`material-symbols-outlined text-[16px] ${savedProjectIds.has(repo.id) ? "filled" : ""}`}>
                                                        {savedProjectIds.has(repo.id) ? "bookmark" : "bookmark_border"}
                                                    </span>
                                                    {savedProjectIds.has(repo.id) ? "Saved" : "Save"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
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
