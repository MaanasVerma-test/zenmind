import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import styles from './Navigation.module.css';
import { Leaf, Moon, Sun, LogOut, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from './Button';
import { useTheme } from '../providers/ThemeProvider';
import { useAuth } from '../providers/AuthProvider';

export const Navigation = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Meditation', path: '/meditation' },
    { name: 'Community', path: '/community' },
    { name: 'Therapists', path: '/therapists' },
    { name: 'Talk', path: '/talk' },
    { name: 'Talk to Zena', path: '/zena' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className={styles.header}>
      <div className={clsx('container', styles.navContainer)}>
        <NavLink to="/" className={styles.logo}>
          <Leaf className={styles.logoIcon} />
          <span>ZenMind</span>
        </NavLink>

        <nav className={styles.navLinks}>
          {navLinks.map((link) => (
            <NavLink 
              key={link.path}
              to={link.path} 
              className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <button 
            onClick={toggleTheme} 
            className={styles.themeToggle}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className={styles.desktopAuth}>
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

          <button
            className={styles.hamburger}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNavLinks}>
            {navLinks.map((link) => (
              <NavLink 
                key={link.path}
                to={link.path} 
                className={({ isActive }) => clsx(styles.mobileLink, isActive && styles.activeMobile)}
              >
                {link.name}
              </NavLink>
            ))}
            
            <div className={styles.mobileAuthActions}>
              {user ? (
                <>
                  <span className={styles.mobileUserEmail}>
                    {user.email}
                  </span>
                  <Button 
                    variant="outline" 
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={async () => {
                      await logout();
                      navigate('/auth');
                    }}
                  >
                    <LogOut size={16} style={{ marginRight: '0.5rem' }} />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="primary" style={{ width: '100%' }} onClick={() => navigate('/auth')}>Sign In</Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
