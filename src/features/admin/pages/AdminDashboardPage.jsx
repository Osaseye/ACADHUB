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
        labels: [],
        datasets: []
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
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">0%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3">
                                <div className="bg-[#0EA5E9] h-1.5 rounded-full" style={{ width: '0%' }}></div>
                            </div>
                        </div>

                        {/* Storage S3 */}
                        <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-lg p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Storage (S3)</h3>
                                <span className="material-symbols-outlined text-blue-500 text-[20px]">database</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">0 TB</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">of 50 TB</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3">
                                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                            </div>
                        </div>

                        {/* AI Queue */}
                        <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-lg p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Queue</h3>
                                <span className="material-symbols-outlined text-purple-500 text-[20px]">rocket_launch</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">0 Jobs</span>
                                <span className="text-xs text-gray-500 font-medium">Idle</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">-</p>
                        </div>

                        {/* Active Researchers */}
                        <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-lg p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Researchers</h3>
                                <span className="material-symbols-outlined text-orange-500 text-[20px]">person</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">0</span>
                            </div>
                            <div className="flex -space-x-2 overflow-hidden mt-3">
                                <span className="text-xs text-gray-500 dark:text-gray-400">No active users</span>
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
                                </div>
                                <div className="p-4 space-y-1.5 overflow-y-auto text-gray-300 custom-scrollbar flex items-center justify-center h-full">
                                    <p className="text-gray-500 italic">No active logs</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Project Table */}
                    <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#30363D] flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Project Submissions</h3>
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
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            No recent project submissions found.
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
