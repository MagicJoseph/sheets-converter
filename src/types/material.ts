export type MaterialCategory =
  | "kick_off"
  | "user_research"
  | "research_report"
  | "prototyping"
  | "competitive_analysis";

export type MaterialType =
  | "article"
  | "notebook_lm"
  | "report"
  | "figma_file"
  | "gemini_gem"
  | "figjam_board"
  | "gemini_prompt";

export interface Material {
  id: string;
  title: string;
  description: string;
  link: string;
  requiresCode: boolean;
  accessCode?: string;
  category: MaterialCategory;
  type: MaterialType;
  role: string;
}
