import React, { useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';

export const ContentModerationPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const [activeTab, setActiveTab] = useState('pending');

    // Mock Data for Reports
    const reports = [];

    const getSeverityColor = (severity) => {
        switch(severity) {
            case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
            case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
            default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#F3F4F6] dark:bg-[#0D1117] text-gray-900 dark:text-gray-300 font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                role="admin"
            />
            
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-5xl mx-auto space-y-6">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Moderation</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Review flagged content and manage community standards.</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold border border-red-200 dark:border-red-800 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                                0 Critical Actions
                            </span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 dark:border-[#30363D]">
                        <nav className="-mb-px flex space-x-6">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'pending'
                                    ? 'border-[#0EA5E9] text-[#0EA5E9]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            >
                                Pending Review <span className="ml-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">0</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('resolved')}
                                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'resolved'
                                    ? 'border-[#0EA5E9] text-[#0EA5E9]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            >
                                Resolved History
                            </button>
                            <button
                                onClick={() => setActiveTab('banned')}
                                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'banned'
                                    ? 'border-[#0EA5E9] text-[#0EA5E9]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            >
                                Banned Users
                            </button>
                        </nav>
                    </div>

                    {/* Content List */}
                    <div className="space-y-4">
                        {reports.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-lg p-6 shadow-sm flex flex-col md:flex-row gap-6">
                                {/* Left: Type Icon */}
                                <div className="flex-shrink-0">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center 
                                        ${item.type === 'comment' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                                        ${item.type === 'project' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                                        ${item.type === 'user' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                                    `}>
                                        <span className="material-symbols-outlined text-[20px]">
                                            {item.type === 'comment' ? 'chat_bubble' : item.type === 'project' ? 'folder' : 'person'}
                                        </span>
                                    </div>
                                </div>

                                {/* Middle: Content Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getSeverityColor(item.severity)}`}>
                                            {item.severity.toUpperCase()} Priority
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 border-l border-gray-300 dark:border-gray-700">
                                            Reported {item.timestamp} by {item.reportedBy}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                        Reason: <span className="text-red-500 dark:text-red-400">{item.reason}</span>
                                    </h3>
                                    
                                    <div className="bg-gray-50 dark:bg-[#0D1117] rounded p-3 border border-gray-100 dark:border-[#30363D] text-sm text-gray-700 dark:text-gray-300 font-mono mb-2">
                                        "{item.content}"
                                    </div>

                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-4">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">account_circle</span>
                                            Offender: <span className="font-medium text-gray-700 dark:text-gray-300 hover:underline cursor-pointer">{item.author}</span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                                            Location: {item.location}
                                        </span>
                                    </div>
                                </div>

                                {/* Right: Actions */}
                                <div className="flex flex-row md:flex-col gap-2 justify-center md:items-end border-t md:border-t-0 md:border-l border-gray-200 dark:border-[#30363D] pt-4 md:pt-0 md:pl-6 mt-2 md:mt-0">
                                    <button className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white dark:bg-[#21262D] hover:bg-gray-50 dark:hover:bg-[#30363D] text-gray-700 dark:text-gray-300 text-xs font-medium rounded border border-gray-200 dark:border-[#30363D] transition-colors w-full md:w-auto">
                                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                                        View
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-medium rounded shadow-sm w-full md:w-auto">
                                        <span className="material-symbols-outlined text-[16px]">check</span>
                                        Keep
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded shadow-sm w-full md:w-auto">
                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Pagination / Empty State */}
                        {reports.length === 0 && (
                            <div className="text-center py-12">
                                <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">check_circle</span>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">All caught up!</h3>
                                <p className="text-gray-500 dark:text-gray-400">No pending reports to review.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
