
export interface MonitoringStep {
  id: string;
  title: string;
  description: string;
  tips: string[];
  icon: string;
}

export interface Tool {
  name: string;
  category: string;
  description: string;
  url: string;
  icon: string;
}

export interface Finding {
  id: string;
  date: string;
  content: string;
  sources: { title: string; uri: string }[];
}

export interface ResearchProject {
  id: string;
  name: string;
  description: string;
  location?: string; // Geographic scope
  keywords: string[];
  sources: string[];
  findings: Finding[];
  strategy?: string;
}

export interface AdviceResponse {
  advice: string;
  suggestedKeywords: string[];
  suggestedSources: string[];
}
