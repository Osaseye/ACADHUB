import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export const TrendsPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const chartRef = useRef(null);
    // Initial data with solid colors as fallback
    const [chartData, setChartData] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Computer Science',
                data: [65, 70, 75, 72, 80, 85, 95, 100, 110, 105, 115, 125],
                borderColor: '#0ea5e9',
                backgroundColor: 'rgba(14, 165, 233, 0.5)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 6
            },
            {
                label: 'Engineering',
                data: [40, 45, 42, 50, 55, 52, 60, 65, 62, 70, 75, 80],
                borderColor: '#0f2e63',
                backgroundColor: 'rgba(15, 46, 99, 0.5)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 6
            },
            {
                label: 'Social Sciences',
                data: [20, 22, 25, 24, 28, 30, 28, 32, 35, 38, 40, 42],
                borderColor: '#cbd5e1',
                borderDash: [5, 5],
                borderWidth: 2,
                tension: 0.4,
                fill: false,
                pointRadius: 0,
                pointHoverRadius: 4
            }
        ]
    });

    useEffect(() => {
        const chart = chartRef.current;
        
        if (chart && chart.ctx) {
            const ctx = chart.ctx;
            const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
            gradient1.addColorStop(0, 'rgba(14, 165, 233, 0.5)');
            gradient1.addColorStop(1, 'rgba(14, 165, 233, 0.0)');

            const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
            gradient2.addColorStop(0, 'rgba(15, 46, 99, 0.5)');
            gradient2.addColorStop(1, 'rgba(15, 46, 99, 0.0)');

            // Only update if gradients are successfully created
            setChartData(prev => ({
                ...prev,
                datasets: prev.datasets.map((dataset, i) => {
                    if (i === 0) return { ...dataset, backgroundColor: gradient1 };
                    if (i === 1) return { ...dataset, backgroundColor: gradient2 };
                    return dataset;
                })
            }));
        }
    }, []);

    const doughnutData = {
        labels: ['BSc Projects', 'MSc Theses', 'PhD Dissertations'],
        datasets: [{
            data: [55, 30, 15],
            backgroundColor: [
                '#0ea5e9', // Primary
                '#0f2e63', // Secondary
                '#94a3b8'  // Slate-400
            ],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            }
        }
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: document.documentElement.classList.contains('dark') ? '#334155' : '#f1f5f9',
                },
                border: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: false
                },
                 border: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    {/* Header Controls */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trends & Visual Analytics</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Explore research trends across departments and degrees.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <span className="material-symbols-outlined text-lg">school</span>
                                </span>
                                <select className="pl-10 pr-8 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none shadow-sm dark:text-white">
                                    <option>All Degrees</option>
                                    <option>BSc</option>
                                    <option>MSc</option>
                                    <option>PhD</option>
                                </select>
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <span className="material-symbols-outlined text-lg">apartment</span>
                                </span>
                                <select className="pl-10 pr-8 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none shadow-sm dark:text-white">
                                    <option>All Departments</option>
                                    <option>Computer Science</option>
                                    <option>Engineering</option>
                                    <option>Social Sciences</option>
                                    <option>Bio-Med</option>
                                </select>
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <span className="material-symbols-outlined text-lg">calendar_today</span>
                                </span>
                                <select className="pl-10 pr-8 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none shadow-sm dark:text-white">
                                    <option>Last 12 Months</option>
                                    <option>2023</option>
                                    <option>2022</option>
                                    <option>All Time</option>
                                </select>
                            </div>
                            <button className="bg-secondary hover:bg-opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-md transition">
                                <span className="material-symbols-outlined text-lg mr-1">filter_list</span> Apply
                            </button>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Top Trending Topic</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Generative AI</h3>
                                <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center font-medium">
                                    <span className="material-symbols-outlined text-base mr-1">trending_up</span> +34% vs last month
                                </p>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-primary">
                                <span className="material-symbols-outlined text-2xl">auto_graph</span>
                            </div>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Repository Growth Rate</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">12.5%</h3>
                                <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center font-medium">
                                    <span className="material-symbols-outlined text-base mr-1">arrow_upward</span> +2.1% points
                                </p>
                            </div>
                            <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-lg text-teal-600 dark:text-teal-400">
                                <span className="material-symbols-outlined text-2xl">show_chart</span>
                            </div>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Most Active Department</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Computer Science</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">452 new projects</p>
                            </div>
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <span className="material-symbols-outlined text-2xl">groups</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Topic Popularity Over Time</h3>
                                <button className="text-gray-400 hover:text-primary dark:hover:text-primary">
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </div>
                            <div className="relative h-72 w-full">
                                <Line ref={chartRef} data={chartData} options={lineOptions} />
                            </div>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Degree Level Distribution</h3>
                                <button className="text-gray-400 hover:text-primary dark:hover:text-primary">
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </div>
                            <div className="relative flex-grow flex items-center justify-center h-64">
                                <Doughnut data={doughnutData} options={doughnutOptions} />
                            </div>
                        </div>
                        
                        {/* Heatmap Section */}
                        <div className="lg:col-span-3 bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Keyword Frequency Heatmap</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Low Freq</span>
                                    <div className="w-16 h-2 rounded-full bg-gradient-to-r from-teal-100 to-secondary"></div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">High Freq</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                                <div className="bg-secondary text-white p-3 rounded-md text-center text-sm font-medium opacity-100 shadow-sm">Machine Learning</div>
                                <div className="bg-secondary text-white p-3 rounded-md text-center text-sm font-medium opacity-90 shadow-sm">Deep Learning</div>
                                <div className="bg-secondary text-white p-3 rounded-md text-center text-sm font-medium opacity-80 shadow-sm">NLP</div>
                                <div className="bg-secondary text-white p-3 rounded-md text-center text-sm font-medium opacity-75 shadow-sm">Computer Vision</div>
                                <div className="bg-primary text-white p-3 rounded-md text-center text-sm font-medium opacity-90 shadow-sm">Robotics</div>
                                <div className="bg-primary text-white p-3 rounded-md text-center text-sm font-medium opacity-80 shadow-sm">Data Mining</div>
                                <div className="bg-primary text-white p-3 rounded-md text-center text-sm font-medium opacity-70 shadow-sm">Blockchain</div>
                                <div className="bg-primary text-white p-3 rounded-md text-center text-sm font-medium opacity-60 shadow-sm">IoT</div>
                                <div className="bg-secondary text-white p-3 rounded-md text-center text-sm font-medium opacity-60 shadow-sm">Cybersecurity</div>
                                <div className="bg-secondary text-white p-3 rounded-md text-center text-sm font-medium opacity-50 shadow-sm">Cloud Computing</div>
                                <div className="bg-primary text-white p-3 rounded-md text-center text-sm font-medium opacity-50 shadow-sm">Big Data</div>
                                <div className="bg-primary text-white p-3 rounded-md text-center text-sm font-medium opacity-40 shadow-sm">Bioinformatics</div>
                                <div className="bg-primary text-white p-3 rounded-md text-center text-sm font-medium opacity-30 shadow-sm">Quantum Comp.</div>
                                <div className="bg-teal-200 text-teal-900 p-3 rounded-md text-center text-sm font-medium shadow-sm">AR/VR</div>
                                <div className="bg-teal-100 text-teal-800 p-3 rounded-md text-center text-sm font-medium shadow-sm">Ethics in AI</div>
                                <div className="bg-teal-50 text-teal-700 p-3 rounded-md text-center text-sm font-medium shadow-sm">Green Tech</div>
                            </div>
                        </div>

                        {/* AI Trends Report */}
                        <div className="lg:col-span-3 bg-gradient-to-r from-secondary to-primary p-[1px] rounded-xl shadow-lg">
                            <div className="bg-surface-light dark:bg-surface-dark rounded-[11px] p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary opacity-10 blur-3xl rounded-full"></div>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                                            <span className="material-symbols-outlined text-white text-xl">psychology</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                AI-Generated Trend Report
                                                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border border-blue-200 dark:border-blue-800">Beta</span>
                                            </h3>
                                            <span className="text-xs text-gray-400">Generated just now</span>
                                        </div>
                                        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                                            <p>
                                                <strong className="text-secondary dark:text-primary">Summary:</strong> Analysis of the current quarter indicates a significant surge in <strong>Generative AI</strong> research, primarily driven by PhD candidates in the Computer Science department. While traditional fields like Data Mining are stabilizing, there is a notable <span className="text-green-600 dark:text-green-400 font-medium">12% uptick</span> in interdisciplinary projects combining <strong>NLP</strong> and <strong>Bioinformatics</strong>.
                                            </p>
                                            <p className="mt-2">
                                                <strong className="text-secondary dark:text-primary">Recommendation:</strong> Departments should consider increasing resource allocation for GPU clusters to support the growing demand for deep learning model training observed in MSc thesis proposals.
                                            </p>
                                        </div>
                                        <div className="pt-2">
                                            <button className="text-xs font-medium text-primary hover:text-secondary dark:hover:text-sky-300 flex items-center gap-1 transition-colors">
                                                View full detailed report <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
