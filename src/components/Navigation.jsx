import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';
import { Leaf, Moon, Sun } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from './Button';
import { useTheme } from '../providers/ThemeProvider';

export const Navigation = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={clsx('container', styles.navContainer)}>
        <NavLink to="/" className={styles.logo}>
          <Leaf className={styles.logoIcon} />
          <span>ZenMind</span>
        </NavLink>

        <nav className={styles.navLinks}>
          <NavLink 
            to="/" 
            className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
          >
            Home
          </NavLink>
          <NavLink 
            to="/meditation" 
            className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
          >
            Meditation
          </NavLink>
          <NavLink 
            to="/community" 
            className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
          >
            Community
          </NavLink>
          <NavLink 
            to="/therapists" 
            className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
          >
            Therapists
          </NavLink>
          <NavLink 
            to="/talk" 
            className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
          >
            Talk
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
          >
            About
          </NavLink>
        </nav>

        <div className={styles.actions}>
          <button 
            onClick={toggleTheme} 
            className={styles.themeToggle}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Button variant="primary" size="sm">Get Started</Button>
        </div>
      </div>
    </header>
  );
};
