import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import styles from './Meditation.module.css';
import { Play, Pause, RotateCcw, CheckCircle2, Circle } from 'lucide-react';
import { clsx } from 'clsx';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0 }
};

export default function Meditation() {
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isActive, setIsActive] = useState(false);
  const presets = [5, 15, 30, 60];
  
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('zenmind_checklist');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, text: 'Nature Walk', completed: false },
      { id: 2, text: 'Hydration', completed: false }
    ];
  });

  useEffect(() => {
    localStorage.setItem('zenmind_checklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      toast.success('Meditation session completed! Great job taking time for yourself.');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(15 * 60);
  };
  const setPreset = (mins) => {
    setIsActive(false);
    setTimeLeft(mins * 60);
  };

  const toggleChecklist = (id) => {
    const item = checklist.find(i => i.id === id);
    if (!item.completed) {
      toast.success(`Completed: ${item.text}`);
    }
    setChecklist(checklist.map(i => 
      i.id === id ? { ...i, completed: !i.completed } : i
    ));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <motion.div 
      className={clsx('container', styles.page)}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <header className={styles.header}>
        <motion.h2 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1}}>Mindful Sessions</motion.h2>
        <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1}} transition={{ delay: 0.1 }}>
          Take a deep breath and find your center.
        </motion.p>
      </header>

      <div className={styles.grid}>
        <div className={styles.timerSection}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}>
            <Card elevation={2} className={styles.timerCard}>
              <div className={styles.timerDisplay}>
                <svg className={styles.progressRing} viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" className={styles.ringBg} />
                  <motion.circle 
                    cx="60" cy="60" r="54" 
                    className={styles.ringProgress} 
                    style={{ strokeDashoffset: isActive ? 50 : 0 }} 
                    animate={{ strokeDashoffset: isActive ? ((timeLeft % 60) / 60) * 339 : 0 }}
                  />
                </svg>
                <div className={styles.timeText}>{formatTime(timeLeft)}</div>
              </div>
              
              <div className={styles.presets}>
                {presets.map(min => (
                  <button 
                    key={min} 
                    className={styles.presetBtn}
                    onClick={() => setPreset(min)}
                  >
                    {min}m
                  </button>
                ))}
              </div>

              <div className={styles.timerControls}>
                <Button size="lg" onClick={toggleTimer} className={styles.playBtn}>
                  {isActive ? <Pause size={24} /> : <Play size={24} />}
                  <span>{isActive ? 'Pause' : 'Start'}</span>
                </Button>
                <Button variant="secondary" size="lg" onClick={resetTimer}>
                  <RotateCcw size={24} />
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card elevation={1} className={styles.checklistCard}>
              <h3>Daily Grounding</h3>
              <div className={styles.checklist}>
                {checklist.map(item => (
                  <motion.div 
                    key={item.id} 
                    className={clsx(styles.checkItem, item.completed && styles.completed)}
                    onClick={() => toggleChecklist(item.id)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.completed ? 
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 className={styles.checkIcon} color="var(--primary)" /></motion.div> : 
                      <Circle className={styles.checkIcon} color="var(--outline-variant)" />
                    }
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <div className={styles.sessionsSection}>
          <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>Guided Journeys</motion.h3>
          <motion.div 
            className={styles.sessionCards}
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
            }}
          >
            {[
              { title: "Morning Manifestation", time: "10 mins • Focus", color: "var(--primary-container)" },
              { title: "Stress Release & Flow", time: "20 mins • Relaxation", color: "var(--secondary-container)" },
              { title: "Focus & Clarity Pulse", time: "15 mins • Productivity", color: "var(--tertiary-container)" }
            ].map((session, i) => (
              <motion.div key={i} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                <Card className={styles.sessionCard}>
                  <div className={styles.sessionImg} style={{ background: session.color }}></div>
                  <div className={styles.sessionInfo}>
                    <h4>{session.title}</h4>
                    <span>{session.time}</span>
                  </div>
                  <Button variant="tertiary" size="sm" onClick={() => toast("Starting session...")}>Play</Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
