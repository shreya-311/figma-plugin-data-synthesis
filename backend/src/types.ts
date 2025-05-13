export interface ThemeData {
  name: string;
  frequency: number;
  quotes: string[];
}

export interface AnalysisRequest {
  text: string;
}

export interface AnalysisResponse {
  themes: ThemeData[];
  error?: string;
} 