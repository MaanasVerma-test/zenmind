import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import styles from './Therapists.module.css';
import { Search, Star, MessageSquare } from 'lucide-react';
import { therapists } from '../data/therapists';
import { useAuth } from '../providers/AuthProvider';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0 }
};

export default function Therapists() {
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBook = (id) => {
    if (!user) {
      toast.error('Please sign in to book a therapist.');
      navigate('/auth');
      return;
    }
    navigate(`/therapists/${id}`);
  };

  const tabs = ['All', 'Psychologists', 'Psychotherapists', 'Counselors'];

  return (
    <motion.div 
      className={`container ${styles.page}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <header className={styles.header}>
        <motion.h2 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1}}>Professional Care</motion.h2>
        <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1}} transition={{ delay: 0.1 }}>
          Find the right specialist for your journey.
        </motion.p>
        
        <motion.div className={styles.searchContainer} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className={styles.searchBar}>
            <Search color="var(--on-surface-variant)" size={20} />
            <input type="text" placeholder="Search by name or specialty..." />
          </div>
          <div className={styles.filterTabs}>
            {tabs.map(tab => (
              <button 
                key={tab} 
                className={`${styles.filterBtn} ${activeTab === tab ? styles.active : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>
      </header>

      <motion.div 
        className={styles.grid}
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
        }}
      >
        {therapists.map(t => (
          <motion.div key={t.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <Card elevation={1} className={styles.therapistCard}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar} style={{ background: t.imageRef }}></div>
                <div className={styles.info}>
                  <h3>{t.name}</h3>
                  <span className={styles.specialty}>{t.specialty}</span>
                </div>
              </div>

              <div className={styles.stats}>
                <div className={styles.statLine}>
                  <Star size={16} fill="var(--tertiary)" color="var(--tertiary)" />
                  <span>{t.rating} ({t.reviews} reviews)</span>
                </div>
                <div className={styles.statLine}>
                  <MessageSquare size={16} color="var(--on-surface-variant)" />
                  <span>{t.sessions} sessions</span>
                </div>
              </div>

              <div className={styles.footer}>
                <div className={styles.bookingDetails}>
                  <span className={styles.price}>{t.price}</span>
                  <span className={styles.availability}>Next: {t.available}</span>
                </div>
                <Button size="sm" onClick={() => handleBook(t.id)}>Book</Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
