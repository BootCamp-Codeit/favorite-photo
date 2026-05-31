'use client';

import { useMemo, useState } from 'react';
import Input from '../../atoms/Input/Input';
import Label from '../../atoms/Label/Label';
import styles from './InputPassword.module.css';

export default function InputPassword({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onValidityChange,
  onError,

  id,
  disabled = false,
  required = false,

  // ✅ 추가: 유효성 옵션
  minLength = 8,
  confirmWith, // confirm password에서 원본 비번 값 전달
  mismatchMessage = '비밀번호가 일치하지 않습니다.',
  requiredMessage = '비밀번호를 입력해 주세요.',
  minLengthMessage = `비밀번호는 최소 ${minLength}자 이상이어야 합니다.`,

  className = '',
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const iconSrc = showPassword ? '/assets/icons/ic_visible.svg' : '/assets/icons/ic_invisible.svg';

  const computedError = useMemo(() => {
    const v = String(value ?? '');

    if (!touched) return null;

    if (required && v.trim().length === 0) return requiredMessage;
    if (v.trim().length > 0 && v.length < minLength) return minLengthMessage;

    // ✅ 사진의 케이스: “비밀번호 확인” 불일치
    if (typeof confirmWith === 'string' && v.length > 0 && v !== confirmWith)
      return mismatchMessage;

    return null;
  }, [
    value,
    touched,
    required,
    minLength,
    confirmWith,
    mismatchMessage,
    requiredMessage,
    minLengthMessage,
  ]);

  const errorToShow = computedError;

  const handleBlur = (e) => {
    setTouched(true);

    const isValid = !computedError;
    onValidityChange?.(isValid);
    onError?.(computedError);
    onBlur?.(e);
  };

  // 외부에서 error를 내려주는 구조도 유지하고 싶으면, 우선순위만 정해주면 됨.
  // 지금은 "내부 유효성"이 있으면 그걸 보여주고, 없으면 props error를 사용.
  // const finalError = errorToShow ?? error;

  return (
    <div className={`${styles.inputPassword} ${className}`}>
      <Label className={styles.label} htmlFor={id}>
        {label}
      </Label>

      <div className={styles.inputWrapper}>
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          className={`${styles.input} ${errorToShow ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
          aria-invalid={errorToShow ? 'true' : 'false'}
          aria-describedby={errorToShow ? `${id}-error` : undefined}
        />

        <button
          type="button"
          className={styles.eyeButton}
          onClick={() => setShowPassword((v) => !v)}
          disabled={disabled}
          aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          <img src={iconSrc} alt="" width={20} height={20} className={styles.eyeIcon} />
        </button>
      </div>

      {errorToShow && (
        <p id={`${id}-error`} className={styles.errorMessage}>
          {errorToShow}
        </p>
      )}
    </div>
  );
}
