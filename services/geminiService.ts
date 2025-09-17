import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

const generateContent = async (systemInstruction: string, userPrompt: string): Promise<string> => {
    // Add a global instruction to output clean HTML to every prompt.
    
    
    // const htmlSystemInstruction = `
    //     ${systemInstruction}

    //     ---
    //     FORMATTING INSTRUCTIONS:
    //     - Output the entire response directly as clean HTML, with CSS inside the tags directly.
    //     - Adjust the style to the document purpose (e.g: justify a letter) while focusing professional audience. 
    //     - Do not include color in the <div> style attributes.
    //     - Use <h3> for section titles/headers.
    //     - Use <ul> for bulleted lists and <li> for each list item.
    //     - Use <p> for paragraphs. 
    //     - For any empty lines or deliberate line breaks, you MUST use a break tag: <br>. This is crucial for preserving document structure.
    //     - Structure the content by seperating blocks, paragraphs and other areas with <br>.
    //     - Use <em> for italic text for emphasis.
    //     - Use <strong> for bold text for emphasis.
    //     - Do not include <html>, <head>, or <body> tags.
    //     - Do not wrap the output in markdown code blocks like \`\`\`html.
    //     - Use the language of the job description for output unless it specifies a target language.
    // `;

    const htmlSystemInstruction = `
        ${systemInstruction}

        ---
        FORMATTING INSTRUCTIONS:
        **CONTEXT & AUDIENCE:** 
        The formatted output is for a professional business audience. The style should be clean, legible, and appropriate for a corporate environment.
        The generated document should help candidates to be successful in their job application process.

        **HTML & CSS SPECIFICS:**
        1.  **Output Format:** Output **only** the raw HTML code with CSS included *inside* included tags. Do **not** include '<html>', '<style>', '<head>', or '<body>' tags.
        2.  **Styling:** 
            - The design must be professional and minimalist. **Do not use color** in the main '<div>' style attributes. Rely on spacing, font weights, and margins for hierarchy.
            - Ensure the text is justified for a formal appearance, unless the content type (e.g., code blocks) makes it unsuitable.
        3.  **Semantic Structure:**
            - Use '<h3>' for all section titles and headers.
            - Use '<p>' for paragraphs.
            - Use '<ul>' with '<li>' for bulleted lists.
            - Use '<ol>' with '<li>' for numbered/ordered lists.
            - Use '<em>' for italicized emphasis and '<strong>' for bold emphasis.
        4.  **Spacing & Layout:**
            - To separate content blocks (e.g., between paragraphs, after headers), use margin and padding CSS properties. **Do not use '<br>' for structural spacing.**
            - The '<br>' tag should **only** be used to force a line break *within* a block element (like '<p>') where the line break is part of the content's meaning (e.g., in an address or poem).
        5.  **Language:** Use the same language as the provided input content.`
        ;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: userPrompt,
            config: {
                systemInstruction: htmlSystemInstruction,
            }
        });
        // The response text is now expected to be HTML.
        return response.text;
    } catch (error) {
        console.error("Error generating content:", error);
        throw new Error("Failed to generate content from Gemini API.");
    }
};

export const generateTailoredResume = async (resume: string, jobDescription: string): Promise<string> => {
    const systemInstruction = `You are a professional resume writer and career coach.
Based on the provided resume and job description, rewrite the resume to powerfully highlight the most relevant skills, experiences, and achievements for the job.
Focus on using action verbs and quantifiable results that align with the job requirements. Maintain a professional tone and format.
Output only the rewritten resume text. Do not include any introductory phrases like "Here is the tailored resume:".`;
    
    const userPrompt = `
        ---
        JOB DESCRIPTION:
        ${jobDescription}
        ---
        ORIGINAL RESUME:
        ${resume}
        ---
    `;
    return generateContent(systemInstruction, userPrompt);
};

export const generateCoverLetter = async (resume: string, jobDescription:string): Promise<string> => {
    const systemInstruction = `You are an expert career coach and writer.
Based on the provided resume and job description, write a compelling, professional, and personalized cover letter.
The cover letter should:
1. Start with a strong opening that grabs the reader's attention.
2. Highlight 2-3 key experiences or skills from the resume that directly match the most important requirements in the job description.
3. Reflect genuine enthusiasm for the role and the company.
4. Conclude with a clear call to action.
Address it to the "Hiring Manager". The tone should be confident and professional.
Output only the cover letter text. Do not add any extra commentary.`;

    const userPrompt = `
        ---
        JOB DESCRIPTION:
        ${jobDescription}
        ---
        CANDIDATE'S RESUME:
        ${resume}
        ---
    `;
    return generateContent(systemInstruction, userPrompt);
};

export const generateInterviewTips = async (resume: string, jobDescription: string): Promise<string> => {
    const systemInstruction = `You are a senior hiring manager and an expert interview coach.
Based on the provided resume and job description, generate a concise and actionable list of interview preparation tips.
Do not include color in the HTML style attributes.
The output should include the following sections:

1. Likely Interview Questions
List 5-7 potential interview questions tailored to this specific role and the candidate's background. For each question, provide a brief, strategic tip on how to best answer it using bullet points.

2. Key Talking Points
Identify 3-4 key skills or experiences from the candidate's resume that they absolutely must emphasize during the interview, using bullet points.

3. Questions to Ask the Interviewer
Provide 3-4 insightful questions the candidate should ask to demonstrate their interest and intelligence, using bullet points.

Output only the interview preparation tips. Do not add any extra commentary.`;
    
    const userPrompt = `
        ---
        JOB DESCRIPTION:
        ${jobDescription}
        ---
        CANDIDATE'S RESUME:
        ${resume}
        ---
    `;
    return generateContent(systemInstruction, userPrompt);
};