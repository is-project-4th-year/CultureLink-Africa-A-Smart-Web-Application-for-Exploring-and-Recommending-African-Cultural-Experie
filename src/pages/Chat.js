// src/pages/Chat.js
import React, { useState, useEffect } from 'react';
import { testTogetherAI } from '../services/testChat';

const Chat = () => {
  const [testResult, setTestResult] = useState('');

  // Test Together AI when component loads
  useEffect(() => {
    const runTest = async () => {
      const result = await testTogetherAI();
      setTestResult(result);
    };
    runTest();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Chat Page</h1>
      <p>Testing Together AI...</p>
      {testResult && (
        <div style={{ 
          background: '#f0f0f0', 
          padding: '15px', 
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <strong>Qwen Response:</strong>
          <p>{testResult}</p>
        </div>
      )}
    </div>
  );
};

export default Chat;