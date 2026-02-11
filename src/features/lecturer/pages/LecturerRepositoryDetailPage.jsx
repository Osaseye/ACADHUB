import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const LecturerRepositoryDetailPage = () => {
    const { id } = useParams();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Chart Data
    const chartData = {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [{
            label: 'Citations',
            data: [2, 5, 12, 28, 42, 55],
            borderColor: '#0ea5e9',
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(14, 165, 233, 0.2)');
                gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
                return gradient;
            },
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#0ea5e9',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#1e293b',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: '#334155',
                borderWidth: 1
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#e2e8f0', borderDash: [4, 4] },
                ticks: { color: '#64748b' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#64748b' }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
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
                    
                    {/* Breadcrumbs for Lecturer */}
                    <nav className="flex mb-4 text-sm font-medium text-text-muted-light dark:text-text-muted-dark" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link to="/lecturer/dashboard" className="hover:text-primary transition-colors">Home</Link>
                            </li>
                            <li className="flex items-center">
                                <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                                <Link to="/lecturer/repository" className="hover:text-primary transition-colors">Repository</Link>
                            </li>
                            <li className="flex items-center">
                                <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                                <span className="text-text-light dark:text-white" aria-current="page">Privacy-Preserving Medical Imaging</span>
                            </li>
                        </ol>
                    </nav>

                    {/* Header Section */}
                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6 mb-8 shadow-sm">
                        <div className="lg:flex lg:items-start lg:justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                                        PhD Thesis
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        2023
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 border border-purple-200 dark:border-purple-800">
                                        <span className="material-symbols-outlined !text-[14px]">psychology</span> Computer Science
                                    </span>
                                    <span className="font-mono text-xs text-text-muted-light dark:text-text-muted-dark ml-2">ID: <span className="select-all">CS-2023-8921</span></span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold leading-7 text-text-light dark:text-white sm:truncate sm:tracking-tight mb-2">
                                    Federated Learning Approaches for Privacy-Preserving Medical Imaging Analysis
                                </h1>
                                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                                    <div className="mt-2 flex items-center text-sm text-text-muted-light dark:text-text-muted-dark">
                                        <span className="material-symbols-outlined mr-1.5 text-[18px]">person</span>
                                        <span className="hover:underline text-primary cursor-pointer">Sarah Jenkins</span>, <span className="hover:underline text-primary cursor-pointer">Dr. Alan Turing (Sup.)</span>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-text-muted-light dark:text-text-muted-dark">
                                        <span className="material-symbols-outlined mr-1.5 text-[18px]">account_balance</span>
                                        University of Lagos
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-green-600 dark:text-green-400">
                                        <span className="material-symbols-outlined mr-1.5 text-[18px]">check_circle</span>
                                        Peer Reviewed
                                    </div>
                                </div>
                            </div>
                            
                            {/* Lecturer Specific Actions */}
                            <div className="mt-5 flex lg:mt-0 lg:ml-4 gap-3">
                                 <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md shadow-sm text-blue-600 dark:text-blue-400 bg-white dark:bg-surface-dark hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <span className="material-symbols-outlined mr-2 -ml-1 text-[20px]">fact_check</span>
                                    Verify
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    <span className="material-symbols-outlined mr-2 -ml-1 text-[20px]">download</span>
                                    Download Full Text
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                             {/* Abstract */}
                             <section className="bg-surface-light dark:bg-surface-dark rounded-lg p-6 border border-border-light dark:border-border-dark shadow-sm">
                                <h2 className="text-lg font-bold text-text-light dark:text-white mb-4">Abstract</h2>
                                <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed">
                                    The rapid digitization of healthcare records has led to an explosion of medical imaging data, offering significant opportunities for improving diagnostic accuracy through machine learning. However, the sharing of patient data between institutions is severely restricted by privacy regulations such as HIPAA and GDPR. This thesis proposes a novel Federated Learning (FL) framework that enables collaborative training of deep learning models for medical image analysis without requiring raw data exchange...
                                </p>
                            </section>

                            {/* Analytics (Citations) */}
                            <section className="bg-surface-light dark:bg-surface-dark rounded-lg p-6 border border-border-light dark:border-border-dark shadow-sm">
                                <h2 className="text-lg font-bold text-text-light dark:text-white mb-4">Citation Growth</h2>
                                <div className="h-64">
                                     <Line data={chartData} options={chartOptions} />
                                </div>
                            </section>

                            {/* Lecturer Only: Grading / Internal Notes */}
                             <section className="bg-surface-light dark:bg-surface-dark rounded-lg p-6 border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-900/10 shadow-sm">
                                <h2 className="text-lg font-bold text-yellow-800 dark:text-yellow-500 mb-4 flex items-center">
                                    <span className="material-symbols-outlined mr-2">lock</span> 
                                    Internal Lecturer Notes
                                </h2>
                                <div className="space-y-4">
                                    <div className="p-3 bg-white dark:bg-black/20 rounded border border-yellow-100 dark:border-yellow-900/30">
                                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                                            <strong>Dr. Roberts:</strong> Excellent methodology, but sampling size in Chapter 4 needs further justification. Recommended for departmental award.
                                        </p>
                                    </div>
                                    <textarea 
                                        className="w-full p-2 text-sm border border-border-light dark:border-border-dark rounded-md bg-white dark:bg-black/30 text-text-light dark:text-text-dark focus:ring-yellow-500 focus:border-yellow-500"
                                        placeholder="Add a private note..."
                                        rows="2"
                                    ></textarea>
                                    <div className="flex justify-end">
                                        <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium rounded shadow-sm">
                                            Save Note
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                        
                        {/* Sidebar Info */}
                         <div className="space-y-6">
                            {/* Paper Stats */}
                            <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-6 border border-border-light dark:border-border-dark shadow-sm">
                                <h3 className="text-sm font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mb-4">Paper Statistics</h3>
                                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="px-4 py-3 bg-background-light dark:bg-background-dark rounded-lg">
                                        <dt className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark truncate">Views</dt>
                                        <dd className="mt-1 text-xl font-semibold text-text-light dark:text-white">4,291</dd>
                                    </div>
                                    <div className="px-4 py-3 bg-background-light dark:bg-background-dark rounded-lg">
                                        <dt className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark truncate">Downloads</dt>
                                        <dd className="mt-1 text-xl font-semibold text-text-light dark:text-white">832</dd>
                                    </div>
                                    <div className="px-4 py-3 bg-background-light dark:bg-background-dark rounded-lg">
                                        <dt className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark truncate">Citations</dt>
                                        <dd className="mt-1 text-xl font-semibold text-text-light dark:text-white">55</dd>
                                    </div>
                                     <div className="px-4 py-3 bg-background-light dark:bg-background-dark rounded-lg">
                                        <dt className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark truncate">Plagiarism Score</dt>
                                        <dd className="mt-1 text-xl font-semibold text-green-600 dark:text-green-500">12%</dd>
                                    </div>
                                </dl>
                            </div>
                         </div>
                    </div>

                </div>
            </main>
        </div>
    );
};
