import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import styles from './Meditation.module.css';
import { Play, Pause, RotateCcw, CheckCircle2, Circle, Wind, Video, Activity } from 'lucide-react';
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
    const saved = localStorage.getItem('zenmind_checklist_v2');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, text: 'Nature Walk (15m)', completed: false },
      { id: 2, text: 'Hydration (2L)', completed: false },
      { id: 3, text: 'Journaling (Thought Dump)', completed: false },
      { id: 4, text: 'Screen-Free Hour', completed: false },
      { id: 5, text: 'Mindful Eating', completed: false },
      { id: 6, text: 'Deep Stretching', completed: false }
    ];
  });

  const [breathPhase, setBreathPhase] = useState('Idle');
  const [breathActive, setBreathActive] = useState(false);

  const breathModes = [
    { id: '478', name: '4-7-8 Relaxation', desc: 'Inhale 4s, Hold 7s, Exhale 8s' },
    { id: 'box', name: 'Box Breathing', desc: 'Inhale 4s, Hold 4s, Exhale 4s, Hold 4s' },
    { id: 'resonance', name: 'Resonance', desc: 'Inhale 5s, Exhale 5s' }
  ];
  const [activeBreathMode, setActiveBreathMode] = useState('478');

  // Stretching Feature State
  const [stretchActive, setStretchActive] = useState(false);
  const [stretchPhaseIndex, setStretchPhaseIndex] = useState(0);

  const stretchSequence = [
    { name: 'Tall Reach', instruction: 'Extend arms fully above your head, stretch your spine.', time: 5000, scale: 1.4, color: 'rgba(0, 255, 255, 0.9)', blur: '60px', img: '/stretch_reach.png' },
    { name: 'Hold Reach', instruction: 'Maintain the upward stretch...', time: 3000, scale: 1.5, color: 'rgba(255, 0, 255, 1)', blur: '90px', img: '/stretch_reach.png' },
    { name: 'Relax', instruction: 'Slowly bring your arms down.', time: 4000, scale: 1.0, color: 'rgba(128, 0, 128, 0.3)', blur: '20px', img: '/stretch_stand.png' },
    { name: 'Left Bend', instruction: 'Lean gently to your left.', time: 5000, scale: 1.4, color: 'rgba(0, 255, 128, 0.9)', blur: '60px', img: '/stretch_left.png' },
    { name: 'Hold Bend', instruction: 'Feel the stretch along your right side...', time: 3000, scale: 1.5, color: 'rgba(0, 255, 0, 1)', blur: '90px', img: '/stretch_left.png' },
    { name: 'Center', instruction: 'Return to center gracefully.', time: 4000, scale: 1.0, color: 'rgba(128, 0, 128, 0.3)', blur: '20px', img: '/stretch_stand.png' },
    { name: 'Right Bend', instruction: 'Lean gently to your right.', time: 5000, scale: 1.4, color: 'rgba(255, 255, 0, 0.9)', blur: '60px', img: '/stretch_right.png' },
    { name: 'Hold Bend', instruction: 'Feel the stretch along your left side...', time: 3000, scale: 1.5, color: 'rgba(255, 165, 0, 1)', blur: '90px', img: '/stretch_right.png' },
    { name: 'Center', instruction: 'Return to a loose standing posture.', time: 4000, scale: 1.0, color: 'rgba(128, 0, 128, 0.3)', blur: '20px', img: '/stretch_stand.png' },
  ];

  useEffect(() => {
    localStorage.setItem('zenmind_checklist_v2', JSON.stringify(checklist));
  }, [checklist]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      toast.success('Meditation session completed! Great job taking time for yourself.');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Breathing engine
  useEffect(() => {
    let timeout;
    if (!breathActive) {
      setBreathPhase('Idle');
      return;
    }

    const runCycle = () => {
      if (activeBreathMode === '478') {
        setBreathPhase('Inhale');
        timeout = setTimeout(() => {
          setBreathPhase('Hold');
          timeout = setTimeout(() => {
            setBreathPhase('Exhale');
            timeout = setTimeout(runCycle, 8000);
          }, 7000);
        }, 4000);
      } else if (activeBreathMode === 'box') {
        setBreathPhase('Inhale');
        timeout = setTimeout(() => {
          setBreathPhase('Hold (In)');
          timeout = setTimeout(() => {
            setBreathPhase('Exhale');
            timeout = setTimeout(() => {
              setBreathPhase('Hold (Out)');
              timeout = setTimeout(runCycle, 4000);
            }, 4000);
          }, 4000);
        }, 4000);
      } else if (activeBreathMode === 'resonance') {
        setBreathPhase('Inhale');
        timeout = setTimeout(() => {
          setBreathPhase('Exhale');
          timeout = setTimeout(runCycle, 5000);
        }, 5000);
      }
    };

    runCycle();
    return () => clearTimeout(timeout);
  }, [breathActive, activeBreathMode]);

  // Stretching engine
  useEffect(() => {
    let timeout;
    if (!stretchActive) {
      setStretchPhaseIndex(0);
      return;
    }

    const runStretch = (index) => {
      setStretchPhaseIndex(index);
      const nextIndex = (index + 1) % stretchSequence.length;
      timeout = setTimeout(() => {
        runStretch(nextIndex);
      }, stretchSequence[index].time);
    };

    runStretch(0);
    return () => clearTimeout(timeout);
  }, [stretchActive, stretchSequence]);

  // Lock scroll during focus mode
  useEffect(() => {
    document.body.style.overflow = (breathActive || stretchActive) ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [breathActive, stretchActive]);

  const toggleTimer = () => setIsActive((prev) => !prev);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(15 * 60);
  };

  const setPreset = (mins) => {
    setIsActive(false);
    setTimeLeft(mins * 60);
  };

  const toggleChecklist = (id) => {
    const item = checklist.find((i) => i.id === id);
    if (item && !item.completed) {
      toast.success('Completed: ' + item.text);
    }
    setChecklist(checklist.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i)));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return m + ':' + s;
  };

  const getYogaGlowStyle = () => {
    if (!breathActive) {
      return { filter: 'drop-shadow(0 0 0px transparent)', scale: 1 };
    }

    let color = 'rgba(0,255,255,0)';
    let blur = '10px';
    let scale = 1;
    let duration = 4;

    if (breathPhase.includes('Inhale')) {
      color = 'rgba(0,255,255,0.8)';
      blur = '40px';
      scale = 1.1;
    } else if (breathPhase === 'Hold' || breathPhase === 'Hold (In)') {
      color = 'rgba(255,0,255,0.9)';
      blur = '50px';
      scale = 1.15;
    } else if (breathPhase.includes('Exhale')) {
      color = 'rgba(124,252,0,0.6)';
      blur = '20px';
      scale = 1;
      if (activeBreathMode === '478') duration = 8;
    } else if (breathPhase === 'Hold (Out)') {
      color = 'rgba(138,43,226,0.5)';
      blur = '10px';
      scale = 0.95;
    }

    if (activeBreathMode === 'resonance') duration = 5;

    return {
      filter: 'drop-shadow(0 0 ' + blur + ' ' + color + ')',
      scale: scale,
      transition: { duration: duration, ease: 'easeInOut' }
    };
  };

  const currentMode = breathModes.find((m) => m.id === activeBreathMode);

  return (
    <motion.div
      className={clsx('container', styles.page)}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Full-screen Focus Mode */}
      <AnimatePresence>
        {breathActive && (
          <motion.div
            className={styles.focusOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.focusContent}>
              <motion.img
                src="/yoga_pose.png"
                alt="Yoga Silhouette"
                className={styles.focusYoga}
                animate={getYogaGlowStyle()}
              />
              <motion.div
                className={styles.focusPhase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {breathPhase}
              </motion.div>
              <motion.p
                className={styles.focusModeLabel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {currentMode.name} — {currentMode.desc}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button size="lg" variant="secondary" onClick={() => setBreathActive(false)} style={{ marginTop: '2rem' }}>
                  Stop Session
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {stretchActive && (
          <motion.div
            className={styles.focusOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.focusContent}>
                <motion.img
                  key={stretchSequence[stretchPhaseIndex].img}
                  src={stretchSequence[stretchPhaseIndex].img}
                  alt="Stretching Skeleton"
                  className={styles.stretchSkeleton}
                  initial={{ opacity: 0.7, scale: stretchSequence[stretchPhaseIndex].scale * 0.9 }}
                  animate={{
                    opacity: 1,
                    filter: `drop-shadow(0 0 ${stretchSequence[stretchPhaseIndex].blur} ${stretchSequence[stretchPhaseIndex].color}) hue-rotate(180deg)`,
                    scale: stretchSequence[stretchPhaseIndex].scale,
                    transition: { duration: stretchSequence[stretchPhaseIndex].time / 1000, ease: 'easeInOut' }
                  }}
                />
              <div className={styles.stretchOverlayText}>
                <motion.div
                  className={styles.focusPhase}
                  key={`phase-${stretchPhaseIndex}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  style={{ background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1.5rem', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}
                >
                  {stretchSequence[stretchPhaseIndex].name}
                </motion.div>
                <motion.p
                  className={styles.focusModeLabel}
                  style={{ fontSize: '1.5rem', color: '#fff', marginTop: '1rem', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1.5rem', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}
                  key={`text-${stretchPhaseIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {stretchSequence[stretchPhaseIndex].instruction}
                </motion.p>
                <Button size="lg" variant="secondary" onClick={() => setStretchActive(false)} style={{ marginTop: '3rem', zIndex: 10, position: 'relative' }}>
                  Complete Stretch
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className={styles.header}>
        <motion.h2 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          Mindful Sessions
        </motion.h2>
        <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          Take a deep breath. Build your habits. Follow along.
        </motion.p>
      </header>

      {/* Top section: Timer + Breathing side by side */}
      <div className={styles.topTools}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <Card elevation={2} className={styles.timerCard}>
            <div className={styles.timerDisplay}>
              <svg className={styles.progressRing} viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" className={styles.ringBg} />
                <circle cx="60" cy="60" r="54" className={styles.ringProgress} />
              </svg>
              <div className={styles.timeText}>{formatTime(timeLeft)}</div>
            </div>

            <div className={styles.presets}>
              {presets.map((min) => (
                <button key={min} className={styles.presetBtn} onClick={() => setPreset(min)}>
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
          <Card elevation={1} className={styles.breathingCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Wind size={20} />
                  <select
                    className={styles.modeSelect}
                    value={activeBreathMode}
                    onChange={(e) => setActiveBreathMode(e.target.value)}
                  >
                    {breathModes.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </h3>
                <p className={styles.pacerSubtitle}>
                  {currentMode.desc}
                </p>
              </div>
              <Button size="sm" variant="primary" onClick={() => setBreathActive(true)}>
                Begin
              </Button>
            </div>

            <div className={styles.pacerContainer}>
              <img
                src="/yoga_pose.png"
                alt="Yoga Silhouette"
                className={styles.yogaGuy}
              />
              <div className={styles.pacerText}>
                Click Begin to enter Focus Mode
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
          <Card elevation={1} className={styles.breathingCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Activity size={20} />
                  <span style={{ fontSize: '1.125rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Stretching Flow</span>
                </h3>
                <p className={styles.pacerSubtitle}>
                  Full body dynamic sequence
                </p>
              </div>
              <Button size="sm" variant="primary" onClick={() => setStretchActive(true)}>
                Begin
              </Button>
            </div>

            <div className={styles.pacerContainer}>
              <img
                src="/yoga_pose.png"
                alt="Stretching"
                className={styles.yogaGuy}
                style={{ filter: 'hue-rotate(180deg)', opacity: 0.8 }}
              />
              <div className={styles.pacerText}>
                Release tension
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Videos section */}
      <motion.div className={styles.videoGridWrapper} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Video size={20} /> Guided Video Sessions
        </h3>
        <div className={styles.videoSection}>
          <Card className={styles.videoCard}>
            <div className={styles.videoWrapper}>
              <iframe src="https://www.youtube.com/embed/O-6f5wQXSu8" title="10 Minute Guided Meditation for Anxiety" frameBorder="0" allowFullScreen></iframe>
            </div>
            <div className={styles.videoInfo}>
              <h4>10 Min Guided Meditation for Anxiety</h4>
              <span>Goodful</span>
            </div>
          </Card>

          <Card className={styles.videoCard}>
            <div className={styles.videoWrapper}>
              <iframe src="https://www.youtube.com/embed/inpok4MKVLM" title="5 Minute Meditation You Can Do Anywhere" frameBorder="0" allowFullScreen></iframe>
            </div>
            <div className={styles.videoInfo}>
              <h4>5 Minute Quick Reset Anywhere</h4>
              <span>Goodful</span>
            </div>
          </Card>

          <Card className={styles.videoCard}>
            <div className={styles.videoWrapper}>
              <iframe src="https://www.youtube.com/embed/C4bofW53sO8" title="Deep guided meditation in 15 minutes" frameBorder="0" allowFullScreen></iframe>
            </div>
            <div className={styles.videoInfo}>
              <h4>Deep guided meditation in 15 minutes</h4>
              <span>Great Meditation</span>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Checklist section */}
      <motion.div className={styles.checklistSection} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
        <Card elevation={1} className={styles.checklistCard}>
          <h3>Daily Grounding Checklist</h3>
          <p className={styles.pacerSubtitle}>Check off activities manually as you complete them.</p>
          <div className={styles.checklistGrid}>
            {checklist.map((item) => (
              <motion.div
                key={item.id}
                className={clsx(styles.checkItem, item.completed && styles.completed)}
                onClick={() => toggleChecklist(item.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.completed ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle2 className={styles.checkIcon} color="var(--primary)" />
                  </motion.div>
                ) : (
                  <Circle className={styles.checkIcon} color="var(--outline-variant)" />
                )}
                <span>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
