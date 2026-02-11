import React, { useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

export const SupervisionManagementPage = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('requests'); // requests | active
    const navigate = useNavigate();


    // Mock Data
    const [requests, setRequests] = useState([
        { 
            id: 1, 
            studentName: "Chinedu Okeke", 
            matricNo: "19/XY/0445",
            degree: "BSc",
            department: "Computer Science",
            topic: "AI in Traffic Control", 
            abstract: "This project aims to leverage computer vision algorithms...",
            date: "2026-02-09" 
        },
        { 
            id: 2, 
            studentName: "Ngozi Udeh", 
            matricNo: "22/PG/MSC/012",
            degree: "MSc",
            department: "Computer Science",
            topic: "Igbo NLP Corpus Construction", 
            abstract: "We propose the creation of the largest annotated Igbo dataset...",
            date: "2026-02-06" 
        },
        { 
            id: 3, 
            studentName: "Yakubu Musa", 
            matricNo: "18/ENG/0221",
            degree: "BSc",
            department: "Electrical Engineering",
            topic: "Smart Grid Analysis for Rural Areas", 
            abstract: "Analyzing feasibility of solar-wind hybrid systems...",
            date: "2026-02-01" 
        }
    ]);

    const [activeStudents, setActiveStudents] = useState([
        { id: 101, name: "Fatima Adamu", topic: "Blockchain for Land Registry", progress: 65, lastMeet: "2 days ago" },
        { id: 102, name: "David West", topic: "EdTech in Basic Schools", progress: 40, lastMeet: "1 week ago" }
    ]);

    const handleApprove = (id) => {
        const student = requests.find(r => r.id === id);
        if (student) {
            setRequests(requests.filter(r => r.id !== id));
            setActiveStudents([...activeStudents, { 
                id: student.id + 100, 
                name: student.studentName, 
                topic: student.topic, 
                progress: 0, 
                lastMeet: "Never" 
            }]);
            toast.success(`You are now supervising ${student.studentName}`);
        }
    };

    const handleDecline = (id) => {
        setRequests(requests.filter(r => r.id !== id));
        toast.info("Request declined.");
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                role="lecturer"
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Supervision Management</h1>

                    {/* Tabs */}
                    <div className="border-b border-border-light dark:border-border-dark mb-6">
                        <div className="flex space-x-8">
                            <button
                                onClick={() => setActiveTab('requests')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            >
                                Pending Requests 
                                {requests.length > 0 && <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">{requests.length}</span>}
                            </button>
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'active' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            >
                                Active Students
                                <span className="ml-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-0.5 px-2 rounded-full text-xs">{activeStudents.length}</span>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {activeTab === 'requests' ? (
                        <div className="space-y-6">
                            {requests.length === 0 ? (
                                <p className="text-gray-500 text-center py-12">No pending supervision requests.</p>
                            ) : (
                                requests.map((req) => (
                                    <div 
                                        key={req.id} 
                                        onClick={() => navigate(`/lecturer/supervision/${req.id}`)}
                                        className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{req.studentName}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                                                        req.degree === 'PhD' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                        req.degree === 'MSc' ? 'bg-green-100 text-green-800 border-green-200' :
                                                        'bg-blue-100 text-blue-800 border-blue-200'
                                                    }`}>
                                                        {req.degree} Student
                                                    </span>
                                                    <span className="text-xs text-gray-500">{req.date}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1"><span className="font-semibold">Matric No:</span> {req.matricNo}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3"><span className="font-semibold">Target Topic:</span> {req.topic}</p>
                                                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Abstract Preview</p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 italic line-clamp-2">"{req.abstract}"</p>
                                                </div>
                                            </div>
                                            <div className="flex md:flex-col gap-3 min-w-[120px]">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/lecturer/supervision/${req.id}`);
                                                    }}
                                                    className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors"
                                                >
                                                    Review Proposal
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activeStudents.map((student) => (
                                <div key={student.id} className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col h-full">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-lg">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{student.name}</h3>
                                            <p className="text-xs text-green-600 dark:text-green-400">Active - On Track</p>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{student.topic}</p>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                                            <div className="bg-primary h-2 rounded-full" style={{ width: `${student.progress}%` }}></div>
                                        </div>
                                        <p className="text-xs text-right text-gray-500 mb-4">{student.progress}% Complete</p>
                                        
                                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                            <p>Last Meeting: {student.lastMeet}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark flex gap-2">
                                        <button 
                                            onClick={() => navigate('/repository')} 
                                            className="flex-1 border border-border-light dark:border-border-dark py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                                        >
                                            View Work
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
