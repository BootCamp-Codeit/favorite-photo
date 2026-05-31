'use client';

import { forwardRef } from 'react';
import styles from './Input.module.css';

const Input = forwardRef(function Input({ type = 'text', className = '', ...props }, ref) {
  return <input ref={ref} type={type} className={[styles.input, className].join(' ')} {...props} />;
});

export default Input;
