import React, { useState } from 'react';
import { Loader } from './Loader';

// TypeScript declarations for global libraries from CDNs
declare const pdfjsLib: any;
declare const mammoth: any;

interface InputSectionProps {
    resume: string;
    setResume: (value: string) => void;
    jobDescription: string;
    setJobDescription: (value: string) => void;
    onGenerate: () => void;
    isGenerating: boolean;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15l-4-4m4 4l4-4m-4 4V3" />
    </svg>
);

const ParsingSpinner = () => (
    <svg className="animate-spin h-4 w-4 mr-2 text-slate-600 dark:text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const InputSection: React.FC<InputSectionProps> = ({ resume, setResume, jobDescription, setJobDescription, onGenerate, isGenerating }) => {
    const [isParsing, setIsParsing] = useState<{ resume: boolean, jd: boolean }>({ resume: false, jd: false });
    const canGenerate = !isGenerating && resume.trim() !== '' && jobDescription.trim() !== '' && !isParsing.resume && !isParsing.jd;
    
    const handleFileSelect = async (
        event: React.ChangeEvent<HTMLInputElement>,
        setter: (content: string) => void,
        parserType: 'resume' | 'jd'
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsParsing(prev => ({ ...prev, [parserType]: true }));

        try {
            let text = '';
            const extension = file.name.split('.').pop()?.toLowerCase();
            const arrayBuffer = await file.arrayBuffer();

            if (extension === 'pdf') {
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
                }
                text = fullText;
            } else if (extension === 'docx') {
                const result = await mammoth.extractRawText({ arrayBuffer });
                text = result.value;
            } else { // txt, md
                 const decoder = new TextDecoder('utf-8');
                 text = decoder.decode(arrayBuffer);
            }
            setter(text);
        } catch (err) {
            console.error('Error parsing file:', err);
            alert('Could not read the file. Please ensure it is not corrupted and is a supported format (PDF, DOCX, TXT, MD).');
        } finally {
            setIsParsing(prev => ({ ...prev, [parserType]: false }));
            event.target.value = ''; // Allow re-uploading the same file
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg space-y-6">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="resume" className="block text-lg font-semibold text-slate-800 dark:text-slate-200">
                        Your Resume
                    </label>
                    <label htmlFor="resume-file" className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-indigo-500 transition disabled:opacity-50">
                        {isParsing.resume ? <ParsingSpinner /> : <UploadIcon />}
                        {isParsing.resume ? 'Parsing...' : 'Upload File'}
                    </label>
                    <input id="resume-file" name="resume-file" type="file" className="sr-only" onChange={(e) => handleFileSelect(e, setResume, 'resume')} accept=".txt,.md,.pdf,.docx" disabled={isParsing.resume} />
                </div>
                <textarea
                    id="resume"
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    placeholder="Paste your resume here or upload a file..."
                    className="w-full h-48 p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    disabled={isParsing.resume}
                />
            </div>
            <div>
                 <div className="flex justify-between items-center mb-2">
                    <label htmlFor="job-description" className="block text-lg font-semibold text-slate-800 dark:text-slate-200">
                        Job Description
                    </label>
                     <label htmlFor="jd-file" className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-indigo-500 transition disabled:opacity-50">
                        {isParsing.jd ? <ParsingSpinner /> : <UploadIcon />}
                        {isParsing.jd ? 'Parsing...' : 'Upload File'}
                    </label>
                    <input id="jd-file" name="jd-file" type="file" className="sr-only" onChange={(e) => handleFileSelect(e, setJobDescription, 'jd')} accept=".txt,.md,.pdf,.docx" disabled={isParsing.jd} />
                </div>
                <textarea
                    id="job-description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here or upload a file..."
                    className="w-full h-48 p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    disabled={isParsing.jd}
                />
            </div>
            <button
                onClick={onGenerate}
                disabled={!canGenerate}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            >
                {isGenerating ? (
                    <>
                        <Loader />
                        Generating...
                    </>
                ) : "Tailor My Application"}
            </button>
        </div>
    );
};