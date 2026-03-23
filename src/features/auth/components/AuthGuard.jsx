import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { PageLoader } from '../../../components/common/PageLoader';

export const AuthGuard = () => {
    const { currentUser, loading } = useAuth();

    if (loading) return <PageLoader />;
    
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};