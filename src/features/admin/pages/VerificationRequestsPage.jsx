import React, { useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Link } from 'react-router-dom';
import { toast } from "sonner";

export const VerificationRequestsPage = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null); // For modal/detail view

    // Mock Requests
    const [requests, setRequests] = useState([
        { id: 1, name: "Dr. Sarah Jenkins", email: "s.jenkins@unilag.edu.ng", institution: "University of Lagos", department: "Computer Science", date: "2024-02-12", status: "pending", file: "staff_id.jpg" },
        { id: 2, name: "Prof. Adebayo", email: "adebayo@ui.edu.ng", institution: "University of Ibadan", department: "Physics", date: "2024-02-11", status: "pending", file: "letter_appt.pdf" },
        { id: 3, name: "Dr. Chidinma Obi", email: "c.obi@covenant.edu.ng", institution: "Covenant University", department: "Business Admin", date: "2024-02-10", status: "pending", file: "id_scan.png" },
    ]);

    const handleApprove = (id) => {
        toast.success("Lecturer Approved successfully");
        setRequests(requests.filter(r => r.id !== id));
        setSelectedRequest(null);
    };

    const handleReject = (id) => {
        toast.error("Application Rejected");
        setRequests(requests.filter(r => r.id !== id));
        setSelectedRequest(null);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                role="admin"
            />

            <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0d1117] relative p-8">
                <div className="max-w-7xl mx-auto">
                    
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Lecturer Verification</h1>
                            <p className="text-slate-500 dark:text-slate-400">Review and validate academic credentials.</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4">Lecturer</th>
                                    <th className="px-6 py-4">Institution</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Applied</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-sm">
                                                    {req.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">{req.name}</p>
                                                    <p className="text-xs text-slate-500">{req.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{req.institution}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{req.department}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{req.date}</td>
                                        <td className="px-6 py-4 flex justify-center gap-2">
                                            <button 
                                                onClick={() => setSelectedRequest(req)}
                                                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                                            >
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {requests.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                            No pending verification requests.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Review Modal */}
                    {selectedRequest && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                            <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Verify Credential</h3>
                                    <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-slate-600">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4">Applicant Details</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <span className="block text-xs text-slate-400">Full Name</span>
                                                <span className="text-base font-medium text-slate-900 dark:text-white">{selectedRequest.name}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-slate-400">Official Email</span>
                                                <span className="text-base font-medium text-slate-900 dark:text-white">{selectedRequest.email}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-slate-400">Position</span>
                                                <span className="text-base font-medium text-slate-900 dark:text-white">Senior Lecturer</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-slate-400">Institution</span>
                                                <span className="text-base font-medium text-slate-900 dark:text-white">{selectedRequest.institution}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4">Uploaded Evidence</h4>
                                        <div className="bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center h-48 group cursor-pointer hover:border-blue-500 transition-colors">
                                            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">description</span>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedRequest.file}</span>
                                            <span className="text-xs text-blue-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Click to preview</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2">
                                            * Verify the name and photo match the institution records.
                                        </p>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                                    <button 
                                        onClick={() => handleReject(selectedRequest.id)}
                                        className="px-4 py-2 rounded-lg text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 text-sm"
                                    >
                                        Reject Application
                                    </button>
                                    <button 
                                        onClick={() => handleApprove(selectedRequest.id)}
                                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
                                    >
                                        Approve & Verify
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
