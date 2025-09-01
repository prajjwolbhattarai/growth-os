

import React, { useState, useRef, useEffect } from 'react';
import { Campaign } from '../types';
import { createChatWithContext } from '../services/geminiService';
import type { Chat } from '@google/genai';

interface AIChatViewProps {
  campaigns: Campaign[];
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIChatView: React.FC<AIChatViewProps> = ({ campaigns }) => {
  const chatSession = useRef<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    try {
      chatSession.current = createChatWithContext(campaigns);
      setMessages([{
        role: 'model',
        text: "Hello! I'm the UCIH AI Assistant. How can I help you analyze your campaign data today? For example, you could ask 'Which campaign has the highest ROAS?'"
      }]);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to initialize chat.";
      setError(message);
      setMessages(prev => [...prev, {role: 'model', text: `Sorry, I couldn't start up: ${message}`}]);
    }
  }, [campaigns]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chatSession.current) return;

    const newUserMessage: Message = { role: 'user', text: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    const currentInput = userInput;
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatSession.current.sendMessage({ message: currentInput });
      const modelMessage: Message = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setMessages(prev => [...prev, {role: 'model', text: `Sorry, I ran into an error: ${errorMessage}`}]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 flex flex-col h-full bg-brand-blue-50">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Chat Assistant</h1>
      <p className="text-slate-600 mb-6">Ask natural language questions about your campaign portfolio.</p>
      
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200/75 flex flex-col overflow-hidden">
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {messages.map((msg, index) => (
            <ChatMessage key={index} role={msg.role} text={msg.text} />
          ))}
          {isLoading && <LoadingBubble />}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <form onSubmit={handleSendMessage} className="flex items-center gap-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={campaigns.length > 0 ? "Ask about your campaigns..." : "Create a campaign to start chatting."}
              className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-brand-blue-500 disabled:bg-slate-200"
              disabled={isLoading || campaigns.length === 0}
              aria-label="Chat input"
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim() || campaigns.length === 0}
              className="p-3 bg-brand-blue-600 text-white font-semibold rounded-lg hover:bg-brand-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


const ChatMessage: React.FC<{ role: 'user' | 'model', text: string }> = ({ role, text }) => {
  const isUser = role === 'user';
  
  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
          <AIIcon />
        </div>
      )}
      <div className={`max-w-2xl p-4 rounded-xl shadow-sm ${isUser ? 'bg-brand-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
};

const LoadingBubble: React.FC = () => (
    <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
            <AIIcon />
        </div>
        <div className="max-w-xl p-4 rounded-xl bg-slate-100 text-slate-800 shadow-sm">
            <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>
);


const AIIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-blue-700">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const SendIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M3.105 3.105a.75.75 0 0 1 .813-.292l13.58 4.527a.75.75 0 0 1 0 1.32l-13.58 4.527a.75.75 0 0 1-1.105-.98l1.9-5.702-1.9-5.701a.75.75 0 0 1 .292-.813Z" />
  </svg>
);

export default AIChatView;