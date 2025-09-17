import React, { useState, useEffect } from 'react';
import type { GeneratedContent, ActiveTab } from '../types';
import { TabButton } from './TabButton';
import { RichTextEditor } from './RichTextEditor';
import { Loader } from './Loader';

// jsPDF is loaded from a CDN, so we need to declare it for TypeScript
declare const jsPDF: any;

interface OutputSectionProps {
    generatedContent: GeneratedContent | null;
    setGeneratedContent: React.Dispatch<React.SetStateAction<GeneratedContent | null>>;
    loadingStates: {
        resume: boolean;
        coverLetter: boolean;
        interviewTips: boolean;
    };
    error: string | null;
}

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const Spinner = () => (
     <svg className="animate-spin h-5 w-5 text-slate-600 dark:text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export const OutputSection: React.FC<OutputSectionProps> = ({
    generatedContent,
    setGeneratedContent,
    loadingStates,
    error
}) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('resume');
    const [copied, setCopied] = useState(false);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

    useEffect(() => {
        setCopied(false);
    }, [activeTab]);

    const handleContentChange = (content: string) => {
        if (generatedContent) {
            setGeneratedContent(prev => prev ? { ...prev, [activeTab]: content } : null);
        }
    };

    const handleCopy = async () => {
        if (generatedContent && 'clipboard' in navigator && 'write' in navigator.clipboard) {
            try {
                const htmlContent = generatedContent[activeTab];
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const clipboardItem = new ClipboardItem({ 'text/html': blob });
                await navigator.clipboard.write([clipboardItem]);

                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy rich text: ', err);
                alert('Failed to copy formatted text.');
            }
        }
    };
    
    const handleDownloadPdf = async () => {
        if (!generatedContent || isDownloadingPdf) return;
        setIsDownloadingPdf(true);

        try {
            // @ts-ignore - jsPDF is loaded from window
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'p',
                unit: 'pt',
                format: 'a4',
            });

            const content = generatedContent[activeTab];
            const titleMap = {
                resume: 'Tailored Resume',
                coverLetter: 'Cover Letter',
                interviewTips: 'Interview Tips',
            };
            const title = titleMap[activeTab];
            const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;

            const styledContent = `
                <html>
                    <head>
                        <!--<style>
                        //     /*
                        //       FIX for Dark Mode Inheritance:
                        //       This reset ensures all text is black on white background
                        //     */
                        //     * {
                        //         color: #000000 !important;
                        //         background-color: #ffffff !important;
                        //         -webkit-print-color-adjust: exact !important;
                        //         print-color-adjust: exact !important;
                        //     }
                            
                        //     html, body {
                        //         background-color: #ffffff !important;
                        //         color: #000000 !important;
                        //     }
                            
                        //     body { 
                        //         font-family: Helvetica, Arial, sans-serif; 
                        //         line-height: 1.5; 
                        //         font-size: 10.5pt;
                        //         color: #000000 !important;
                        //         background-color: #ffffff !important;
                        //     }
                            
                        //     h1 { 
                        //         font-size: 22pt; 
                        //         font-weight: bold; 
                        //         border-bottom: 2px solid #dedede; 
                        //         padding-bottom: 10px; 
                        //         margin-bottom: 25px; 
                        //         color: #000000 !important;
                        //     }
                            
                        //     h2 { 
                        //         font-size: 15pt; 
                        //         font-weight: bold; 
                        //         margin-top: 22px; 
                        //         margin-bottom: 8px; 
                        //         border-bottom: 1px solid #eaeaea; 
                        //         padding-bottom: 5px;
                        //         color: #000000 !important;
                        //     }
                            
                        //     h3 { 
                        //         font-size: 12pt; 
                        //         font-weight: bold; 
                        //         margin-top: 18px; 
                        //         margin-bottom: 4px; 
                        //         color: #000000 !important;
                        //     }
                            
                        //     p, ul { 
                        //         margin-bottom: 12px; 
                        //         color: #000000 !important;
                        //     }
                            
                        //     ul { 
                        //         padding-left: 20px; 
                        //         list-style-position: outside;
                        //     }
                            
                        //     li { 
                        //         margin-bottom: 6px; 
                        //         padding-left: 5px;
                        //         color: #000000 !important;
                        //     }
                            
                        //     /* Ensure bold/strong tags are dark */
                        //     strong, b { 
                        //         font-weight: bold; 
                        //         color: #000000 !important; 
                        //     }
                            
                        //     em, i { 
                        //         font-style: italic; 
                        //     }
                            
                        //     a {
                        //         color: #0d6efd !important;
                        //         text-decoration: none;
                        //     }
                        </style> -->
                    </head>
                    <body style="background-color:#ffffff; color:#000000">
                        <!-- <h1 style="color:#000000 !important">${title}</h1> -->
                        <div style="color:#000000 !important">${content}</div>
                    </body>
                </html>
            `;
            
            await doc.html(styledContent, {
                x: 40,
                y: 40,
                width: 515, // A4 width (595pt) - 2 * 40pt margin
                windowWidth: 800,
            });
            doc.save(fileName);

        } catch (err) {
            console.error("Failed to generate PDF:", err);
            alert("Sorry, we couldn't generate the PDF. Please try again.");
        } finally {
            setIsDownloadingPdf(false);
        }
    };

    if (error) {
        return (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg h-full flex flex-col items-center justify-center">
                <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-red-600 dark:text-red-400">Generation Failed</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{error}</p>
                </div>
            </div>
        );
    }

    const isGeneratingInitial = !generatedContent && Object.values(loadingStates).some(Boolean);

    if (isGeneratingInitial) {
        return (
             <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg h-full flex flex-col items-center justify-center">
                <Loader size="large" />
                <p className="mt-4 text-slate-600 dark:text-slate-300 animate-pulse">Generating your tailored application materials...</p>
             </div>
        );
    }

    if (!generatedContent) {
        return (
             <div className="bg-dark dark:bg-slate-800 p-6 rounded-lg shadow-lg h-full flex flex-col items-center justify-center">
                <div className="text-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-slate-800 dark:text-slate-200">Your tailored content will appear here</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Upload your resume and a job description to get started.</p>
                </div>
            </div>
        );
    }

    const currentContent = generatedContent[activeTab];
    const isEditable = activeTab !== 'interviewTip';
    const anyDownloadInProgress = isDownloadingPdf;

    return (
        <div className="bg-dark dark:bg-slate-800 rounded-lg shadow-lg h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex space-x-2">
                    <TabButton
                        label="Tailored Resume"
                        isActive={activeTab === 'resume'}
                        onClick={() => setActiveTab('resume')}
                        isLoading={loadingStates.resume}
                    />
                     <TabButton
                        label="Cover Letter"
                        isActive={activeTab === 'coverLetter'}
                        onClick={() => setActiveTab('coverLetter')}
                        isLoading={loadingStates.coverLetter}
                    />
                     <TabButton
                        label="Interview Tips"
                        isActive={activeTab === 'interviewTips'}
                        onClick={() => setActiveTab('interviewTips')}
                        isLoading={loadingStates.interviewTips}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleDownloadPdf}
                        disabled={anyDownloadInProgress}
                        className="p-2 h-9 w-36 flex items-center justify-center rounded text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Download as PDF"
                    >
                        {isDownloadingPdf ? <Spinner /> : <DownloadIcon />}
                        <span className="ml-2">{isDownloadingPdf ? 'Downloading...' : 'Download PDF'}</span>
                    </button>
                    <button
                        onClick={handleCopy}
                        className="p-2 h-9 w-24 flex items-center justify-center rounded text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        aria-label="Copy content"
                    >
                        {copied ? <CheckIcon /> : <CopyIcon />}
                        <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                </div>
            </div>
             <div className="flex-grow p-4 min-h-0">
                {isEditable ? (
                    <RichTextEditor
                        value={currentContent}
                        onChange={handleContentChange}
                        placeholder={`Your ${activeTab} will appear here...`}
                    />
                ) : (
                    <div 
                        // className="content-display prose dark:prose-invert max-w-none h-full overflow-y-auto p-4 rounded-b-md bg-slate-50 dark:bg-slate-700"
                        // className="content-display p-4 flex-grow w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-700 focus:outline-none rounded-b-md prose dark:prose-invert prose-sm max-w-none [&[data-placeholder]]:empty:before:content-[attr(data-placeholder)] [&[data-placeholder]]:empty:before:text-slate-400 dark:[&[data-placeholder]]:empty:before:text-slate-500 [&[data-placeholder]]:empty:before:pointer-events-none"
                        className="p-4 flex-grow w-full overflow-y-auto bg-slate-800 dark:bg-slate-900 focus:outline-none rounded-b-md font-mono text-sm border-0 resize-none text-white"
                        dangerouslySetInnerHTML={{ __html: currentContent }}
                    />
                )}
            </div>
        </div>
    );
};