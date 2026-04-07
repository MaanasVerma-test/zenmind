import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Navigation.module.css';
import { Leaf, Moon, Sun, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from './Button';
import { useTheme } from '../providers/ThemeProvider';
import { useAuth } from '../providers/AuthProvider';

export const Navigation = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
            to="/zena" 
            className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
          >
            Talk to Zena
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
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className={styles.userEmail} style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', display: 'none' }}>
                {user.email}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={async () => {
                  await logout();
                  navigate('/auth');
                }}
              >
                <LogOut size={16} style={{ marginRight: '0.5rem' }} />
                Sign Out
              </Button>
            </div>
          ) : (
             <Button variant="primary" size="sm" onClick={() => navigate('/auth')}>Sign In</Button>
          )}
        </div>
      </div>
    </header>
  );
};
