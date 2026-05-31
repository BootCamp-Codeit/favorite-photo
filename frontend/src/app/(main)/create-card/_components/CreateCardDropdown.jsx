'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CreateCardDropdown.module.css';

export default function CreateCardDropdown({
  value,
  onChange,
  options = [],
  placeholder = '선택',
  className = '',
  onBlur,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const currentLabel = options.find((o) => o.value === value)?.label ?? '';

  useEffect(() => {
    const onDocClick = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handlePick = (v) => {
    onChange?.(v);
    setOpen(false);
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={[styles.trigger, className].filter(Boolean).join(' ')}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
        onBlur={onBlur}
      >
        <span className={styles.value}>{currentLabel || placeholder}</span>
        <span className={[styles.chev, open && styles.chevOpen].filter(Boolean).join(' ')}>▾</span>
      </button>

      {open && (
        <ul className={styles.menu} role="listbox">
          {options.map((opt) => (
            <li key={opt.value}>
              <button type="button" className={styles.item} onClick={() => handlePick(opt.value)}>
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
