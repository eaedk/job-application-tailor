// import React, { useRef, useEffect, useState, useCallback } from 'react';

// interface RichTextEditorProps {
//     value: string;
//     onChange: (value: string) => void;
//     placeholder: string;
// }

// const EditorButton: React.FC<{
//     onMouseDown: (e: React.MouseEvent) => void;
//     children: React.ReactNode;
//     'aria-label': string;
//     isActive?: boolean;
// }> = (props) => (
//     <button
//         type="button"
//         onMouseDown={props.onMouseDown}
//         aria-label={props['aria-label']}
//         className={`p-2 h-9 w-9 flex items-center justify-center rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${props.isActive ? 'bg-slate-200 dark:bg-slate-600' : ''}`}
//     >
//         {props.children}
//     </button>
// );

// const LinkIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//         <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//     </svg>
// );

// export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
//     const editorRef = useRef<HTMLDivElement>(null);
//     const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual');
//     const [activeFormats, setActiveFormats] = useState({
//         bold: false,
//         italic: false,
//         underline: false,
//         unorderedList: false,
//         orderedList: false,
//     });

//     useEffect(() => {
//         const editor = editorRef.current;
//         if (editor && value !== editor.innerHTML && editorMode === 'visual') {
//             editor.innerHTML = value;
//         }
//     }, [value, editorMode]);

//     const updateToolbarState = useCallback(() => {
//         setActiveFormats({
//             bold: document.queryCommandState('bold'),
//             italic: document.queryCommandState('italic'),
//             underline: document.queryCommandState('underline'),
//             unorderedList: document.queryCommandState('insertUnorderedList'),
//             orderedList: document.queryCommandState('insertOrderedList'),
//         });
//     }, []);

//     useEffect(() => {
//         const editor = editorRef.current;
//         const handleSelection = () => {
//             if (document.activeElement === editor) {
//                 updateToolbarState();
//             }
//         };
//         document.addEventListener('selectionchange', handleSelection);
//         editor?.addEventListener('focus', updateToolbarState);
//         editor?.addEventListener('click', updateToolbarState);
//         editor?.addEventListener('keyup', updateToolbarState);

//         return () => {
//             document.removeEventListener('selectionchange', handleSelection);
//             editor?.removeEventListener('focus', updateToolbarState);
//             editor?.removeEventListener('click', updateToolbarState);
//             editor?.removeEventListener('keyup', updateToolbarState);
//         };
//     }, [updateToolbarState]);

//     const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
//         onChange(e.currentTarget.innerHTML);
//     };

//     const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//         onChange(e.target.value);
//     };

//     const execCmd = (command: string, value: string | null = null) => {
//         document.execCommand(command, false, value);
//         const editor = editorRef.current;
//         if (editor) {
//             onChange(editor.innerHTML); // Sync state after command
//             editor.focus();
//             updateToolbarState();
//         }
//     };
    
//     const handleLink = (e: React.MouseEvent) => {
//         e.preventDefault();
//         const selection = window.getSelection();
//         if (!selection || selection.rangeCount === 0 || selection.getRangeAt(0).collapsed) {
//             alert('Please select the text you want to turn into a link.');
//             editorRef.current?.focus();
//             return;
//         }
//         const url = prompt('Enter the URL:', 'https://');
//         if (url) {
//             execCmd('createLink', url);
//         }
//         editorRef.current?.focus();
//     };

