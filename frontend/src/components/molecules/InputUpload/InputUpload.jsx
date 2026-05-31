'use client';

import { useMemo, useRef } from 'react';
import Label from '../../atoms/Label/Label';
import styles from './InputUpload.module.css';

export default function InputUpload({
  label,
  value, // File | null 권장
  onChange, // (fileOrNull) => void 권장
  className = '',
  error,
  required = false,
  id,
  disabled = false,
  accept,
}) {
  const inputRef = useRef(null);

  const fileName = useMemo(() => {
    if (!value) return '';
    if (value instanceof File) return value.name;
    return String(value);
  }, [value]);

  const openPicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    onChange?.(f);
  };

  const clearFile = () => {
    if (disabled) return;
    if (inputRef.current) inputRef.current.value = '';
    onChange?.(null);
  };

  return (
    <div className={[styles.root, className].join(' ')}>
      <Label className={styles.label} htmlFor={id}>
        {label}
      </Label>

      {/* 실제 파일 인풋은 숨김 */}
      <input
        ref={inputRef}
        id={id}
        className={styles.hiddenInput}
        type="file"
        onChange={handleFileChange}
        disabled={disabled}
        required={required}
        accept={accept}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      <div className={styles.row}>
        {/* 파일명 표시 박스 */}
        <div className={[styles.fileBox, error ? styles.error : ''].join(' ')} onClick={openPicker}>
          <span className={[styles.fileText, !fileName ? styles.placeholder : ''].join(' ')}>
            {fileName || '사진 업로드'}
          </span>

          {fileName && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              aria-label="파일 제거"
              disabled={disabled}
            >
              ×
            </button>
          )}
        </div>

        {/* 우측 버튼 */}
        <button
          type="button"
          className={styles.pickButton}
          onClick={openPicker}
          disabled={disabled}
        >
          파일 선택
        </button>
      </div>

      {error && (
        <p id={`${id}-error`} className={styles.errorMessage}>
          {error}
        </p>
      )}
    </div>
  );
}
