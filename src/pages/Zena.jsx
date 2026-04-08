import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Send, User, Sparkles, Brain, ShieldCheck, RefreshCw, LogIn } from 'lucide-react';
import styles from './Zena.module.css';
import { useAuth } from '../providers/AuthProvider';
import { Button } from '../components/Button';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0 }
};

const SYSTEM_INSTRUCTION = "You are Zena, a warm, empathetic, and knowledgeable mental health AI companion. You belong to the ZenMind app. Your goal is to listen without judgment, validate the user's feelings, and provide gentle, evidence-based coping strategies if asked. You are NOT a substitute for professional therapy, and you should remind users of this if they mention self-harm or severe crises, guiding them to seek professional help. Keep your responses concise, conversational, and caring. Only use simple markdown like bold text or bullets when necessary for readability. Do not output large walls of text.";

export default function Zena() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "model",
      text: "Hi there! I'm Zena, your personal AI companion. I'm here to listen, offer support, or just chat if you need to offload. How are you feeling right now?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleInput = (e) => {
    setInput(e.target.value);
    // Auto resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const formatMessageForMarkdown = (text) => {
    // A simple formatter for basic markdown rendering in React without importing marked
    const htmlSnippet = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br />');
    return <p dangerouslySetInnerHTML={{ __html: htmlSnippet }} />;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
    
    const newUserMsg = { id: Date.now().toString(), role: "user", text: userMessage };
    const conversationHistory = [...messages, newUserMsg];
    setMessages(conversationHistory);
    setIsLoading(true);

    try {
      // Format history for Gemini API
      const historyContents = conversationHistory
        .filter(msg => msg.id !== "welcome") // Can omit welcome, but it's fine. Let's include everything
        .map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        }));

      // In case we only have user messages, just make sure we are format correctly.
      const requestBody = {
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        contents: historyContents,
        generationConfig: {
          temperature: 0.7,
        }
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API request failed: ${response.status} ${errorData}`);
      }

      const data = await response.json();
      
      const zenaResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (zenaResponseText) {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + "-ai",
          role: "model",
          text: zenaResponseText
        }]);
      } else {
        const finishReason = data?.candidates?.[0]?.finishReason;
        if (finishReason === 'SAFETY') {
          throw new Error('Our conversation touched on a topic that my safety guidelines prevent me from discussing. Let us talk about something else.');
        } else {
          throw new Error('Invalid response format or empty response from AI.');
        }
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + "-error",
        role: "model",
        text: `I'm sorry, I'm having trouble connecting right now. Details: ${error.message}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: "welcome",
      role: "model",
      text: "Chat cleared! I'm still here if you want to talk. How are you feeling?"
    }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div
      className={styles.page}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero */}
      <header className={`container ${styles.hero}`}>
        <motion.h2 initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          Talk to Zena
        </motion.h2>
        <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          Your empathetic AI companion. Available 24/7, completely private, and here to listen without judgment.
        </motion.p>
      </header>

      {/* Chat Interface */}
      <motion.div 
        className={styles.chatContainerWrapper}
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.2 }}
      >
        <div className={styles.chatContainer}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderLeft}>
              <div className={styles.chatAvatar}>
                <Sparkles size={24} />
              </div>
              <div className={styles.chatHeaderInfo}>
                <h3>Zena</h3>
                <span>AI Companion</span>
              </div>
            </div>
            <button className={styles.clearBtn} onClick={clearChat} aria-label="Clear chat">
              <RefreshCw size={16} />
              Restart
            </button>
          </div>

          {/* Messages */}
          <div className={styles.chatBody} ref={chatBodyRef}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${styles.messageWrapper} ${msg.role === 'user' ? styles.user : styles.zena}`}
              >
                <div className={styles.messageAvatar}>
                  {msg.role === 'user' ? <User size={18} /> : <Brain size={18} />}
                </div>
                <div className={styles.msgBubble}>
                  {formatMessageForMarkdown(msg.text)}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className={`${styles.messageWrapper} ${styles.zena}`}>
                <div className={styles.messageAvatar}>
                  <Brain size={18} />
                </div>
                <div className={styles.typing}>
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className={styles.chatInputWrapper}>
            {user ? (
              <>
                <textarea
                  ref={textareaRef}
                  className={styles.chatInput}
                  placeholder="Share what's on your mind..."
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <button
                  className={styles.sendBtn}
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </>
            ) : (
              <div className={styles.signInPrompt}>
                <span>Sign in to start chatting with Zena</span>
                <Button variant="primary" size="sm" onClick={() => navigate('/auth')}>
                  <LogIn size={16} style={{ marginRight: '0.5rem' }} />
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Feature Chips underneath */}
      <motion.div
        className={styles.features}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className={styles.featureChip}>
            <ShieldCheck size={16} />
            Private & Secure
        </div>

      </motion.div>
    </motion.div>
  );
}
