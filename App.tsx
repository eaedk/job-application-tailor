
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import { generateTailoredResume, generateCoverLetter, generateInterviewTips } from './services/geminiService';
import type { GeneratedContent } from './types';

const App: React.FC = () => {
    const [resume, setResume] = useState<string>('');
    const [jobDescription, setJobDescription] = useState<string>('');
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
    const [loadingStates, setLoadingStates] = useState({
        resume: false,
        coverLetter: false,
        interviewTips: false,
    });
    const [error, setError] = useState<string | null>(null);

    const isGenerating = Object.values(loadingStates).some(Boolean);

    const handleGenerate = useCallback(async () => {
        if (!resume || !jobDescription) {
            setError("Please provide both a resume and a job description.");
            return;
        }
        setError(null);
        setGeneratedContent(null);
        
        setLoadingStates({ resume: true, coverLetter: true, interviewTips: true });

        const contentUpdater = (key: keyof GeneratedContent, value: string) => {
             setGeneratedContent(prev => ({
                ...(prev || { resume: '', coverLetter: '', interviewTips: '' }),
                [key]: value
            }));
        };

        try {
            const resumePromise = generateTailoredResume(resume, jobDescription).then(text => {
                contentUpdater('resume', text);
                setLoadingStates(prev => ({ ...prev, resume: false }));
            });

            const coverLetterPromise = generateCoverLetter(resume, jobDescription).then(text => {
                contentUpdater('coverLetter', text);
                setLoadingStates(prev => ({ ...prev, coverLetter: false }));
            });

            const interviewTipsPromise = generateInterviewTips(resume, jobDescription).then(text => {
                contentUpdater('interviewTips', text);
                setLoadingStates(prev => ({ ...prev, interviewTips: false }));
            });
            
            await Promise.all([resumePromise, coverLetterPromise, interviewTipsPromise]);

        } catch (err) {
            console.error(err);
            setError("An error occurred while generating content. Please check your API key and try again.");
            setLoadingStates({ resume: false, coverLetter: false, interviewTips: false });
        }
    }, [resume, jobDescription]);
    
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
            <Header />
            <main className="container mx-auto p-4 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                        <InputSection
                            resume={resume}
                            setResume={setResume}
                            jobDescription={jobDescription}
                            setJobDescription={setJobDescription}
                            onGenerate={handleGenerate}
                            isGenerating={isGenerating}
                        />
                    </div>
                    <div className="lg:col-span-8">
                        <OutputSection
                            generatedContent={generatedContent}
                            setGeneratedContent={setGeneratedContent}
                            loadingStates={loadingStates}
                            error={error}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
