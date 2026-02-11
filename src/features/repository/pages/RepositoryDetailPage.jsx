import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
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

export const RepositoryDetailPage = () => {
    const { id } = useParams();
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
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
                toggleSidebar={toggleSidebar} 
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* Breadcrumbs */}
                    <nav className="flex mb-4 text-sm font-medium text-text-muted-light dark:text-text-muted-dark" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link to="/dashboard" className="hover:text-primary transition-colors">Home</Link>
                            </li>
                            <li className="flex items-center">
                                <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                                <Link to="/repository" className="hover:text-primary transition-colors">Repository</Link>
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
                            <div className="mt-5 flex lg:mt-0 lg:ml-4 gap-3">
                                <span className="hidden sm:block">
                                    <button className="inline-flex items-center px-4 py-2 border border-border-light dark:border-border-dark rounded-md shadow-sm text-sm font-medium text-text-light dark:text-text-dark bg-white dark:bg-[#21262d] hover:bg-slate-50 dark:hover:bg-[#30363d] focus:outline-none transition-colors" type="button">
                                        <span className="material-symbols-outlined mr-2 !text-lg">bookmark</span>
                                        Save
                                    </button>
                                </span>
                                <span className="hidden sm:block">
                                    <button className="inline-flex items-center px-4 py-2 border border-border-light dark:border-border-dark rounded-md shadow-sm text-sm font-medium text-text-light dark:text-text-dark bg-white dark:bg-[#21262d] hover:bg-slate-50 dark:hover:bg-[#30363d] focus:outline-none transition-colors" type="button">
                                        <span className="material-symbols-outlined mr-2 !text-lg">format_quote</span>
                                        Cite
                                    </button>
                                </span>
                                <span className="sm:ml-3">
                                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors" type="button">
                                        <span className="material-symbols-outlined mr-2 !text-lg">download</span>
                                        Download PDF
                                    </button>
                                </span>
                            </div>
                        </div>
                        
                        {/* Tabs */}
                        <div className="mt-8 border-b border-border-light dark:border-border-dark">
                            <nav className="-mb-px flex space-x-8 overflow-x-auto">
                                {[
                                    { id: 'overview', label: 'Overview', icon: 'article' },
                                    { id: 'full-doc', label: 'Full Document', icon: 'picture_as_pdf' },
                                    { id: 'ai-insights', label: 'AI Insights', icon: 'auto_awesome', beta: true },
                                    { id: 'trends', label: 'Trends & Impact', icon: 'show_chart' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`${
                                            activeTab === tab.id
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:border-gray-300 dark:hover:border-gray-600'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
                                    >
                                        <span className={`material-symbols-outlined mr-2 !text-lg ${tab.id === 'ai-insights' ? 'text-purple-500' : ''}`}>{tab.icon}</span>
                                        {tab.label}
                                        {tab.beta && (
                                            <span className="ml-2 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 py-0.5 px-2 rounded-full text-xs">Beta</span>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content Area */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Abstract Section */}
                            <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <span className="material-symbols-outlined text-8xl">description</span>
                                </div>
                                <h2 className="text-lg font-semibold text-text-light dark:text-white mb-4 flex items-center">Abstract</h2>
                                <div className="prose dark:prose-invert max-w-none text-text-muted-light dark:text-text-muted-dark text-sm leading-relaxed text-justify">
                                    <p>
                                        Medical imaging analysis using deep learning has achieved remarkable success in recent years. However, the sensitive nature of patient data creates significant hurdles for centralized data collection, which is typically required for training robust models. This thesis proposes a novel Federated Learning (FL) framework tailored for medical imaging that enables collaborative model training without sharing raw patient data.
                                    </p>
                                    <p className="mt-4">
                                        We introduce a dynamic aggregation algorithm that accounts for the non-IID (Independent and Identically Distributed) nature of medical data across different hospitals. Our experiments on three public datasets demonstrate that our approach achieves accuracy comparable to centralized training while preserving differential privacy guarantees. Furthermore, we present a lightweight client-side architecture suitable for deployment on edge devices within hospital networks.
                                    </p>
                                </div>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {['Federated Learning', 'Medical Imaging', 'Differential Privacy', 'Deep Learning'].map(tag => (
                                        <span key={tag} className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-text-muted-light dark:text-text-muted-dark text-xs font-medium border border-border-light dark:border-border-dark">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {/* Full Document Tab */}
                            {activeTab === 'full-doc' ? (
                                <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm p-8 text-center">
                                    <div className="mx-auto w-24 h-24 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
                                        <span className="material-symbols-outlined text-5xl">picture_as_pdf</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-text-light dark:text-white mb-2">Federated Learning Framework.pdf</h3>
                                    <p className="text-text-muted-light dark:text-text-muted-dark mb-6">3.4 MB • Uploaded on Oct 24, 2023</p>
                                    
                                    <div className="flex justify-center gap-4">
                                        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-md hover:bg-sky-600 transition-colors shadow-sm font-medium">
                                            <span className="material-symbols-outlined">download</span>
                                            Download PDF
                                        </button>
                                        <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#21262d] border border-border-light dark:border-border-dark text-text-light dark:text-text-dark rounded-md hover:bg-gray-50 dark:hover:bg-[#30363d] transition-colors font-medium">
                                            <span className="material-symbols-outlined">visibility</span>
                                            Preview
                                        </button>
                                    </div>
                                </section>
                            ) : null}

                            {/* AI Insights Section */}
                            {activeTab === 'ai-insights' || activeTab === 'overview' ? (
                                <section className="bg-gradient-to-br from-indigo-50 to-white dark:from-[#161b22] dark:to-[#0d1117] border border-indigo-100 dark:border-indigo-900/30 rounded-lg shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                                            <span className="material-symbols-outlined">auto_awesome</span>
                                            AI-Generated Insights
                                        </h2>
                                        <span className="text-xs font-mono text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">Model: AcadGPT-4</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white dark:bg-[#21262d] p-4 rounded-md border border-indigo-50 dark:border-border-dark shadow-sm">
                                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Key Findings</h3>
                                            <ul className="space-y-3">
                                                <li className="flex items-start gap-2">
                                                    <span className="material-symbols-outlined text-green-500 text-lg mt-0.5">check_circle</span>
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">Achieved <strong className="text-slate-900 dark:text-white">94.5% accuracy</strong> on MRI classification without centralizing data.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="material-symbols-outlined text-green-500 text-lg mt-0.5">check_circle</span>
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">Reduced communication overhead by <strong className="text-slate-900 dark:text-white">40%</strong> using novel compression.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="material-symbols-outlined text-green-500 text-lg mt-0.5">check_circle</span>
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">Proven robustness against gradient leakage attacks.</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="bg-white dark:bg-[#21262d] p-4 rounded-md border border-indigo-50 dark:border-border-dark shadow-sm">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Novelty Score</h3>
                                                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">8.5/10</span>
                                                </div>
                                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                                                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-2">High novelty in aggregation algorithm design.</p>
                                            </div>
                                            <div className="bg-white dark:bg-[#21262d] p-4 rounded-md border border-indigo-50 dark:border-border-dark shadow-sm">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sentiment</h3>
                                                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Positive</span>
                                                </div>
                                                <div className="flex gap-1 mt-2">
                                                    <span className="h-1.5 w-full bg-emerald-500 rounded-full"></span>
                                                    <span className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                                                    <span className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-2">Optimistic tone regarding future implementation.</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            ) : null}

                            {/* Trends Chart */}
                            {activeTab === 'trends' || activeTab === 'overview' ? (
                                <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-text-light dark:text-white mb-4 flex items-center justify-between">
                                        <span>Research Impact & Trends</span>
                                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                            <button className="px-3 py-1 bg-white dark:bg-gray-700 rounded-md shadow-sm text-xs font-medium text-slate-800 dark:text-slate-200">Citations</button>
                                            <button className="px-3 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700">Downloads</button>
                                        </div>
                                    </h2>
                                    <div className="relative h-64 w-full">
                                        <Line data={chartData} options={chartOptions} />
                                    </div>
                                    <p className="text-xs text-center text-text-muted-light dark:text-text-muted-dark mt-4">Growth of citations for this topic over the last 5 years.</p>
                                </section>
                            ) : null}
                        </div>

                        {/* Right Sidebar */}
                        <aside className="space-y-6">
                            {/* Project Details */}
                            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm overflow-hidden">
                                <div className="bg-slate-50 dark:bg-[#21262d] px-4 py-3 border-b border-border-light dark:border-border-dark">
                                    <h3 className="text-sm font-semibold text-text-light dark:text-white">Project Details</h3>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div>
                                        <span className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider block mb-1">Supervisor</span>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs">AT</div>
                                            <span className="text-sm text-text-light dark:text-white font-medium">Dr. Alan Turing</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider block mb-1">Degree</span>
                                            <span className="text-sm text-text-light dark:text-white">PhD</span>
                                        </div>
                                        <div>
                                            <span className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider block mb-1">Department</span>
                                            <span className="text-sm text-text-light dark:text-white">Computer Science</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider block mb-1">License</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-sm">balance</span>
                                            <span className="text-sm text-text-light dark:text-white">CC BY-NC 4.0</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-border-light dark:border-border-dark grid grid-cols-3 gap-2 text-center">
                                        <div>
                                            <span className="block text-lg font-bold text-text-light dark:text-white">42</span>
                                            <span className="text-xs text-text-muted-light dark:text-text-muted-dark">Citations</span>
                                        </div>
                                        <div>
                                            <span className="block text-lg font-bold text-text-light dark:text-white">1.2k</span>
                                            <span className="text-xs text-text-muted-light dark:text-text-muted-dark">Views</span>
                                        </div>
                                        <div>
                                            <span className="block text-lg font-bold text-text-light dark:text-white">89</span>
                                            <span className="text-xs text-text-muted-light dark:text-text-muted-dark">Downloads</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-[#21262d] px-4 py-3 border-t border-border-light dark:border-border-dark flex justify-between items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-[#30363d] transition-colors">
                                    <Link to="/profile/Dr.%20Alan%20Turing" className="text-xs font-medium text-primary hover:underline flex items-center gap-1 w-full">
                                        <span className="material-symbols-outlined text-sm">person</span>
                                        View Supervisor Profile
                                    </Link>
                                    <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-sm">chevron_right</span>
                                </div>
                            </div>

                            {/* Related Research */}
                            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm">
                                <div className="px-4 py-3 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-text-light dark:text-white">Related Research</h3>
                                    <a href="#" className="text-xs text-primary hover:underline">View All</a>
                                </div>
                                <ul className="divide-y divide-border-light dark:divide-border-dark">
                                    {[
                                        { title: "Privacy-Preserving Machine Learning in Healthcare: A Survey", author: "M. Al-Rubaie et al.", year: "2021" },
                                        { title: "Split Learning for Health: Distributed Deep Learning without Sharing Raw Patient Data", author: "P. Vepakomma et al.", year: "2018" },
                                        { title: "Communication-Efficient Learning of Deep Networks from Decentralized Data", author: "H. McMahan et al.", year: "2017" }
                                    ].map((item, idx) => (
                                        <li key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-[#1f242c] transition-colors cursor-pointer group">
                                            <h4 className="text-sm font-medium text-text-light dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                                {item.title}
                                            </h4>
                                            <div className="mt-2 flex justify-between items-center">
                                                <span className="text-xs text-text-muted-light dark:text-text-muted-dark">{item.author}</span>
                                                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded">{item.year}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Author */}
                            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm p-4">
                                <Link to="/profile/Sarah%20Jenkins" className="flex items-center gap-3 group">
                                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-transparent group-hover:ring-primary transition-all">
                                        SJ
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-text-light dark:text-white group-hover:text-primary transition-colors">Author</h3>
                                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Sarah Jenkins</p>
                                    </div>
                                    <span className="ml-auto material-symbols-outlined text-text-muted-light dark:text-text-muted-dark group-hover:text-primary text-sm">open_in_new</span>
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
};