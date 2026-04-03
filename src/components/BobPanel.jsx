import React, { useState } from 'react';
import { 
  Button, 
  TextInput,
  Accordion,
  AccordionItem
} from '@carbon/react';
import { Chat, Close } from '@carbon/icons-react';
import './BobPanel.css';

const BobPanel = ({ messages = [], context = 'dashboard', isOpen = true, onToggle }) => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleAskBob = () => {
    if (question.trim()) {
      setChatHistory([...chatHistory, { type: 'user', text: question }]);
      // Simulate Bob's response
      setTimeout(() => {
        setChatHistory(prev => [...prev, { 
          type: 'bob', 
          text: "I'm here to help! In a full implementation, I would provide context-specific answers to your questions." 
        }]);
      }, 500);
      setQuestion('');
    }
  };

  if (!isOpen) {
    return (
      <button className="bob-toggle-closed" onClick={onToggle}>
        <Chat size={24} />
        <span>Ask Bob</span>
      </button>
    );
  }

  return (
    <div className="bob-panel">
      <div className="bob-header">
        <div className="bob-icon">B</div>
        <h3>Bob - Your Migration Assistant</h3>
        <Button 
          kind="ghost" 
          size="sm" 
          hasIconOnly 
          iconDescription="Close"
          onClick={onToggle}
        >
          <Close size={20} />
        </Button>
      </div>

      <div className="bob-content">
        <div className="bob-messages">
          {messages.map((message, index) => (
            <div key={index} className="bob-message">
              <p>{message}</p>
            </div>
          ))}
        </div>

        {chatHistory.length > 0 && (
          <div className="bob-chat-history">
            <Accordion>
              <AccordionItem title="Chat History">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`chat-message ${chat.type}`}>
                    <strong>{chat.type === 'user' ? 'You' : 'Bob'}:</strong>
                    <p>{chat.text}</p>
                  </div>
                ))}
              </AccordionItem>
            </Accordion>
          </div>
        )}

        <div className="bob-input">
          <TextInput
            id="bob-question"
            labelText=""
            placeholder="Ask Bob a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAskBob()}
          />
          <Button 
            size="sm" 
            onClick={handleAskBob}
            disabled={!question.trim()}
          >
            Ask
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BobPanel;

// Made with Bob
