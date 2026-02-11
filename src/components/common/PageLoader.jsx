import React from 'react';

export const PageLoader = () => {
    return (
        <div className="flex items-center justify-center min-h-[50vh] w-full">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                    <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-[#0969DA] border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium animate-pulse">Loading...</p>
            </div>
        </div>
    );
};
