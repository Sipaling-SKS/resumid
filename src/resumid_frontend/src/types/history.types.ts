export type CategoryScore = {
  score: number;
  label: string;
};

export type SectionAnalysisData = {
  strengths: string[];
  weaknesses: string[];
  pointers: string[];
  feedback: {
    message: string;
    example?: string;
  }[];
};

export type HistoryDetailData = {
  historyId: string;
  fileName: string;
  jobTitle: string;
  createdAt: string;
  userId: string;
  content: {
    title: string;
    value: {
      score: number;
      strength: string;
      weaknesess: string;
      pointer: string[];
      feedback: {
        feedback_message: string;
        revision_example: string;
      }[];
    };
  }[];
  summary: {
    score: number;
    value: string;
  };
  conclusion: {
    career_recomendation: string[];
    keyword_matching: string[];
    section_to_add: string[];
    section_to_remove: string[];
  };
};

export type ThumbnailData = {
  id: string;
  filename: string;
  jobTitle: string;
  score: number;
  date: string;
  summary: string;
  keywordMatching: string[];
};

export type TransformedData = {
  categories: Record<string, CategoryScore>;
  sections: Record<string, SectionAnalysisData>;
};

// Backend types
export type { HistoryOutput, HistoryIdInput } from "../../../declarations/resumid_backend/resumid_backend.did";