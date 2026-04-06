import React from 'react';
import styles from './Card.module.css';
import { clsx } from 'clsx';

export const Card = ({ 
  children, 
  elevation = 2, 
  rounded = 'lg',
  className,
  ...props 
}) => {
  return (
    <div
      className={clsx(
        styles.card,
        styles[`elevation-${elevation}`],
        styles[`radius-${rounded}`],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
