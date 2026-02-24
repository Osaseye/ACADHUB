import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../config/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { PageLoader } from '../../../components/common/PageLoader';
import { 
    User, Mail, MapPin, Briefcase, Calendar, 
    Link as LinkIcon, Edit3, Settings, MoreVertical,
    FileText, BookOpen, Award
} from 'lucide-react';

export const UserProfilePage = () => {
    const { userId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('projects');

    // Determine whose profile we are viewing
    const isOwnProfile = !userId || (currentUser && userId === currentUser.uid);
    const targetUserId = userId || (currentUser ? currentUser.uid : null);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!targetUserId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // 1. Fetch User Profile
                const userDocRef = doc(db, "users", targetUserId);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    setError("User not found");
                    setLoading(false);
                    return;
                }

                const userData = userDoc.data();
                setProfile(userData);

                // 2. Fetch User's Projects
                const projectsRef = collection(db, "projects");
                const q = query(projectsRef, where("studentId", "==", targetUserId));
                
                const querySnapshot = await getDocs(q);
                const projectsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setProjects(projectsData);

            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [targetUserId]);

    if (loading) {
        return <PageLoader />;
    }

    if (error) {
         return (
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
                <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                        <p className="text-gray-600 dark:text-gray-400">{error}</p>
                        <button 
                            onClick={() => navigate(-1)}
                            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                        >
                            Go Back
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    if (!profile) {
         return null;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
            <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
            
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto p-6 md:p-8">
                    
                    {/* Header Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
                        {/* Cover Image Placeholder */}
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                        
                        <div className="px-6 pb-6 relative">
                            <div className="flex flex-col md:flex-row items-end -mt-12 mb-4 gap-4">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {profile.photoURL ? (
                                            <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl font-bold text-gray-400">
                                                {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : 'U'}
                                            </span>
                                        )}
                                    </div>
                                    {isOwnProfile && (
                                        <button className="absolute bottom-2 right-2 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600">
                                            <Edit3 size={16} className="text-gray-600 dark:text-gray-300" />
                                        </button>
                                    )}
                                </div>

                                {/* User Info */}
                                <div className="flex-1 pt-2 md:pt-0">
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {profile.displayName || 'Unnamed User'}
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                                        {profile.role || 'Student'} • {profile.department || 'General'}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        {profile.location && (
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                <span>{profile.location}</span>
                                            </div>
                                        )}
                                        {profile.joinedAt && (
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                <span>Joined {new Date(profile.joinedAt).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 mb-2">
                                    {isOwnProfile ? (
                                        <button 
                                            onClick={() => navigate('/settings')}
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                        >
                                            <Settings size={18} />
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors">
                                            Follow
                                        </button>
                                    )}
                                    <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Bio */}
                            {profile.bio && (
                                <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl">
                                    {profile.bio}
                                </p>
                            )}
                            
                             {/* Contact/Private Info (Only for owner) */}
                            {isOwnProfile && (
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Mail size={16} />
                                        <span>{profile.email}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                                activeTab === 'projects' 
                                    ? 'text-primary border-b-2 border-primary' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                        >
                            Projects
                        </button>
                        <button
                            onClick={() => setActiveTab('about')}
                            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                                activeTab === 'about' 
                                    ? 'text-primary border-b-2 border-primary' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                        >
                            About
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-6">
                        {activeTab === 'projects' && (
                            <div>
                                {projects.length === 0 ? (
                                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-dashed">
                                        <div className="bg-gray-50 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FileText className="text-gray-400" size={32} />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No projects yet</h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {isOwnProfile 
                                                ? "You haven't uploaded any projects yet." 
                                                : "This user hasn't uploaded any projects yet."}
                                        </p>
                                        {isOwnProfile && (
                                            <button 
                                                onClick={() => navigate('/uploads/new')}
                                                className="mt-4 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
                                            >
                                                Upload Project
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {projects.map((project) => (
                                            <div 
                                                key={project.id} 
                                                onClick={() => navigate(`/repository/${project.id}`)}
                                                className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                                                        <BookOpen size={20} />
                                                    </div>
                                                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                                                        {project.category || 'Research'}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                                    {project.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                                    {project.abstract || project.description || 'No description available'}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                    <span>{project.year || new Date().getFullYear()}</span>
                                                    <span>•</span>
                                                    <span>{project.downloads || 0} Downloads</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About Me</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                                            Academic Information
                                        </label>
                                        <p className="text-gray-800 dark:text-gray-200">
                                            Department of {profile.department || 'General Studies'}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                            {profile.university || 'University of Lagos'}
                                        </p>
                                    </div>
                                    
                                    {profile.skills && profile.skills.length > 0 && (
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                                Skills & Expertise
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.skills.map((skill, index) => (
                                                    <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};