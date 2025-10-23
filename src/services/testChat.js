// src/services/testChat.js
import Together from 'together-ai';

const together = new Together({ 
  apiKey: process.env.REACT_APP_TOGETHER_API_KEY 
});

export async function testTogetherAI() {
  try {
    console.log('Testing Together AI connection...');
    
    const response = await together.chat.completions.create({
      model: "Qwen/Qwen2.5-7B-Instruct-Turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant about Kenyan culture." 
        },
        { 
          role: "user", 
          content: "Tell me one interesting fact about Kenya in one sentence." 
        }
      ],
      max_tokens: 100,
      temperature: 0.7
    });
    
    const answer = response.choices[0].message.content;
    console.log('✅ SUCCESS! Qwen responded:', answer);
    return answer;
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    return null;
  }
}