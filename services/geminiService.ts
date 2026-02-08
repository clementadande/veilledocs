
import { GoogleGenAI, Type } from "@google/genai";
import { ResearchProject } from "../types";

export const getResearchStrategy = async (topic: string, description: string, location?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const locContext = location ? `Le périmètre géographique cible est : ${location}.` : "Le périmètre est mondial.";

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `En tant qu'expert en méthodologie de recherche, élabore une stratégie de veille exhaustive.
    Titre : "${topic}"
    Description : "${description}"
    ${locContext}
    
    Fournis des conseils sur la manière de surveiller ce sujet spécifiquement dans cette zone ou à cette échelle.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          advice: {
            type: Type.STRING,
            description: "Analyse méthodologique et conseils stratégiques."
          },
          suggestedKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Mots-clés précis et requêtes booléennes recommandées."
          },
          suggestedSources: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Bases de données, revues, et experts à suivre."
          }
        },
        required: ["advice", "suggestedKeywords", "suggestedSources"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const fetchLatestResearchTrends = async (project: Partial<ResearchProject> & { name: string; keywords: string[] }) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const locPrompt = project.location ? ` en mettant l'accent sur la région/pays : ${project.location}` : "";
  
  const prompt = `Agis comme un analyste de veille documentaire expert. Rédige un rapport structuré et approfondi concernant : "${project.name}"${locPrompt}.

IMPORTANT : Pour chaque information, donnée ou citation, tu DOIS inclure la source directement dans le texte en utilisant le format Markdown [Nom de la Source](URL). Ne te contente pas de lister les sources à la fin, intègre-les au fil de ta rédaction.

Structure du rapport :
1. Introduction (Contexte actuel)
2. Développements majeurs et actualités récentes (Citer précisément les sources pour chaque point)
3. Analyse des impacts et tendances émergentes
4. Conclusion et recommandations de veille

Formatage :
- Titres avec ## et ###
- Listes à puces pour la clarté
- Liens Markdown [Titre](URL) obligatoires pour chaque fait cité
- Gras pour les termes clés

Sujet : ${project.name}
Contexte : ${project.description || 'Veille stratégique'}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    content: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web).filter(s => s) || []
  };
};
