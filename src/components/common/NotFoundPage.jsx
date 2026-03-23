import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a] px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-9xl font-black text-primary/20 select-none">404</h1>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-[-40px]">
             <span className="material-symbols-outlined text-[100px] text-primary">route</span>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Page Not Found</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-[#1e293b] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined mr-2 text-sm">arrow_back</span>
            Go Back
          </button>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-sky-600 transition-colors"
          >
            <span className="material-symbols-outlined mr-2 text-sm">home</span>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