//     return (
//         <div className="border border-slate-300 dark:border-slate-600 rounded-md h-full flex flex-col">
//             <div className="toolbar flex justify-between items-center p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-t-md">
//                 <div className="flex items-center space-x-1">
//                     <EditorButton onMouseDown={(e) => { e.preventDefault(); execCmd('bold'); }} aria-label="Bold" isActive={activeFormats.bold}>
//                         <strong className="font-sans">B</strong>
//                     </EditorButton>
//                     <EditorButton onMouseDown={(e) => { e.preventDefault(); execCmd('italic'); }} aria-label="Italic" isActive={activeFormats.italic}>
//                         <em className="font-sans">I</em>
//                     </EditorButton>
//                     <EditorButton onMouseDown={(e) => { e.preventDefault(); execCmd('underline'); }} aria-label="Underline" isActive={activeFormats.underline}>
//                         <u className="font-sans">U</u>
//                     </EditorButton>
//                     <EditorButton onMouseDown={(e) => { e.preventDefault(); execCmd('insertUnorderedList'); }} aria-label="Bulleted List" isActive={activeFormats.unorderedList}>
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
//                     </EditorButton>
//                     <EditorButton onMouseDown={(e) => { e.preventDefault(); execCmd('insertOrderedList'); }} aria-label="Numbered List" isActive={activeFormats.orderedList}>
//                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path><text x="1" y="7.5" fontSize="8" fill="currentColor">1.</text><text x="1" y="13.5" fontSize="8" fill="currentColor">2.</text><text x="1" y="19.5" fontSize="8" fill="currentColor">3.</text></svg>
//                     </EditorButton>
//                     <EditorButton onMouseDown={handleLink} aria-label="Add link">
//                         <LinkIcon />
//                     </EditorButton>
//                 </div>
//                 <EditorButton
//                     onMouseDown={(e) => {
//                         e.preventDefault();
//                         setEditorMode(prev => prev === 'visual' ? 'html' : 'visual');
//                     }}
//                     aria-label="Toggle HTML source"
//                     isActive={editorMode === 'html'}
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
//                     </svg>
//                 </EditorButton>
//             </div>
//             {editorMode === 'visual' ? (
//                 <div
//                     id="pdf-content-source"
//                     ref={editorRef}
//                     onInput={handleInput}
//                     contentEditable={true}
//                     suppressContentEditableWarning={true}
//                     className="content-display p-4 flex-grow w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-700 focus:outline-none rounded-b-md prose dark:prose-invert prose-sm max-w-none [&[data-placeholder]]:empty:before:content-[attr(data-placeholder)] [&[data-placeholder]]:empty:before:text-slate-400 dark:[&[data-placeholder]]:empty:before:text-slate-500 [&[data-placeholder]]:empty:before:pointer-events-none"
//                     data-placeholder={placeholder}
//                 />
//             ) : (
//                 <textarea
//                     value={value}
//                     onChange={handleTextareaChange}
//                     placeholder="Enter HTML here..."
//                     className="p-4 flex-grow w-full overflow-y-auto bg-slate-50 dark:bg-slate-700 focus:outline-none rounded-b-md font-mono text-sm border-0 resize-none"
//                     aria-label="HTML source editor"
//                 />
//             )}
//         </div>
//     );
// };

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

