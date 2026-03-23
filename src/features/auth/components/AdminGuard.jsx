import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { PageLoader } from '../../../components/common/PageLoader';

export const AdminGuard = () => {
    const { currentUser, loading } = useAuth();

    if (loading) return <PageLoader />;
    
    if (!currentUser || currentUser.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};