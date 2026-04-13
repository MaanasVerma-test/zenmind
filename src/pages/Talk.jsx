import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../providers/AuthProvider';
import styles from './Talk.module.css';
import {
  Headphones, ShieldCheck, Clock, Heart, Star,
  Send, X, MessageCircle, Users, Sparkles, LogIn, AlertTriangle
} from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0 }
};

const listeners = [
  {
    id: 1, name: 'Meera S.', initials: 'MS',
    tagline: 'Compassionate listener · 3 yrs experience',
    topics: ['Anxiety', 'Loneliness', 'Self-Esteem'],
    rating: 4.9, sessions: 820, online: true,
    bg: 'var(--primary-container)',
    greeting: "Hi there! I'm Meera. I'm really glad you reached out. What's been on your mind today?"
  },
  {
    id: 2, name: 'Arjun K.', initials: 'AK',
    tagline: 'Trained listener · 2 yrs experience',
    topics: ['Stress', 'Work-Life', 'Relationships'],
    rating: 4.8, sessions: 540, online: true,
    bg: 'var(--secondary-container)',
    greeting: "Hey! I'm Arjun. This is a safe space — no judgments. Tell me what's going on."
  },
  {
    id: 3, name: 'Diya R.', initials: 'DR',
    tagline: 'Peer supporter · 4 yrs experience',
    topics: ['Grief', 'Depression', 'Family Issues'],
    rating: 5.0, sessions: 1100, online: true,
    bg: 'var(--tertiary-container)',
    greeting: "Hello, I'm Diya. It takes courage to talk to someone — I'm here to listen."
  },
  {
    id: 4, name: 'Kabir M.', initials: 'KM',
    tagline: 'Active listener · 1 yr experience',
    topics: ['Student Life', 'Peer Pressure', 'Motivation'],
    rating: 4.7, sessions: 310, online: false,
    bg: 'var(--error-container)',
    greeting: "Hey! I'm Kabir. Whatever it is, you don't have to deal with it alone."
  },
  {
    id: 5, name: 'Simran J.', initials: 'SJ',
    tagline: 'Empathetic listener · 5 yrs experience',
    topics: ['Trauma', 'Healing', 'Emotional Support'],
    rating: 4.9, sessions: 1430, online: true,
    bg: 'var(--primary)',
    greeting: "Hi, I'm Simran. I'm honored you chose to talk. Let me know how you're feeling right now."
  },
  {
    id: 6, name: 'Rohan T.', initials: 'RT',
    tagline: 'Wellness advocate · 2 yrs experience',
    topics: ['Burnout', 'Anger', 'Sleep Issues'],
    rating: 4.6, sessions: 475, online: true,
    bg: 'var(--secondary)',
    greeting: "Hi there, I'm Rohan. Take a deep breath — we can figure this out together."
  },
];

const autoReplies = [
  "I hear you. That sounds really tough.",
  "Thank you for sharing that with me.",
  "It's completely okay to feel this way.",
  "You're not alone in this. I'm right here.",
  "Take your time — there's no rush at all.",
  "That must have been really hard to deal with.",
  "I appreciate you trusting me with this.",
];

