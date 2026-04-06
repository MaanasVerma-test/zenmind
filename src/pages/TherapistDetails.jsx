import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Star, MessageSquare, ArrowLeft, Calendar, Clock, Globe, GraduationCap } from 'lucide-react';
import { Button } from '../components/Button';
import styles from './TherapistDetails.module.css';
import { therapists } from '../data/therapists';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20 }
};

export default function TherapistDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [therapist, setTherapist] = useState(null);

  useEffect(() => {
    // Scroll to top when opening details
    window.scrollTo(0, 0);
    const found = therapists.find(t => t.id === parseInt(id));
    setTherapist(found);
  }, [id]);

  const handleBook = () => {
    toast.success(`Booking request sent to ${therapist.name}. They will confirm shortly.`);
  };

  if (!therapist) {
    return (
      <div className={`container ${styles.page} ${styles.notFound}`}>
        <h2>Therapist Not Found</h2>
        <Button onClick={() => navigate('/therapists')}>Return to Directory</Button>
      </div>
    );
  }

  return (
    <motion.div 
      className={`container ${styles.page}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <button className={styles.backButton} onClick={() => navigate('/therapists')}>
        <ArrowLeft size={18} />
        Back to Therapists
      </button>

      <div className={styles.profileHeader}>
        <motion.div 
          className={styles.avatarContainer}
          style={{ background: therapist.imageRef }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
        
        <div className={styles.infoContainer}>
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            {therapist.name}
          </motion.h1>
          <motion.span 
            className={styles.specialty}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            {therapist.specialty}
          </motion.span>
          
          <motion.div 
            className={styles.statsRow}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          >
            <div className={styles.statItem}>
              <Star size={20} fill="var(--tertiary)" />
              <span><strong>{therapist.rating}</strong> ({therapist.reviews} reviews)</span>
            </div>
            <div className={styles.statItem}>
              <MessageSquare size={20} />
              <span><strong>{therapist.sessions}</strong> sessions</span>
            </div>
            <div className={styles.statItem}>
              <Clock size={20} />
              <span>{therapist.experience} Experience</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        <motion.div 
          className={styles.mainSection}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
        >
          <h2>About</h2>
          <p className={styles.aboutText}>{therapist.about}</p>

          <h2>Qualifications & Background</h2>
          <ul className={styles.traitsList}>
            <li className={styles.traitItem}>
              <GraduationCap size={24} />
              <span>{therapist.education}</span>
            </li>
            <li className={styles.traitItem}>
              <Globe size={24} />
              <span>Speaks: {therapist.languages.join(', ')}</span>
            </li>
          </ul>
        </motion.div>

        <motion.div 
          className={styles.sideSection}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
        >
          <div className={styles.bookingCard}>
            <div className={styles.priceHeader}>
              <div>
                <span className={styles.price}>{therapist.price}</span>
                <span className={styles.perSession}> / session</span>
              </div>
            </div>
            
            <div className={styles.availability}>
              <Calendar size={20} />
              <span>Next available: {therapist.available}</span>
            </div>

            <Button size="lg" fullWidth onClick={handleBook}>
              Request Session
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