const EditorButton: React.FC<{
    onMouseDown: (e: React.MouseEvent) => void;
    children: React.ReactNode;
    'aria-label': string;
    isActive?: boolean;
    disabled?: boolean;
}> = (props) => (
    <button
        type="button"
        onMouseDown={props.onMouseDown}
        aria-label={props['aria-label']}
        disabled={props.disabled}
        className={`p-2 h-9 w-9 flex items-center justify-center rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${props.isActive ? 'bg-slate-200 dark:bg-slate-600' : ''} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {props.children}
    </button>
);

const DropdownButton: React.FC<{
    options: { value: string; label: string }[];
    onSelect: (value: string) => void;
    'aria-label': string;
    defaultValue?: string;
    icon?: React.ReactNode;
}> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                }}
                aria-label={props['aria-label']}
                className="p-2 h-9 flex items-center justify-center rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                {props.icon || props.options.find(opt => opt.value === props.defaultValue)?.label || 'Options'}
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute z-10 mt-1 w-40 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5"
                >
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        {props.options.map((option) => (
                            <button
                                key={option.value}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    props.onSelect(option.value);
                                    setIsOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                role="menuitem"
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const UndoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const RedoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

const ClearFormattingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V3a2 2 0 00-2-2H7a2 2 0 00-2 2v18m14 0h2m-2 0h-4m-6 0H5m2 0h4M9 7h6m-6 4h6m-6 4h6" />
    </svg>
);

const TextColorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
);

const AlignLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M3 18h18M3 6h18" />
    </svg>
);

const AlignCenterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

const AlignRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M3 18h18M3 6h18" />
    </svg>
);

const QuoteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
);

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual');
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
        unorderedList: false,
        orderedList: false,
        formatBlock: 'p',
        justifyLeft: false,
        justifyCenter: false,
        justifyRight: false,
        foreColor: '#000000'
    });
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    useEffect(() => {
        const editor = editorRef.current;
        if (editor && value !== editor.innerHTML && editorMode === 'visual') {
            editor.innerHTML = value;
        }
    }, [value, editorMode]);

    const updateToolbarState = useCallback(() => {
        setActiveFormats({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            unorderedList: document.queryCommandState('insertUnorderedList'),
            orderedList: document.queryCommandState('insertOrderedList'),
            formatBlock: document.queryCommandValue('formatBlock'),
            justifyLeft: document.queryCommandState('justifyLeft'),
            justifyCenter: document.queryCommandState('justifyCenter'),
            justifyRight: document.queryCommandState('justifyRight'),
            foreColor: document.queryCommandValue('foreColor') || '#000000'
        });
    }, []);

    useEffect(() => {
        const editor = editorRef.current;
        const handleSelection = () => {
            if (document.activeElement === editor) {
                updateToolbarState();
            }
        };
        document.addEventListener('selectionchange', handleSelection);
        editor?.addEventListener('focus', updateToolbarState);
        editor?.addEventListener('click', updateToolbarState);
        editor?.addEventListener('keyup', updateToolbarState);

        return () => {
            document.removeEventListener('selectionchange', handleSelection);
            editor?.removeEventListener('focus', updateToolbarState);
            editor?.removeEventListener('click', updateToolbarState);
            editor?.removeEventListener('keyup', updateToolbarState);
        };
    }, [updateToolbarState]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const newValue = e.currentTarget.innerHTML;
        onChange(newValue);
        
        // Update history
        if (history[historyIndex] !== newValue) {
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(newValue);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const execCmd = (command: string, value: string | null = null) => {
        document.execCommand(command, false, value);
        const editor = editorRef.current;
        if (editor) {
            const newValue = editor.innerHTML;
            onChange(newValue);
            
            // Update history
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(newValue);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
            
            editor.focus();
            updateToolbarState();
        }
    };

    const handleLink = (e: React.MouseEvent) => {
        e.preventDefault();
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.getRangeAt(0).collapsed) {
            alert('Please select the text you want to turn into a link.');
            editorRef.current?.focus();
            return;
        }
        const url = prompt('Enter the URL:', 'https://');
        if (url) {
            execCmd('createLink', url);
        }
        editorRef.current?.focus();
    };

    const handleUndo = (e: React.MouseEvent) => {
        e.preventDefault();
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            onChange(history[newIndex]);
            if (editorRef.current) {
                editorRef.current.innerHTML = history[newIndex];
            }
        }
    };

    const handleRedo = (e: React.MouseEvent) => {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            onChange(history[newIndex]);
            if (editorRef.current) {
                editorRef.current.innerHTML = history[newIndex];
            }
        }
    };

    const handleClearFormatting = (e: React.MouseEvent) => {
        e.preventDefault();
        execCmd('removeFormat');
        execCmd('unlink');
    };

    const handleHeadingChange = (value: string) => {
        execCmd('formatBlock', value);
    };

    const handleAlignmentChange = (value: string) => {
        execCmd(value);
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        execCmd('styleWithCSS', 'true');
        execCmd('foreColor', e.target.value);
    };
    

    return (
        <div className="border border-slate-300 dark:border-slate-600 rounded-md h-full flex flex-col">
            <div className="toolbar flex flex-wrap justify-between items-center p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-t-md">
                <div className="flex items-center space-x-1 flex-wrap">
                    <div className="flex items-center space-x-1 mr-2">
                        <EditorButton 
                            onMouseDown={handleUndo} 
                            aria-label="Undo" 
                            disabled={historyIndex <= 0}
                        >
                            <UndoIcon />
                        </EditorButton>
                        <EditorButton 
                            onMouseDown={handleRedo} 
                            aria-label="Redo" 
                            disabled={historyIndex >= history.length - 1}
                        >
                            <RedoIcon />
                        </EditorButton>
                    </div>

                    <DropdownButton
                        options={[
                            { value: '<p>', label: 'Paragraph' },
                            { value: '<h1>', label: 'Heading 1' },
                            { value: '<h2>', label: 'Heading 2' },
                            { value: '<h3>', label: 'Heading 3' },
                            { value: '<h4>', label: 'Heading 4' },
                            { value: '<h5>', label: 'Heading 5' },
                            { value: '<h6>', label: 'Heading 6' },
                            { value: '<pre>', label: 'Preformatted' }
                        ]}
                        onSelect={handleHeadingChange}
                        aria-label="Text format"
                        defaultValue={activeFormats.formatBlock}
                    />

                    <EditorButton onMouseDown={(e) => { e.preventDefault(); execCmd('bold'); }} aria-label="Bold" isActive={activeFormats.bold}>
                        <strong className="font-sans">B</strong>
                    </EditorButton>
                    <EditorButton onMouseDown={(e) => { e.preventDefault(); execCmd('italic'); }} aria-label="Italic" isActive={activeFormats.italic}>
                        <em className="font-sans">I</em>
                    </EditorButton>
                    <EditorButton onMouseDown={(e) => { e.preventDefault(); execCmd('underline'); }} aria-label="Underline" isActive={activeFormats.underline}>
                        <u className="font-sans">U</u>
                    </EditorButton>

                    <div className="relative group">
                        <EditorButton 
                            onMouseDown={(e) => { e.preventDefault(); }} 
                            aria-label="Text color"
                        >
                            <TextColorIcon />
                        </EditorButton>
                        <div className="absolute z-10 mt-1 p-2 bg-white dark:bg-slate-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <input 
                                type="color" 
                                value={activeFormats.foreColor} 
                                onChange={handleColorChange}
                                className="w-8 h-8 cursor-pointer" 
                            />
                        </div>
                    </div>

                    <EditorButton onMouseDown={(e) => { e.preventDefault(); execCmd('insertUnorderedList'); }} aria-label="Bulleted List" isActive={activeFormats.unorderedList}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                    </EditorButton>
                    <EditorButton onMouseDown={(e) => { e.preventDefault(); execCmd('insertOrderedList'); }} aria-label="Numbered List" isActive={activeFormats.orderedList}>
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path><text x="1" y="7.5" fontSize="8" fill="currentColor">1.</text><text x="1" y="13.5" fontSize="8" fill="currentColor">2.</text><text x="1" y="19.5" fontSize="8" fill="currentColor">3.</text></svg>
                    </EditorButton>

                    <div className="flex items-center space-x-1 mx-2">
                        <EditorButton onMouseDown={(e) => { e.preventDefault(); execCmd('justifyLeft'); }} aria-label="Align left" isActive={activeFormats.justifyLeft}>
                            <AlignLeftIcon />
                        </EditorButton>
                        <EditorButton onMouseDown={(e) => { e.preventDefault(); execCmd('justifyCenter'); }} aria-label="Align center" isActive={activeFormats.justifyCenter}>
                            <AlignCenterIcon />
                        </EditorButton>
                        <EditorButton onMouseDown={(e) => { e.preventDefault(); execCmd('justifyRight'); }} aria-label="Align right" isActive={activeFormats.justifyRight}>
                            <AlignRightIcon />
                        </EditorButton>
                    </div>

                    <EditorButton onMouseDown={(e) => { e.preventDefault(); execCmd('formatBlock', '<blockquote>'); }} aria-label="Blockquote">
                        <QuoteIcon />
                    </EditorButton>

                    <EditorButton onMouseDown={handleLink} aria-label="Add link">
                        <LinkIcon />
                    </EditorButton>

                    <EditorButton onMouseDown={handleClearFormatting} aria-label="Clear formatting">
                        <ClearFormattingIcon />
                    </EditorButton>
                </div>
                <EditorButton
                    onMouseDown={(e) => {
                        e.preventDefault();
                        setEditorMode(prev => prev === 'visual' ? 'html' : 'visual');
                    }}
                    aria-label="Toggle HTML source"
                    isActive={editorMode === 'html'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                </EditorButton>
            </div>
            {editorMode === 'visual' ? (
                <div
                    id="pdf-content-source"
                    ref={editorRef}
                    onInput={handleInput}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    // className="content-display p-4 flex-grow w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-700 focus:outline-none rounded-b-md prose dark:prose-invert prose-sm max-w-none [&[data-placeholder]]:empty:before:content-[attr(data-placeholder)] [&[data-placeholder]]:empty:before:text-slate-400 dark:[&[data-placeholder]]:empty:before:text-slate-500 [&[data-placeholder]]:empty:before:pointer-events-none"
                    // className="content-display p-4 flex-grow w-full h-full overflow-y-auto bg-slate-800 dark:bg-slate-900 focus:outline-none rounded-b-md max-w-none text-white [&[data-placeholder]]:empty:before:content-[attr(data-placeholder)] [&[data-placeholder]]:empty:before:text-slate-400 [&[data-placeholder]]:empty:before:pointer-events-none"
                    className="content-display p-4 flex-grow w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-700 focus:outline-none rounded-b-md prose dark:prose-invert prose-sm max-w-none [&[data-placeholder]]:empty:before:content-[attr(data-placeholder)] [&[data-placeholder]]:empty:before:text-slate-400 dark:[&[data-placeholder]]:empty:before:text-slate-500 [&[data-placeholder]]:empty:before:pointer-events-none"
                    data-placeholder={placeholder}
                />

            ) : (
                <textarea
                    value={value}
                    onChange={handleTextareaChange}
                    placeholder="Enter HTML here..."
                    // className="p-4 flex-grow w-full overflow-y-auto bg-slate-50 dark:bg-slate-700 focus:outline-none rounded-b-md font-mono text-sm border-0 resize-none"
                    className="p-4 flex-grow w-full overflow-y-auto bg-slate-800 dark:bg-slate-900 focus:outline-none rounded-b-md font-mono text-sm border-0 resize-none text-white"
                    aria-label="HTML source editor"
                />
            )}
        </div>
    );
};