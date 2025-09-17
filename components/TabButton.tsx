
import React from 'react';

interface TabButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    isLoading: boolean;
}

export const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick, isLoading }) => {
    const baseClasses = "px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-indigo-500 transition-colors duration-200";
    const activeClasses = "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300";
    const inactiveClasses = "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700";

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
            <div className="flex items-center space-x-2">
                 {isLoading && (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                <span>{label}</span>
            </div>
        </button>
    );
};
