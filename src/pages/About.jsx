import React from 'react';
import { motion } from 'framer-motion';
import styles from './About.module.css';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0 }
};

export default function About() {
  return (
    <motion.div 
      className={`container ${styles.page}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className={styles.content}>
        <header className={styles.header}>
          <motion.h2 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1}}>About ZenMind</motion.h2>
          <motion.p className={styles.subtitle} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1}} transition={{ delay: 0.1 }}>
            Blending ancient wisdom with modern technology.
          </motion.p>
        </header>

        <motion.div
           initial="hidden"
           animate="show"
           variants={{
             hidden: { opacity: 0 },
             show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
           }}
        >
          <motion.section className={styles.section} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <h3>Our Mission</h3>
            <p>
              ZenMind was created as a "digital sanctuary"—a reaction against the noisy, high-anxiety digital world. 
              We believe that mental well-being should be accessible, beautiful, and deeply integrated into our daily lives. 
              Our platform is designed to soothe the nervous system, combining soft aesthetics with powerful tools for meditation, 
              community support, and professional therapy.
            </p>
          </motion.section>

          <motion.section className={styles.section} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <h3>The Digital Sanctuary</h3>
            <p>
              Our design philosophy rejects rigid, boxy constraints. We embrace intentional asymmetry, overlapping translucent layers, 
              and organic fluidity. The colors you see are drawn from nature—from misty mornings to deep forest canopies—curated to 
              provide a visual exhale.
            </p>
          </motion.section>

          <motion.section className={styles.section} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <h3>Accessibility & Empathy</h3>
            <p>
              Whether you're taking 5 minutes to ground yourself before a meeting, seeking advice from an anonymous peer, 
              or finding a clinical psychologist, ZenMind is built with empathy first. It's your space to grow your mind.
            </p>
          </motion.section>
        </motion.div>
      </div>
    </motion.div>
  );
}
