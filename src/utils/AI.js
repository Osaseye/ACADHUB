import { app } from '../config/firebase';
import { getAI, VertexAIBackend, getGenerativeModel } from 'firebase/ai';

// Initialize Firebase AI with Vertex Backend
const ai = getAI(app, { backend: new VertexAIBackend() });

// Use Gemini 2.5 Pro as the core model for deep analytical tasks
const model = getGenerativeModel(ai, { 
    model: 'gemini-2.5-pro',
    systemInstruction: `You are an expert academic advisor and research analyst.
Your objective is to provide high-quality, structured, and deeply analytical insights on academic project abstracts.

When analyzing an abstract, always provide your response in the following structured format using Markdown:
1. **Core Problem & Solution:** A concise summary of the theoretical or practical problem identified by the author and their proposed approach or methodology.
2. **Key Themes & Technologies:** The major academic concepts, domains, and tools utilized in the research.
3. **Potential Impact & Future Applications:** The significance, feasibility, and real-world application of the research, as well as any future implications.

Maintain a scholarly, constructive, objective, and professional tone. Avoid overly verbose explanations—be direct and impactful.`
});

/**
 * Call Gemini 2.5 Pro to generate insights for an academic project.
 * @param {string} title The title of the project
 * @param {string} abstract The abstract or description of the project
 * @returns {Promise<string>} Markdown formatted insights
 */
export const generateAcademicInsight = async (title, abstract) => {
    if (!title && !abstract) throw new Error("Missing project details");
    
    const prompt = `Please analyze the following academic project:\n\n**Title:** ${title}\n**Abstract:** ${abstract}`;
    const result = await model.generateContent(prompt);
    
    return result.response.text();
};
