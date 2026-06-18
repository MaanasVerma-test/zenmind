import React from 'react';
import { motion as Motion } from 'framer-motion';
import styles from './Terms.module.css';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10 }
};

export default function Terms() {
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
            <Motion.h2 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>Terms of Service</Motion.h2>
            <Motion.p className={styles.subtitle} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              Please read these terms carefully before using our digital sanctuary.
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
              <h3>1. Acceptance of Terms</h3>
              <p>
                By accessing or using ZenMind Wellness, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our platform.
              </p>
            </Motion.section>

            <Motion.section className={styles.section} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <h3>2. Description of Service</h3>
              <p>
                ZenMind Wellness provides a platform for mental well-being, including guided meditation, anonymous peer support communities, and connections to professional therapists.
              </p>
            </Motion.section>

            <Motion.section className={styles.section} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <h3>3. User Conduct</h3>
              <p>
                You agree to use the platform in a respectful and lawful manner. Harassment, hate speech, or any form of abuse in our community spaces will result in immediate termination of access.
              </p>
            </Motion.section>

            <Motion.section className={styles.section} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <h3>4. Medical Disclaimer</h3>
              <p>
                ZenMind Wellness is not a healthcare provider. Our content and tools are for informational and well-being purposes only and are not a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </Motion.section>

            <Motion.section className={styles.section} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <h3>5. Professional Care</h3>
              <p>
                Therapists found through our platform are independent contractors. ZenMind is not responsible for the services provided by these professionals.
              </p>
            </Motion.section>

            <Motion.section className={styles.section} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <h3>6. Changes to Terms</h3>
              <p>
                We may update these terms from time to time. Your continued use of the platform after changes are posted constitutes your acceptance of the new terms.
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
