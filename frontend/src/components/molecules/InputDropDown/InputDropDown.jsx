'use client';

import styles from './InputDropDown.module.css';
import Label from '../../atoms/Label/Label';
import DropDown from '../../atoms/DropDown/DropDown';

export default function InputDropDown({ label, value, onChange, className, error, disabled }) {
  return (
    <div className={`${styles.inputDropDown} ${className}`}>
      <Label className={styles.label}>{label}</Label>
      <DropDown
        className={`${styles.dropDown} ${className} ${error ? styles.error : ''}`}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
