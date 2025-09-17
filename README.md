# Job Application Tailor

An AI-powered assistant to tailor your job applications. Upload your resume and a job description to generate a custom resume, a personalized cover letter, and targeted interview preparation tips. All processing is done in your browser to ensure your privacy.

<!-- ![Job Application Tailor Screenshot](https://storage.googleapis.com/aistudio-project-co-creation/78417c8a-77e8-46f0-8c2f-e8b835e396dc/app_screenshot.png) -->

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Components](#key-components)

## Overview

The Job Application Tailor is a powerful, client-side tool designed to help job seekers create customized application materials efficiently. By leveraging the Google Gemini API, it analyzes a user's resume against a specific job description to produce highly relevant and professionally written content. The key differentiator is its commitment to privacy; no personal data ever leaves the user's browser, as all API calls and document processing happen client-side.

## Features

-   **Tailored Resume Generation**: Rewrites your resume to highlight skills and experiences that directly match the job requirements.
-   **Personalized Cover Letter**: Creates a compelling, professional cover letter from scratch based on your resume and the target role.
-   **Targeted Interview Tips**: Generates a list of likely interview questions, key talking points, and insightful questions to ask the interviewer.
-   **Versatile File Uploads**: Supports parsing of `.pdf`, `.docx`, `.txt`, and `.md` files for both your resume and the job description.
-   **Rich Text Editing**: Edit and refine the generated resume and cover letter with an intuitive WYSIWYG editor.
-   **PDF Export**: Download your polished resume or cover letter as a professional-looking PDF document.
-   **Copy Formatted Text**: Easily copy the generated content to your clipboard while preserving formatting.
-   **Privacy-Focused**: All file parsing and AI generation happen directly in your browser. Your data is never sent to or stored on a server.
-   **Responsive & Dark Mode**: A clean, modern UI that works great on all devices and includes an eye-friendly dark mode.

## How It Works

1.  **Input**: The user uploads or pastes their resume content and the job description into the respective text areas.
2.  **Generate**: Upon clicking "Tailor My Application", the application makes three parallel, asynchronous calls to the Google Gemini API (`gemini-2.5-flash` model).
3.  **Prompt Engineering**: Each API call uses a carefully crafted system instruction that directs the AI to act as a specific expert (e.g., a professional resume writer, a career coach). The prompts also instruct the model to return clean, structured HTML.
4.  **Display**: As the content is generated, it populates the corresponding tabs in the output section: "Tailored Resume," "Cover Letter," and "Interview Tips."
5.  **Refine & Export**: The user can then review the generated content, make edits using the rich text editor, copy the text, or download the final document as a PDF.

## Tech Stack

-   **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
-   **AI**: [Google Gemini API](https://ai.google.dev/) via the `@google/genai` SDK
-   **File Parsing (Client-Side)**:
    -   [PDF.js](https://mozilla.github.io/pdf.js/) for `.pdf` files.
    -   [Mammoth.js](https://github.com/mwilliamson/mammoth.js) for `.docx` files.
-   **PDF Generation (Client-Side)**:
    -   [jsPDF](https://github.com/parallax/jsPDF)
    -   [html2canvas](https://html2canvas.hertzen.com/)

## Getting Started

This application is designed to run in a client-side environment where dependencies are loaded via an import map in `index.html`.

To run it locally:
1.  **API Key**: The application requires a Google Gemini API key. It is configured to be sourced from an environment variable `process.env.API_KEY`. In `services/geminiService.ts`, ensure this variable is available in the execution context.
2.  **Serve Files**: Since there is no build step, you need a simple local server to serve the `index.html` file. You can use a tool like the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for VS Code.
3.  **Open in Browser**: Once the server is running, open the provided local address (e.g., `http://127.0.0.1:5500`) in your web browser.

## Project Structure

```
/
├── components/                 # React components
│   ├── Header.tsx
│   ├── InputSection.tsx
│   ├── Loader.tsx
│   ├── OutputSection.tsx
│   ├── RichTextEditor.tsx
│   └── TabButton.tsx
├── services/                   # AI logic and API calls
│   └── geminiService.ts
├── App.tsx                     # Main application component
├── index.html                  # Entry point, loads scripts and styles
├── index.tsx                   # React root renderer
├── metadata.json               # Application metadata
└── types.ts                    # TypeScript type definitions
```

## Key Components

-   **`App.tsx`**: The root component that manages the overall application state, including user inputs, generated content, loading states, and error handling.
-   **`InputSection.tsx`**: A stateful component that provides text areas for user input and handles file uploads. It contains the logic for parsing different file formats into plain text.
-   **`OutputSection.tsx`**: The main display area for the AI-generated content. It features a tabbed navigation system and integrates the `RichTextEditor` for content modification. It also contains the logic for PDF generation and copying content.
-   **`RichTextEditor.tsx`**: A custom WYSIWYG editor built using a `contentEditable` div. It provides basic formatting options (bold, italic, lists, links) and can toggle between visual and HTML source views.
-   **`geminiService.ts`**: This module is the bridge to the Gemini API. It defines the functions (`generateTailoredResume`, `generateCoverLetter`, `generateInterviewTips`) that construct the specific system instructions and user prompts for the AI model.

# Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
