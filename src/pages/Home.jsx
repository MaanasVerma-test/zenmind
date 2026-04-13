import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import styles from './Home.module.css';
import { Sparkles, Users, Wind, MessageCircle, HeartPulse, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { fetchSiteStats } from '../lib/database';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }
};

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ member_count: '10k+', app_rating: '4.9/5' });

  useEffect(() => {
    fetchSiteStats().then(setStats).catch(console.error);
  }, []);

  return (
    <motion.div 
      className={styles.home}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero Section */}
      <section className={clsx('container', styles.heroContainer)}>
        <motion.div className={styles.heroContent} variants={pageVariants}>


          <motion.h1 className={styles.title} variants={itemVariants}>
            Find your calm.<br />
            <span className={styles.titleHighlight}>Grow your mind.</span>
          </motion.h1>
          
          <motion.p className={styles.subtitle} variants={itemVariants}>
            A safe space designed for your mental well-being. Blend ancient wisdom with modern technology.
          </motion.p>
          
          <motion.div className={styles.actions} variants={itemVariants}>
            <Button size="lg" onClick={() => navigate('/meditation')}>
              Start Meditating
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/community')}>
              Join Community
            </Button>
          </motion.div>
          
          <motion.div className={styles.stats} variants={itemVariants}>
            <div className={styles.statItem}>
              <Users size={20} className={styles.statIcon} />
              <div>
                <strong>{stats.member_count}</strong>
                <span>Active Members</span>
              </div>
            </div>
            <div className={styles.statItem}>
              <Sparkles size={20} className={styles.statIcon} />
              <div>
                <strong>{stats.app_rating}</strong>
                <span>App Rating</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className={styles.heroVisual}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className={clsx(styles.abstractShape, styles.shape1)}></div>
          <div className={clsx(styles.abstractShape, styles.shape2)}></div>
          <div className={clsx(styles.abstractShape, styles.shape3)}></div>
          <motion.div 
            className={clsx('glass-panel', styles.heroCard)}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3>Daily Intention</h3>
            <p>"I choose peace over perfection today."</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className={clsx('container', styles.section)}>
        <motion.div 
          className={styles.sectionHeader}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={itemVariants}
        >
          <h2>Holistic Tools for Healing</h2>
          <p>Everything you need to ground your mind, organized intuitively.</p>
        </motion.div>

        <motion.div 
          className={styles.featuresGrid}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
        >
          <motion.div variants={itemVariants} onClick={() => navigate('/meditation')} style={{cursor:'pointer'}}>
            <Card elevation={1} className={styles.featureCard}>
              <div className={styles.featureIconWrap} style={{ background: 'var(--primary-container)', color: 'var(--on-primary-container)' }}>
                <Wind size={28} />
              </div>
              <h3>Guided Breathwork</h3>
              <p>Short, evidence-based guided meditations designed to lower heart rate and reduce cortisol levels.</p>
              <span className={styles.featureLink}>Explore Sessions <ArrowRight size={16} /></span>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants} onClick={() => navigate('/community')} style={{cursor:'pointer'}}>
            <Card elevation={1} className={styles.featureCard}>
              <div className={styles.featureIconWrap} style={{ background: 'var(--secondary-container)', color: 'var(--on-secondary-container)' }}>
                <MessageCircle size={28} />
              </div>
              <h3>Anonymous Peer Support</h3>
              <p>Join tightly-knit groups like 'Sleep Sanctuary' to share thoughts without fear of judgment.</p>
              <span className={styles.featureLink}>View Groups <ArrowRight size={16} /></span>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} onClick={() => navigate('/therapists')} style={{cursor:'pointer'}}>
            <Card elevation={1} className={styles.featureCard}>
              <div className={styles.featureIconWrap} style={{ background: 'var(--tertiary-container)', color: 'var(--on-tertiary-container)' }}>
                <HeartPulse size={28} />
              </div>
              <h3>Professional Care</h3>
              <p>Connect instantly with verified clinical psychologists and counselors for deep, structured healing.</p>
              <span className={styles.featureLink}>Find a Therapist <ArrowRight size={16} /></span>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className={styles.darkSection}>
        <div className={clsx('container', styles.philosophyContainer)}>
          <motion.div 
            className={styles.philosophyContent}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={pageVariants}
          >
            <motion.h2 variants={itemVariants}>Not just an app. A reaction against digital noise.</motion.h2>
            <motion.p variants={itemVariants}>
              Most apps are designed to steal your attention. ZenMind is designed to give it back. 
              Our interface is intentionally built with soft colors, fluid motion, and zero addictive loops.
              We measure success not by how long you stay, but by how well you feel when you leave.
            </motion.p>
            <motion.div variants={itemVariants} style={{marginTop: '2rem'}}>
              <Button onClick={() => navigate('/about')} variant="secondary">Read Our Story</Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={clsx('container', styles.footerGrid)}>
          <div>
            <div className={styles.footerLogo}>
              <Sparkles size={24} color="var(--primary)" />
              <span>ZenMind</span>
            </div>
            <p className={styles.footerDesc}>The stigma-free digital sanctuary for young adults.</p>
          </div>
          <div>
            <h4>Platform</h4>
            <ul>
              <li onClick={() => navigate('/meditation')}>Meditation</li>
              <li onClick={() => navigate('/community')}>Community</li>
              <li onClick={() => navigate('/therapists')}>Therapists</li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li onClick={() => navigate('/about')}>About Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 ZenMind Wellness. All rights reserved.</p>
        </div>
      </footer>
    </motion.div>
  );
}
