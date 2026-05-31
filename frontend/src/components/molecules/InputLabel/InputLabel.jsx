// src/components/molecules/InputLabel/InputLabel.jsx
'use client';

import Input from '@/components/atoms/Input/Input';
import Label from '@/components/atoms/Label/Label';
import styles from './InputLabel.module.css';

export default function InputLabel({
  label,
  placeholder,
  value,
  onChange,
  maxLength = 30,
  error,
  className = '',
}) {
  const isError = Boolean(error);

  return (
    <div className={`${styles.inputLabel} ${className}`}>
      <Label>{label}</Label>

      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        className={`${styles.input} ${isError ? styles.error : ''}`}
      />

      {isError && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
