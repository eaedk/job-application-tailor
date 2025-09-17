
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-white dark:bg-slate-800 shadow-md">
            <div className="container mx-auto px-4 py-4 lg:px-8">
                <div className="flex items-center space-x-3">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Job Application Tailor
                    </h1>
                </div>
            </div>
        </header>
    );
};
