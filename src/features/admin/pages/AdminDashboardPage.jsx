import React, { useState } from 'react';
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

export const AdminDashboardPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();

    // Chart Configuration
    const chartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
        datasets: [
            {
                label: 'New Projects',
                data: [65, 78, 90, 85, 98, 112, 125],
                borderColor: '#0EA5E9',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(14, 165, 233, 0.2)');
                    gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
                    return gradient;
                },
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#0EA5E9',
                pointBorderColor: '#ffffff',
                borderWidth: 2
            },
            {
                label: 'Active Users',
                data: [45, 52, 58, 64, 70, 85, 95],
                borderColor: '#8b5cf6', // Violet
                backgroundColor: 'transparent',
                tension: 0.4,
                borderDash: [5, 5],
                pointRadius: 0,
                borderWidth: 2
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    color: '#9CA3AF' 
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#1f2937',
                titleColor: '#f3f4f6',
                bodyColor: '#f3f4f6',
                borderColor: '#374151',
                borderWidth: 1
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#374151', 
                    drawBorder: false,
                },
                ticks: { color: '#9CA3AF' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9CA3AF' }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
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
                <div className="max-w-7xl mx-auto space-y-6">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Dashboard</h1>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* CPU Usage */}
                        <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-lg p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">CPU Usage</h3>
                                <span className="material-symbols-outlined text-green-500 text-[20px]">memory</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">42%</span>
                                <span className="text-xs text-green-500 flex items-center">
                                    <span className="material-symbols-outlined text-[14px]">arrow_downward</span> 2%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3">
                                <div className="bg-[#0EA5E9] h-1.5 rounded-full" style={{ width: '42%' }}></div>
                            </div>
                        </div>

                        {/* Storage S3 */}
                        <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-lg p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Storage (S3)</h3>
                                <span className="material-symbols-outlined text-blue-500 text-[20px]">database</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">12.4 TB</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">of 50 TB</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3">
                                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '24%' }}></div>
                            </div>
                        </div>

                        {/* AI Queue */}
                        <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-lg p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Queue</h3>
                                <span className="material-symbols-outlined text-purple-500 text-[20px]">rocket_launch</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">18 Jobs</span>
                                <span className="text-xs text-yellow-500 font-medium">Processing</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Avg Wait: ~45s</p>
                        </div>

                        {/* Active Researchers */}
                        <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-lg p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Researchers</h3>
                                <span className="material-symbols-outlined text-orange-500 text-[20px]">person</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">1,204</span>
                                <span className="text-xs text-green-500 flex items-center">
                                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 12%
                                </span>
                            </div>
                            <div className="flex -space-x-2 overflow-hidden mt-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-[10px] text-white font-bold">
                                        {i === 1 ? 'SJ' : i === 2 ? 'MC' : 'JD'}
                                    </div>
                                ))}
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-100 dark:bg-gray-700 text-[10px] font-medium text-gray-800 dark:text-gray-300 leading-none">+1k</span>
                            </div>
                        </div>
                    </div>

                    {/* Charts & Logs Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Chart */}
                        <div className="lg:col-span-2 bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-lg p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Repository Growth</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">New projects vs User signups over time</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700">7D</button>
                                    <button className="px-3 py-1 text-xs font-medium bg-[#0EA5E9] text-white rounded shadow-sm">30D</button>
                                    <button className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700">3M</button>
                                </div>
                            </div>
                            <div className="h-72 w-full">
                                <Line data={chartData} options={chartOptions} />
                            </div>
                        </div>

                        {/* Right: AI Status & Logs */}
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            {/* AI Status Card */}
                            <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-lg p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">AI Model Status</h3>
                                    <span className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider mb-1">Current Version</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-mono font-medium text-gray-900 dark:text-gray-200">AcadLLM v2.1</span>
                                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">Production</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider mb-1">Last Training</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">Oct 24, 2023 - 14:30 UTC</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Terminal / Logs */}
                            <div className="flex-1 bg-[#1e1e1e] rounded-lg border border-gray-200 dark:border-[#30363D] shadow-sm overflow-hidden flex flex-col font-mono text-xs h-[240px]">
                                <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-[#3e3e3e]">
                                    <span className="text-gray-400">Processing Logs</span>
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                                    </div>
                                </div>
                                <div className="p-4 space-y-1.5 overflow-y-auto text-gray-300 custom-scrollbar">
                                    <p className="text-gray-500"><span className="text-blue-400">[INFO]</span> 10:42:01 - Initializing job #9921 for user_id: 442</p>
                                    <p className="text-gray-500"><span className="text-blue-400">[INFO]</span> 10:42:02 - Vector embeddings generated (12ms)</p>
                                    <p className="text-gray-500"><span className="text-yellow-400">[WARN]</span> 10:42:05 - High memory usage detected on node-04</p>
                                    <p className="text-gray-500"><span className="text-blue-400">[INFO]</span> 10:42:08 - Job #9921 completed successfully</p>
                                    <p className="text-gray-500"><span className="text-red-400">[ERR]</span> 10:43:12 - Failed to index document DOC-882: Timeout</p>
                                    <p className="text-gray-500"><span className="text-blue-400">[INFO]</span> 10:43:14 - Retry attempt 1 for DOC-882 initiated</p>
                                    <p className="text-gray-500"><span className="text-blue-400">[INFO]</span> 10:44:00 - Scheduled maintenance check starting...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Project Table */}
                    <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#30363D] flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Project Submissions</h3>
                            <button className="text-sm text-[#0EA5E9] hover:text-blue-400 font-medium">View all</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3 tracking-wider">Project Name</th>
                                        <th className="px-6 py-3 tracking-wider">Researcher</th>
                                        <th className="px-6 py-3 tracking-wider">Level</th>
                                        <th className="px-6 py-3 tracking-wider">Status</th>
                                        <th className="px-6 py-3 tracking-wider">AI Score</th>
                                        <th className="px-6 py-3 tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-[#30363D]">
                                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-gray-400 text-lg">folder</span>
                                                Quantum Entanglement Sim
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Dr. Sarah Chen</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">PhD</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Verified
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                    <div className="bg-[#0EA5E9] h-1.5 rounded-full" style={{ width: '92%' }}></div>
                                                </div>
                                                <span className="text-xs text-gray-500">92%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-gray-400 text-lg">folder</span>
                                                ML for Protein Folding
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">James Miller</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">MSc</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                                                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span> Reviewing
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                    <div className="bg-[#0EA5E9] h-1.5 rounded-full" style={{ width: '78%' }}></div>
                                                </div>
                                                <span className="text-xs text-gray-500">78%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                <span className="material-symbols-outlined">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-gray-400 text-lg">folder</span>
                                                Sustainable Urban Planning
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Priya Patel</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">BSc</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span> Draft
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">Pending</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                <span className="material-symbols-outlined">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};