export default function Talk() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(true);
  const chatBodyRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const openChat = (listener) => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    setActiveChat(listener);
    setMessages([{ text: listener.greeting, from: 'listener' }]);
    setInput('');
  };

  const closeChat = () => {
    setActiveChat(null);
    setMessages([]);
    setIsTyping(false);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, from: 'user' }]);
    setInput('');
    setIsTyping(true);

    // simulated listener reply
    setTimeout(() => {
      setIsTyping(false);
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      setMessages(prev => [...prev, { text: reply, from: 'listener' }]);
    }, 1500 + Math.random() * 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const onlineCount = listeners.filter(l => l.online).length;

  return (
    <motion.div
      className={`container ${styles.page}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* ─── Hero ─── */}
      <header className={styles.hero}>
        <motion.h2 initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          Talk to Someone Now
        </motion.h2>
        <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          Trained, empathetic listeners are here for you — instantly, anonymously, and free. No appointments, no judgments.
        </motion.p>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className={styles.statusBanner}>
            <div className={styles.pulseWrapper}>
              <span className={styles.pulseDot} />
              <span className={styles.pulseRing} />
            </div>
            <span>{onlineCount} listeners online right now</span>
          </div>
        </motion.div>
      </header>

      {/* ─── Feature Chips ─── */}
      <motion.div
        className={styles.features}
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.3 } }
        }}
      >
        {[
          { icon: <ShieldCheck size={18} />, label: '100% Anonymous' },
          { icon: <Clock size={18} />, label: 'Connect in Seconds' },
          { icon: <Heart size={18} />, label: 'Free Forever' },
          { icon: <Headphones size={18} />, label: 'Trained Listeners' },
        ].map((f, i) => (
          <motion.div
            key={i}
            className={styles.featureChip}
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          >
            {f.icon}
            {f.label}
          </motion.div>
        ))}
      </motion.div>

      {/* ─── Listener Grid ─── */}
      <h2 className={styles.sectionTitle}>Available Listeners</h2>
      <p className={styles.sectionSubtitle}>Choose someone who feels right for you. Every conversation is private.</p>

      <motion.div
        className={styles.grid}
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
        }}
      >
        {listeners.map(l => (
          <motion.div key={l.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <Card elevation={1} className={styles.listenerCard} onClick={() => l.online && openChat(l)}>
              <div className={styles.cardTop}>
                <div className={styles.avatar} style={{ background: l.bg }}>
                  {l.initials}
                </div>
                <div className={styles.listenerMeta}>
                  <h3>{l.name}</h3>
                  <span>{l.tagline}</span>
                </div>
                {l.online ? (
                  <span className={styles.onlineBadge}>Online</span>
                ) : (
                  <span className={styles.offlineBadge}>Away</span>
                )}
              </div>

              <div className={styles.topics}>
                {l.topics.map(t => (
                  <span key={t} className={styles.topicTag}>{t}</span>
                ))}
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.rating}>
                  <Star size={15} fill="var(--tertiary)" />
                  <span>{l.rating} · {l.sessions} chats</span>
                </div>
                <Button size="sm" variant={l.online ? 'primary' : 'secondary'} disabled={!l.online}>
                  {l.online ? 'Talk Now' : 'Unavailable'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ─── How It Works ─── */}
      <section className={styles.howSection}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <p className={styles.sectionSubtitle}>Getting support is simple and immediate.</p>
        <motion.div
          className={styles.howGrid}
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.5 } }
          }}
        >
          {[
            { icon: <Users size={28} />, title: 'Choose a Listener', desc: 'Browse available listeners and pick one who matches your comfort level.' },
            { icon: <MessageCircle size={28} />, title: 'Start Talking', desc: 'Instantly open a private chat. Share as much or as little as you want.' },
            { icon: <Sparkles size={28} />, title: 'Feel Heard', desc: 'Our listeners are trained to help you process your thoughts with care.' },
          ].map((step, i) => (
            <motion.div key={i} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <Card elevation={0} className={styles.howCard}>
                <div className={styles.howIcon}>{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── Chat Modal ─── */}
      <AnimatePresence>
        {activeChat && (
          <motion.div
            className={styles.chatOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChat}
          >
            <motion.div
              className={styles.chatModal}
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={styles.chatHeader}>
                <div className={styles.chatHeaderLeft}>
                  <div className={styles.chatAvatar} style={{ background: activeChat.bg }}>
                    {activeChat.initials}
                  </div>
                  <div className={styles.chatHeaderInfo}>
                    <h3>{activeChat.name}</h3>
                    <span>● Online now</span>
                  </div>
                </div>
                <button className={styles.closeBtn} onClick={closeChat} aria-label="Close chat">
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className={styles.chatBody} ref={chatBodyRef}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`${styles.msgBubble} ${msg.from === 'user' ? styles.msgOutgoing : styles.msgIncoming}`}
                  >
                    {msg.text}
                  </div>
                ))}
                {isTyping && (
                  <div className={styles.typing}>
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                  </div>
                )}
              </div>

              {/* Input */}
              <div className={styles.chatInput}>
                <input
                  type="text"
                  placeholder="Type your message…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                <button
                  className={styles.sendBtn}
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Auth Prompt Modal ─── */}
      <AnimatePresence>
        {showAuthPrompt && (
          <motion.div
            className={styles.chatOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthPrompt(false)}
          >
            <motion.div
              className={styles.authPromptModal}
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeBtn}
                onClick={() => setShowAuthPrompt(false)}
                aria-label="Close prompt"
                style={{ position: 'absolute', top: '1rem', right: '1rem' }}
              >
                <X size={20} />
              </button>
              <div className={styles.authPromptIcon}>
                <LogIn size={36} />
              </div>
              <h3 className={styles.authPromptTitle}>Sign in to continue</h3>
              <p className={styles.authPromptText}>
                You need to sign in or create an account before you can start a conversation with a listener.
              </p>
              <div className={styles.authPromptActions}>
                <Button variant="primary" onClick={() => navigate('/auth')}>
                  Sign In / Sign Up
                </Button>
                <Button variant="secondary" onClick={() => setShowAuthPrompt(false)}>
                  Maybe Later
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Demo Feature Modal ─── */}
      <AnimatePresence>
        {showDemoModal && (
          <motion.div
            className={styles.chatOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: 300 }}
          >
            <motion.div
              className={styles.demoModal}
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.demoIconWrapper}>
                <AlertTriangle size={40} />
              </div>
              <h3 className={styles.demoTitle}>This is a Demo</h3>
              <p className={styles.demoText}>
                This feature is currently under development and will be available soon. Stay tuned for updates!
              </p>
              <Button variant="primary" onClick={() => setShowDemoModal(false)}>
                Got it, Continue Browsing
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
