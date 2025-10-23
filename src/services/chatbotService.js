// src/services/chatbotService.js
import Together from 'together-ai';
import { loadCulturalData, searchCulturalFacts } from '../data/loadCulturalData';

const together = new Together({ 
  apiKey: process.env.REACT_APP_TOGETHER_API_KEY 
});

let culturalFacts = [];

// Load data once when service initializes
export async function initializeChatbot() {
  if (culturalFacts.length === 0) {
    culturalFacts = await loadCulturalData();
  }
  return culturalFacts.length > 0;
}

export async function getChatbotResponse(userMessage, conversationHistory = []) {
  // Ensure data is loaded
  if (culturalFacts.length === 0) {
    await initializeChatbot();
  }

  // STEP 1: Search for relevant cultural facts (RAG Retrieval)
  const relevantFacts = searchCulturalFacts(userMessage, culturalFacts, 3);
  
  // STEP 2: Build context from retrieved facts
  const context = relevantFacts.length > 0
    ? relevantFacts.map(fact => `${fact.title}\n${fact.content}`).join('\n\n')
    : '';
  
  // STEP 3: Create system prompt with context
  const systemPrompt = `You are a knowledgeable and friendly assistant about Kenyan culture and traditions. 
You help people learn about Kenya's diverse tribes including Kikuyu, Maasai, Luo, Luhya, Kalenjin, Kamba, Kisii, Meru, and others.

${context ? `Use the following verified information to answer the question:\n\n${context}\n\n` : ''}

Guidelines:
- Be warm, friendly, and culturally respectful
- Provide accurate information based on the context provided
- If you don't know something, admit it honestly
- Keep responses concise but informative (2-3 paragraphs max)
- Encourage cultural appreciation and respect
- Use simple, clear language`;

  // STEP 4: Build conversation messages
  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.slice(-6), // Keep last 3 exchanges for context
    { role: "user", content: userMessage }
  ];
  
  try {
    // STEP 5: Get response from Qwen via Together AI
    const response = await together.chat.completions.create({
      model: "Qwen/Qwen2.5-7B-Instruct-Turbo",
      messages: messages,
      max_tokens: 400,
      temperature: 0.7,
      top_p: 0.9,
    });
    
    return {
      message: response.choices[0].message.content,
      sources: relevantFacts.map(fact => fact.title),
      sourcesCount: relevantFacts.length
    };
    
  } catch (error) {
    console.error('Chatbot error:', error);
    throw new Error('Failed to get response. Please try again.');
  }
}