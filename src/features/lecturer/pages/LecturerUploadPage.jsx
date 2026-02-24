import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { useAuth } from '../../../context/AuthContext';
import { db, storage } from '../../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const LecturerUploadPage = () => {
    const navigate = useNavigate();
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { currentUser } = useAuth();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [projectFile, setProjectFile] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        type: 'Journal Article',
        venue: '',
        date: new Date().toISOString().split('T')[0],
        keywords: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setProjectFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!projectFile) {
            toast.error("Please upload the research document (PDF).");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Upload File
            const storageRef = ref(storage, `project_files/${currentUser.uid}/${Date.now()}_${projectFile.name}`);
            const snapshot = await uploadBytes(storageRef, projectFile);
            const downloadUrl = await getDownloadURL(snapshot.ref);

            // 2. Create Project Document
            await addDoc(collection(db, "projects"), {
                title: formData.title,
                abstract: formData.abstract,
                type: formData.type,
                venue: formData.venue,
                publicationDate: formData.date,
                keywords: formData.keywords.split(',').map(k => k.trim()),
                fileUrl: downloadUrl,
                fileName: projectFile.name,
                fileSize: (projectFile.size / 1024 / 1024).toFixed(2) + " MB",
                
                // Author Metadata
                authorId: currentUser.uid,
                authorName: currentUser.displayName || "Unknown Lecturer",
                department: currentUser.department || "General",
                university: currentUser.institution || "Unknown University",
                uploadedBy: currentUser.uid,
                role: 'lecturer',
                
                // System Metadata
                likes: 0,
                views: 0,
                citations: 0,
                status: 'published',
                createdAt: serverTimestamp()
            });

            toast.success("Research published successfully!");
            navigate('/lecturer/publications');

        } catch (error) {
            console.error("Upload Error:", error);
            toast.error("Failed to publish research.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
                role="lecturer"
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-4 sm:p-8">
                <div className="max-w-4xl mx-auto h-full flex flex-col">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Publish New Research</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Direct publication portal for faculty members.</p>
                    </div>

                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-8 animate-fade-in">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* File Upload Section */}
                            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${!projectFile ? 'border-gray-300 dark:border-gray-600 hover:border-primary bg-gray-50 dark:bg-gray-800/50' : 'border-green-500 bg-green-50 dark:bg-green-900/20'}`}>
                                <div className="space-y-2">
                                    <div className="mx-auto h-12 w-12 text-gray-400">
                                        <span className="material-symbols-outlined text-5xl">cloud_upload</span>
                                    </div>
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-hover focus-within:outline-none">
                                            <span>Upload a PDF</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PDF up to 50MB</p>
                                </div>
                                {projectFile && (
                                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600 font-medium">
                                        <span className="material-symbols-outlined text-lg">description</span>
                                        {projectFile.name}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Research Title</label>
                                <input 
                                    required
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    type="text" 
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter the full title of the work..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publication Type</label>
                                    <select 
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 dark:text-white"
                                    >
                                        <option>Journal Article</option>
                                        <option>Conference Paper</option>
                                        <option>Book Chapter</option>
                                        <option>Technical Report</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publication Venue</label>
                                    <input 
                                        name="venue"
                                        value={formData.venue}
                                        onChange={handleChange}
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g. IEEE Access, Nature"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                                <input 
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Abstract</label>
                                <textarea 
                                    required
                                    name="abstract"
                                    value={formData.abstract}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 dark:text-white"
                                    placeholder="Provide a concise summary of the research..."
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keywords</label>
                                <input 
                                    name="keywords"
                                    value={formData.keywords}
                                    onChange={handleChange}
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 dark:text-white"
                                    placeholder="Comma separated (e.g. AI, Machine Learning, Data Science)"
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-sm">rocket_launch</span>
                                            Publish Work
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};
