// src/components/atoms/DropDown/DropDown.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './DropDown.module.css';

const ICON_OPEN = '/assets/icons/ic_dropdown3.svg'; // 열림(▲)
const ICON_CLOSED = '/assets/icons/ic_dropdown2.svg'; // 닫힘(▼)

export default function DropDown({ options, value, onChange, className, wrapperStyle }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange({ target: { value: option.value } });
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={`${styles.wrapper} ${className || ''}`} style={wrapperStyle}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
      >
        <span className={styles.value}>{selectedOption?.label ?? '선택'}</span>
        <span className={styles.icon}>
          <img src={isOpen ? ICON_OPEN : ICON_CLOSED} alt="" width={24} height={24} />
        </span>
      </button>

      {isOpen && (
        <ul className={styles.menu} role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`${styles.option} ${option.value === value ? styles.selected : ''}`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
