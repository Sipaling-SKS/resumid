import type { 
  HistoryOutput, 
  HistoryDetailData, 
  CategoryScore, 
  SectionAnalysisData, 
  ThumbnailData,
  TransformedData 
} from "../types/history.types";

export class HistoryDataTransformer {
  /**
   * Convert backend HistoryOutput to frontend format
   */
  static convertBackendToFrontend(backendData: HistoryOutput): HistoryDetailData {
    return {
      historyId: backendData.historyId,
      fileName: backendData.fileName,
      jobTitle: backendData.jobTitle,
      createdAt: backendData.createdAt,
      userId: backendData.userId,
      content: backendData.content.map(item => ({
        title: item.title,
        value: {
          score: Number(item.value.score),
          strength: item.value.strength,
          weaknesess: item.value.weaknesess,
          pointer: item.value.pointer,
          feedback: item.value.feedback
        }
      })),
      summary: {
        score: Number(backendData.summary.score),
        value: backendData.summary.value
      },
      conclusion: backendData.conclusion
    };
  }

  /**
   * Transform data for analysis components
   */
  static transformForComponents(data: HistoryDetailData): TransformedData {
    const categories: Record<string, CategoryScore> = {};
    const sections: Record<string, SectionAnalysisData> = {};
    
    data.content.forEach((section) => {
      const key = this.generateSectionKey(section.title);
      
      categories[key] = {
        score: section.value.score,
        label: section.title
      };
      
      sections[key] = {
        strengths: section.value.strength ? [section.value.strength] : [],
        weaknesses: section.value.weaknesess ? [section.value.weaknesess] : [],
        pointers: section.value.pointer || [],
        feedback: section.value.feedback?.map(f => ({
          message: f.feedback_message,
          example: f.revision_example
        })) || []
      };
    });

    return { categories, sections };
  }

  /**
   * Transform data for thumbnail component
   */
  static transformForThumbnail(data: HistoryDetailData): ThumbnailData {
    return {
      id: data.historyId,
      filename: data.fileName,
      jobTitle: data.jobTitle,
      score: data.summary.score,
      date: data.createdAt,
      summary: data.summary.value,
      keywordMatching: data.conclusion.keyword_matching || []
    };
  }

  /**
   * Generate consistent section key from title
   */
  private static generateSectionKey(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }
}