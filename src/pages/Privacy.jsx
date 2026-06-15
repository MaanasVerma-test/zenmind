import React from 'react';
import { motion as Motion } from 'framer-motion';
import styles from './Privacy.module.css';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10 }
};

export default function Privacy() {
  return (
    <Motion.div
      className="container"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className={styles.page}>
        <div className={styles.content}>
          <header className={styles.header}>
            <Motion.h2 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>Privacy Policy</Motion.h2>
            <Motion.p className={styles.subtitle} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              Your trust is our foundation. Here's how we protect your data.
            </Motion.p>
          </header>

          <Motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
            }}
          >
            <Motion.section className={styles.section} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <h3>1. Data We Collect</h3>
              <p>
                To provide you with the best "digital sanctuary" experience, we collect minimal data:
              </p>
              <ul>
                <li><strong>Account Information:</strong> If you create an account, we store your email and password securely.</li>
                <li><strong>Usage Data:</strong> We track anonymous interactions to improve our meditation and community features.</li>
              </ul>
            </Motion.section>

            <Motion.section className={styles.section} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <h3>2. How We Use Your Data</h3>
              <p>
                We use your data strictly to:
              </p>
              <ul>
                <li>Personalize your well-being journey and recommendations.</li>
                <li>Facilitate anonymous peer support in our community groups.</li>
              </ul>
            </Motion.section>

            <Motion.section className={styles.section} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <h3>3. Data Sharing & Third Parties</h3>
              <p>
                ZenMind does not sell your data. We only share information with service providers like Supabase for secure data storage.
              </p>
            </Motion.section>

            <Motion.section className={styles.section} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <h3>4. Security</h3>
              <p>
                We implement industry-standard encryption and security protocols to ensure your data remains a private sanctuary.
              </p>
            </Motion.section>

            <Motion.section className={styles.section} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <h3>5. Your Rights</h3>
              <p>
                You have the right to access, export, or delete your data at any time.
              </p>
            </Motion.section>
          </Motion.div>

          <footer className={styles.footer}>
            <p className={styles.lastUpdated}>Last Updated: May 20, 2026</p>
          </footer>
        </div>
      </div>
    </Motion.div>
  );
}
