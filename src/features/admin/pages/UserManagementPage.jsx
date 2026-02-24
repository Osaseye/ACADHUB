import React, { useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { toast } from 'sonner';

export const UserManagementPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    // Mock User Data
    const [users, setUsers] = useState([]);

    const handleStatusChange = (userId, newStatus) => {
        setUsers(users.map(user => user.id === userId ? { ...user, status: newStatus } : user));
        toast.success(`User status updated to ${newStatus}`);
    };

    const handleDelete = (userId) => {
        if(confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            setUsers(users.filter(user => user.id !== userId));
            toast.success("User deleted successfully");
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (role) => {
        switch(role) {
            case 'admin': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
            case 'lecturer': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
            default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
        }
    };

    const getStatusIndicator = (status) => {
        switch(status) {
            case 'active': return <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400"><span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>Active</span>;
            case 'suspended': return <span className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"><span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>Suspended</span>;
            default: return <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400"><span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>Inactive</span>;
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage user access, roles, and account status.</p>
                        </div>
                        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0EA5E9] hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
                            <span className="material-symbols-outlined text-[20px]">person_add</span>
                            Add User
                        </button>
                    </div>

                    {/* Filters & Search */}
                    <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-lg p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
                        <div className="relative w-full sm:w-96">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
                            </span>
                            <input 
                                type="text" 
                                placeholder="Search users by name or email..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#0D1117] border border-gray-200 dark:border-[#30363D] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0EA5E9] outline-none transition-all"
                            />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <select 
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="h-10 bg-gray-50 dark:bg-[#0D1117] border border-gray-200 dark:border-[#30363D] rounded-lg text-sm px-3 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-[#0EA5E9] outline-none"
                            >
                                <option value="all">All Roles</option>
                                <option value="student">Students</option>
                                <option value="lecturer">Lecturers</option>
                                <option value="admin">Admins</option>
                            </select>
                            <button className="h-10 w-10 flex items-center justify-center bg-gray-50 dark:bg-[#0D1117] border border-gray-200 dark:border-[#30363D] rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                            </button>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-[#30363D] rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3 tracking-wider">User Profile</th>
                                        <th className="px-6 py-3 tracking-wider">Role</th>
                                        <th className="px-6 py-3 tracking-wider">Department</th>
                                        <th className="px-6 py-3 tracking-wider">Status</th>
                                        <th className="px-6 py-3 tracking-wider">Joined</th>
                                        <th className="px-6 py-3 tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-[#30363D]">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                                        {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${getRoleBadgeColor(user.role)} capitalize`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                                {user.department}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusIndicator(user.status)}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs font-mono">
                                                {user.joinDate}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1 text-gray-400 hover:text-[#0EA5E9] transition-colors" title="Edit User">
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>
                                                    {user.status === 'active' ? (
                                                        <button 
                                                            onClick={() => handleStatusChange(user.id, 'suspended')}
                                                            className="p-1 text-gray-400 hover:text-orange-500 transition-colors" 
                                                            title="Suspend User"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">block</span>
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleStatusChange(user.id, 'active')}
                                                            className="p-1 text-gray-400 hover:text-green-500 transition-colors" 
                                                            title="Activate User"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors" 
                                                        title="Delete User"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                                <div className="flex flex-col items-center justify-center">
                                                    <span className="material-symbols-outlined text-4xl mb-3 text-gray-300 dark:text-gray-600">search_off</span>
                                                    <p>No users found matching your criteria.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Simple Pagination */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200 dark:border-[#30363D] flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Showing <span className="font-medium text-gray-900 dark:text-white">0</span> to <span className="font-medium text-gray-900 dark:text-white">{filteredUsers.length}</span> of <span className="font-medium text-gray-900 dark:text-white">{users.length}</span> results
                            </span>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 border border-gray-200 dark:border-[#30363D] bg-white dark:bg-[#161B22] rounded text-xs font-medium text-gray-500 disabled:opacity-50" disabled>Previous</button>
                                <button className="px-3 py-1 border border-gray-200 dark:border-[#30363D] bg-white dark:bg-[#161B22] rounded text-xs font-medium text-gray-500 disabled:opacity-50" disabled>Next</button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};
