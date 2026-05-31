'use client';
import styles from './Label.module.css';

export default function Label({ children, className = '', style }) {
  return (
    <label className={`${styles.label} ${className}`.trim()} style={style}>
      {children}
    </label>
  );
}
