import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';

export const LecturerUploadPage = () => {
    const navigate = useNavigate();
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    
    // Steps: 'input' -> 'analyzing' -> 'review'
    const [currentStep, setCurrentStep] = useState('input');

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

    const handleAnalyze = (e) => {
        e.preventDefault();
        setCurrentStep('analyzing');
        
        // Simulate AI Processing
        setTimeout(() => {
            setCurrentStep('review');
        }, 2500);
    };

    const handlePublish = () => {
        toast.success("Work published successfully!");
        navigate('/lecturer/publications');
    };

    const handleBackToEdit = () => {
        setCurrentStep('input');
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

                    {/* Content Based on Step */}
                    {currentStep === 'input' && (
                         <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-8 animate-fade-in">
                            <form onSubmit={handleAnalyze} className="space-y-6">
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
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publication Date</label>
                                        <input 
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            type="date" 
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Abstract</label>
                                    <textarea 
                                        required
                                        name="abstract"
                                        value={formData.abstract}
                                        onChange={handleChange}
                                        rows="6"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 dark:text-white resize-none"
                                        placeholder="Paste the abstract here..."
                                    ></textarea>
                                </div>
                                
                                <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center text-center">
                                    <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">cloud_upload</span>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Manuscript (PDF)</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Max file size: 10MB</p>
                                    <button type="button" className="mt-4 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                        Select File
                                    </button>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button 
                                        type="submit" 
                                        className="bg-primary hover:bg-sky-700 text-white px-8 py-3 rounded-lg shadow-sm text-sm font-bold transition-all flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">auto_awesome</span>
                                        Analyze & Review
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {currentStep === 'analyzing' && (
                        <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
                            <div className="mb-8 relative">
                                <div className="w-24 h-24 rounded-full border-4 border-gray-100 border-t-primary animate-spin"></div>
                                <span className="material-symbols-outlined absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl text-primary">psychology</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Analyzing Contribution...</h2>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                Our AI is extracting metadata, checking trend alignment, and generating potential impact scores based on your abstract.
                            </p>
                        </div>
                    )}

                    {currentStep === 'review' && (
                        <div className="space-y-6 animate-fade-in pb-12">
                             <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="p-2 bg-white dark:bg-indigo-900 rounded-lg shadow-sm">
                                        <span className="material-symbols-outlined text-indigo-600 text-2xl">auto_awesome</span>
                                    </span>
                                    <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">AI Publishing Insights</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-indigo-50 dark:border-indigo-900/50">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Trend Alignment</span>
                                        <div className="flex items-end gap-2 mt-2">
                                            <span className="text-3xl font-bold text-gray-900 dark:text-white">94%</span>
                                            <span className="text-sm font-medium text-green-600 mb-1">Very High</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Matches current "Green AI" department focus.</p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-indigo-50 dark:border-indigo-900/50">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Suggested Tags</span>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">Neural Networks</span>
                                            <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs rounded-md border border-indigo-200 dark:border-indigo-800">Low-Power IoT</span>
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">Edge Computing</span>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-indigo-50 dark:border-indigo-900/50">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Readability Score</span>
                                        <div className="flex items-end gap-2 mt-2">
                                            <span className="text-3xl font-bold text-gray-900 dark:text-white">A+</span>
                                            <span className="text-sm font-medium text-gray-400 mb-1">Academic Standard</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Abstract is concise and well-structured.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Confirm Details</h3>
                                <div className="space-y-4 text-sm">
                                    <div className="grid grid-cols-4 gap-4">
                                        <span className="text-gray-500 dark:text-gray-400">Title:</span>
                                        <span className="col-span-3 font-medium text-gray-900 dark:text-white">{formData.title}</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        <span className="text-gray-500 dark:text-gray-400">Type:</span>
                                        <span className="col-span-3 font-medium text-gray-900 dark:text-white">{formData.type}</span>
                                    </div>
                                     <div className="grid grid-cols-4 gap-4">
                                        <span className="text-gray-500 dark:text-gray-400">Abstract:</span>
                                        <span className="col-span-3 text-gray-700 dark:text-gray-300 italic">"{formData.abstract}"</span>
                                    </div>
                                </div>
                                
                                <div className="mt-8 flex items-center justify-end gap-4 border-t border-gray-100 dark:border-gray-800 pt-6">
                                    <button 
                                        onClick={handleBackToEdit}
                                        className="px-6 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
                                    >
                                        Edit Details
                                    </button>
                                    <button 
                                        onClick={handlePublish}
                                        className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md font-bold transition-all flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">send</span>
                                        Publish Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
