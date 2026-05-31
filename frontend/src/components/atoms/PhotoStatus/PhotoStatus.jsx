// src/components/atoms/PhotoStatus/PhotoStatus.jsx
'use client';
import styles from './PhotoStatus.module.css';
import Label from '../Label/Label';

export default function PhotoStatus({ children, className, style }) {
  return (
    <div className={`${styles.overlay} ${className || ''}`.trim()} style={style}>
      <Label className={styles.label}>{children}</Label>
    </div>
  );
}
