// src/components/molecules/InputEmail.jsx
'use client';

import Input from '../../atoms/Input/Input';
import styles from './InputEmail.module.css';
import Label from '../../atoms/Label/Label';

export default function InputEmail({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onValidityChange,
  onError,
  className = '',
  error,
  id,
  disabled = false,
}) {
  const handleBlur = (e) => {
    const raw = e?.target?.value ?? value ?? '';
    const trimmed = String(raw).trim();

    if (!trimmed) {
      onValidityChange?.(true);
      onError?.(null);
      onBlur?.(e);
      return;
    }

    const browserValid = e?.target?.validity?.valid ?? true;
    const hasAt = trimmed.includes('@');
    const isValid = browserValid && hasAt;

    onValidityChange?.(isValid);
    onError?.(isValid ? null : '이메일 형식이 아닙니다.');
    onBlur?.(e);
  };

  return (
    <div className={`${styles.inputEmail} ${className}`}>
      <Label className={styles.label} htmlFor={id}>
        {label}
      </Label>

      <Input
        className={`${styles.input} ${error ? styles.error : ''}`}
        id={id}
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {error && (
        <p id={`${id}-error`} className={styles.errorMessage}>
          {error}
        </p>
      )}
    </div>
  );
}
