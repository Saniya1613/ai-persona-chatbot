import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, User, Bot, Loader2, Terminal, Cpu, Code2 } from 'lucide-react';

const PERSONAS = {
  anshuman: {
    id: 'anshuman',
    name: 'Anshuman Singh',
    role: 'Systems & Algorithms',
    icon: <Terminal size={24} />,
    colorClass: 'text-cyan-400',
    bgClass: 'bg-cyan-500/10',
    borderClass: 'border-cyan-500/50',
    glowClass: 'shadow-[0_0_15px_rgba(34,211,238,0.4)]',
    gradient: 'from-cyan-500 to-blue-600',
    suggestions: [
      "How should I design a URL shortener?",
      "Why is my recursive function throwing a stack overflow error?",
      "Explain the trade-offs of microservices vs monolith."
    ]
  },
  abhimanyu: {
    id: 'abhimanyu',
    name: 'Abhimanyu Saxena',
    role: 'Product & Startup Engineering',
    icon: <Cpu size={24} />,
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/50',
    glowClass: 'shadow-[0_0_15px_rgba(52,211,153,0.4)]',
    gradient: 'from-emerald-400 to-teal-600',
    suggestions: [
      "Should we migrate our monolith to microservices?",
      "How do I handle a fast but messy developer?",
      "What's the most important metric for a SaaS backend?"
    ]
  },
  kshitij: {
    id: 'kshitij',
    name: 'Kshitij Mishra',
    role: 'Frontend & UI/UX Expert',
    icon: <Code2 size={24} />,
    colorClass: 'text-fuchsia-400',
    bgClass: 'bg-fuchsia-500/10',
    borderClass: 'border-fuchsia-500/50',
    glowClass: 'shadow-[0_0_15px_rgba(232,121,249,0.4)]',
    gradient: 'from-fuchsia-500 to-purple-600',
    suggestions: [
      "Why does my React component re-render so many times?",
      "What's the best way to center a div?",
      "Why should I care about semantic HTML?"
    ]
  }
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/chat';

function App() {
  const [activePersona, setActivePersona] = useState('anshuman');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const activeTheme = PERSONAS[activePersona];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    setMessages([{
      role: 'bot',
      content: `System initialized. Connected to **${activeTheme.name}** module.\nReady for queries regarding ${activeTheme.role}.`
    }]);
  }, [activePersona]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(API_URL, {
        message: text,
        persona: activePersona,
        history: messages
      });

      const botMessage = { role: 'bot', content: response.data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        role: 'bot', 
        content: error.response?.data?.error || 'CRITICAL ERROR: Connection to neural network failed. Check backend server and API key status.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content) => {
    if (!content.includes('<chain_of_thought>')) {
      return <p className="whitespace-pre-wrap leading-relaxed">{content}</p>;
    }

    const parts = content.split('</chain_of_thought>');
    if (parts.length === 2) {
      const thought = parts[0].replace('<chain_of_thought>', '').trim();
      const answer = parts[1].trim();
      
      return (
        <div className="flex flex-col gap-3">
          <details className="text-xs bg-slate-950/50 p-3 rounded-lg border border-slate-700/50 shadow-inner group">
            <summary className="cursor-pointer font-mono text-slate-400 group-hover:text-slate-200 transition-colors flex items-center gap-2">
              <span className="text-blue-400">&gt;</span> [LOG_INTERNAL_PROCESS]
            </summary>
            <p className="mt-3 whitespace-pre-wrap font-mono text-slate-400 border-l-2 border-slate-700 pl-3">{thought}</p>
          </details>
          <p className="whitespace-pre-wrap leading-relaxed">{answer}</p>
        </div>
      );
    }
    return <p className="whitespace-pre-wrap">{content}</p>;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Dynamic Top Gradient Bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${activeTheme.gradient}`}></div>

      {/* Header & Persona Switcher */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          <h1 className="text-2xl font-bold tracking-tight mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">
            SCALER_AI_TERMINAL
          </h1>
          <div className="flex flex-wrap justify-center gap-3 md:gap-6">
            {Object.values(PERSONAS).map(p => (
              <button
                key={p.id}
                onClick={() => setActivePersona(p.id)}
                className={`relative flex flex-col items-center p-4 rounded-xl transition-all duration-300 overflow-hidden bg-slate-800/40 backdrop-blur-sm border ${
                  activePersona === p.id 
                    ? `${p.borderClass} ${p.bgClass} ${p.glowClass} scale-[1.02]` 
                    : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                {/* Active indicator bar inside button */}
                {activePersona === p.id && (
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${p.gradient}`}></div>
                )}
                
                <div className={`mb-2 ${activePersona === p.id ? p.colorClass : 'text-slate-400'}`}>
                  {p.icon}
                </div>
                <span className={`font-semibold text-sm md:text-base ${activePersona === p.id ? 'text-slate-100' : 'text-slate-300'}`}>
                  {p.name}
                </span>
                <span className="text-xs text-slate-500 font-mono mt-1">{p.role}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600' 
                  : `bg-gradient-to-br ${activeTheme.gradient} border border-white/20`
              }`}>
                {msg.role === 'user' ? <User size={20} className="text-slate-200" /> : <Bot size={20} className="text-white" />}
              </div>
              
              <div className={`max-w-[85%] md:max-w-[75%] p-5 rounded-2xl backdrop-blur-sm ${
                msg.role === 'user' 
                  ? 'bg-slate-800/80 border border-slate-700 text-slate-200 rounded-tr-sm' 
                  : `bg-slate-900/80 border ${activeTheme.borderClass} text-slate-300 rounded-tl-sm shadow-xl`
              }`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  formatMessage(msg.content)
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${activeTheme.gradient} border border-white/20 shadow-lg`}>
                <Bot size={20} className="text-white animate-pulse" />
              </div>
              <div className={`bg-slate-900/80 border ${activeTheme.borderClass} p-5 rounded-2xl rounded-tl-sm flex items-center gap-3 backdrop-blur-sm`}>
                <Loader2 className={`animate-spin ${activeTheme.colorClass}`} size={20} />
                <span className={`text-sm font-mono ${activeTheme.colorClass} animate-pulse`}>Processing neural link...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Suggestion Chips */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
              {activeTheme.suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(suggestion)}
                  className={`text-xs md:text-sm font-medium bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 py-2.5 px-5 rounded-full transition-all border border-slate-700 hover:${activeTheme.borderClass} hover:${activeTheme.colorClass}`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <div className={`relative flex items-end shadow-lg shadow-black/50 bg-slate-950 border border-slate-700 rounded-2xl overflow-hidden focus-within:ring-1 transition-all focus-within:ring-${activeTheme.colorClass.split('-')[1]}-500 focus-within:border-${activeTheme.colorClass.split('-')[1]}-500`}>
            <div className="pl-4 pb-4 flex items-center justify-center h-full text-slate-500">
               <span className="font-mono text-lg">&gt;</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`Enter query for ${activeTheme.name}...`}
              className="w-full max-h-32 p-4 resize-none outline-none text-slate-200 bg-transparent scrollbar-hide placeholder-slate-600 font-mono text-sm md:text-base"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className={`p-4 m-1 rounded-xl transition-all flex items-center justify-center ${
                isLoading || !input.trim() 
                  ? 'text-slate-600 bg-slate-900 cursor-not-allowed' 
                  : `bg-gradient-to-r ${activeTheme.gradient} text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95`
              }`}
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-center mt-3 flex justify-center items-center gap-2">
             <div className={`w-2 h-2 rounded-full bg-green-500 animate-pulse`}></div>
             <p className="text-xs font-mono text-slate-500 tracking-wider">
               SYSTEM ONLINE • E2E ENCRYPTION ACTIVE
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
