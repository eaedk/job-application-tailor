
export interface GeneratedContent {
    resume: string;
    coverLetter: string;
    interviewTips: string;
}

export type ActiveTab = keyof GeneratedContent;
