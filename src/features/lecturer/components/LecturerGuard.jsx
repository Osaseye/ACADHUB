import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { PageLoader } from '../../../components/common/PageLoader';

export const LecturerGuard = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <PageLoader />;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (currentUser.role !== 'lecturer' && currentUser.role !== 'admin') {
        // Option: allow trying to become a lecturer? For now, redirect home
        return <Navigate to="/" replace />;
    }

    // Admin bypass for testing/support
    if (currentUser.role === 'admin') {
        return <Outlet />;
    }

    // Check verification status
    if (currentUser.verificationStatus === 'pending') {
        return (
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-100 dark:border-gray-700">
                    <div className="bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-3xl">hourglass_empty</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification Pending</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Thank you for registering. Your profile is currently under review by our administrative team. 
                        You will receive an email once your academic credentials have been verified.
                    </p>
                    <div className="flex flex-col gap-3">
                        <div className="text-sm bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 p-3 rounded-lg">
                            Status: <span className="font-semibold">Review in Progress</span>
                        </div>
                        <button 
                            onClick={() => window.location.reload()}
                            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline"
                        >
                            Check again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (currentUser.verificationStatus === 'rejected') {
        return (
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-100 dark:border-gray-700">
                    <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-3xl">block</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification Failed</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        We were unable to verify your academic credentials. Please contact support or university administration for assistance.
                    </p>
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium transition-colors">
                        Contact Support
                    </button>
                </div>
            </div>
        );
    }

    // Only allow verified users
    if (currentUser.verificationStatus === 'verified' || currentUser.isVerified === true) {
        return <Outlet />;
    }

    // Fallback for missing status (e.g. old accounts or partial setup)
    // If onboarding is not completed, redirect there?
    if (!currentUser.onboardingCompleted) {
        return <Navigate to="/onboarding/lecturer" replace />;
    }

    // If verified status is missing but onboarding is done (edge case), treat as pending or error
    return <Navigate to="/onboarding/lecturer" replace />;
};
