import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';
import { toast } from 'sonner';
import { db } from '../../../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export const UserManagementPage = () => {
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    // Mock User Data
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const querySnapshot = await getDocs(collection(db, "users"));
                const usersList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    // Fallback for fields if they are missing
                    name: doc.data().displayName || doc.data().email?.split('@')[0] || 'Unknown',
                    joinDate: doc.data().createdAt?.seconds 
                        ? new Date(doc.data().createdAt.seconds * 1000).toLocaleDateString()
                        : 'N/A',
                    department: doc.data().department || 'N/A',
                    status: doc.data().status || 'active'
                }));
                setUsers(usersList);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleStatusChange = async (userId, newStatus) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { status: newStatus });
            
            setUsers(users.map(user => user.id === userId ? { ...user, status: newStatus } : user));
            toast.success(`User status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
        
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { role: newRole });
            
            setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
            toast.success(`User role updated to ${newRole}`);
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("Failed to update role");
        }
    };

    const handleDelete = async (userId) => {
        if(confirm("Are you sure you want to delete this user? This removes their profile data but may not delete their authentication account.")) {
            try {
                await deleteDoc(doc(db, "users", userId));
                setUsers(users.filter(user => user.id !== userId));
                toast.success("User profile deleted successfully");
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user");
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const nameMatch = user.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSearch = nameMatch || emailMatch;
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

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
                                    {loading ? (
                                         <tr>
                                             <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                 Loading users...
                                             </td>
                                         </tr>
                                    ) : filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select 
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    className={`
                                                        appearance-none cursor-pointer pl-2 pr-6 py-1 rounded text-xs font-medium border capitalize outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
                                                        ${user.role === 'admin' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800' : ''}
                                                        ${user.role === 'lecturer' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800' : ''}
                                                        ${user.role === 'student' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : ''}
                                                    `}
                                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.2rem center`, backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
                                                >
                                                    <option value="student">Student</option>
                                                    <option value="lecturer">Lecturer</option>
                                                    <option value="admin">Admin</option>
                                                </select>
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
                                    {!loading && filteredUsers.length === 0 && (
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
