import React from 'react';
import styles from './Button.module.css';
import { clsx } from 'clsx';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  onClick, 
  ...props 
}) => {
  return (
    <button
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
