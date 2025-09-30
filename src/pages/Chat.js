import React, { useState } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      text: 'Karibu! Welcome to CultureLink Kenya! 🇰🇪 I\'m your Kenyan cultural guide. Ask me about traditions, foods, languages, or ceremonies from Kikuyu, Maasai, Luo, Kalenjin, or Kamba communities!' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const kenyanResponses = {
    'food': 'Kenya has incredible traditional foods! Try Kikuyu\'s Githeri (maize and beans), Maasai\'s milk and blood mixture, Luo\'s fish stew from Lake Victoria, or Kalenjin\'s Mursik (fermented milk). What specific tribe\'s cuisine interests you?',
    'greeting': 'Kenyan greetings vary by tribe! Kikuyu: "Wega" (How are you?), Maasai: "Sopa" (Hello), Luo: "Nadi?" (How are things?), Kalenjin: "Chamuge" (Hello), Kamba: "Wakwa" (Hello). Which language would you like to learn more about?',
    'ceremony': 'Kenya has rich ceremonial traditions! Maasai have Eunoto (warrior graduation), Kikuyu celebrate Ngwatio (harvest), Luo perform Tero buru (cleansing), and Kalenjin have elaborate age-set ceremonies. Which ceremony interests you most?',
    'music': 'Kenyan music is diverse! Kikuyu traditional songs accompany farming, Maasai have warrior chants, Luo are famous for Nyatiti (8-stringed instrument), Kalenjin have running songs, and Kamba excel in storytelling songs. Want to learn about a specific style?',
    'clothing': 'Traditional Kenyan attire varies by tribe! Maasai wear distinctive red shukas and beaded jewelry, Kikuyu have colorful wraps and headbands, Luo wear earth-toned fabrics, while Kalenjin and Kamba have their unique traditional styles.',
    'maasai': 'The Maasai are iconic! They\'re semi-nomadic pastoralists known for their warrior culture, cattle herding, distinctive red clothing, jumping dances, and living in manyattas (traditional houses). What aspect of Maasai culture interests you?',
    'kikuyu': 'The Kikuyu are Kenya\'s largest tribe, known for agriculture, especially coffee farming around Mount Kenya. They have rich traditions in governance, circumcision ceremonies, and are entrepreneurial. Want to know about specific Kikuyu practices?',
    'luo': 'The Luo people from Lake Victoria are known for fishing, their Nilotic heritage, oral traditions, and musical culture. They have unique burial customs and are famous for the Nyatiti instrument. What Luo tradition interests you?'
  };

  const generateResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('food') || message.includes('eat') || message.includes('dish')) {
      return kenyanResponses.food;
    } else if (message.includes('hello') || message.includes('greet') || message.includes('jambo')) {
      return kenyanResponses.greeting;
    } else if (message.includes('ceremony') || message.includes('ritual') || message.includes('tradition')) {
      return kenyanResponses.ceremony;
    } else if (message.includes('music') || message.includes('dance') || message.includes('song')) {
      return kenyanResponses.music;
    } else if (message.includes('cloth') || message.includes('dress') || message.includes('wear')) {
      return kenyanResponses.clothing;
    } else if (message.includes('maasai') || message.includes('masai')) {
      return kenyanResponses.maasai;
    } else if (message.includes('kikuyu') || message.includes('gikuyu')) {
      return kenyanResponses.kikuyu;
    } else if (message.includes('luo')) {
      return kenyanResponses.luo;
    } else if (message.includes('kalenjin')) {
      return 'The Kalenjin people from the Rift Valley are famous worldwide for producing champion runners! They have rich highland farming traditions, age-set systems, and elaborate circumcision ceremonies. They\'re also known for their honey production and traditional governance.';
    } else if (message.includes('kamba')) {
      return 'The Kamba people from Eastern Kenya are master craftsmen known for their wood carving, especially animal sculptures sold worldwide. They\'re also traditional traders, herbalists, and have rich storytelling traditions. Want to know about specific Kamba arts?';
    } else {
      return 'That\'s an interesting question about Kenyan culture! I can help you learn about tribal traditions, foods, languages, ceremonies, music, clothing, and customs from Kenya\'s major communities. Try asking about specific topics like "Maasai traditions" or "Kikuyu food" or "Luo music"!';
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      // Add user message
      const newMessage = { 
        id: Date.now(), 
        type: 'user', 
        text: inputMessage 
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(true);

      // Generate and add bot response
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          text: generateResponse(inputMessage)
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);

      setInputMessage('');
    }
  };

  const quickQuestions = [
    "What do Maasai people eat?",
    "How do you say hello in Kikuyu?",
    "Tell me about Luo fishing traditions",
    "What are Kalenjin ceremonies like?",
    "Kamba wood carving traditions"
  ];

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem', color: '#2c3e50' }}>
          Cultural Chat Assistant
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
          Ask me anything about Kenyan tribal cultures, traditions, and customs!
        </p>

        {/* Quick Questions */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Quick Questions:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(question)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '1rem',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
        
        {/* Chat Messages */}
        <div style={{ 
          border: '1px solid #ddd', 
          height: '500px', 
          overflowY: 'scroll', 
          padding: '1rem', 
          marginBottom: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem'
        }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ 
              marginBottom: '1rem',
              textAlign: msg.type === 'user' ? 'right' : 'left'
            }}>
              <div style={{
                display: 'inline-block',
                padding: '0.75rem 1rem',
                backgroundColor: msg.type === 'user' ? '#3498db' : '#ecf0f1',
                color: msg.type === 'user' ? 'white' : '#2c3e50',
                borderRadius: '1rem',
                maxWidth: '75%',
                fontSize: '0.9rem',
                lineHeight: '1.4'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
              <div style={{
                display: 'inline-block',
                padding: '0.75rem 1rem',
                backgroundColor: '#ecf0f1',
                borderRadius: '1rem',
                fontSize: '0.9rem'
              }}>
                Typing...
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about Kenyan culture, food, traditions..."
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              border: '1px solid #ddd', 
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            style={{ 
              padding: '0.75rem 2rem', 
              backgroundColor: '#e67e22', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;