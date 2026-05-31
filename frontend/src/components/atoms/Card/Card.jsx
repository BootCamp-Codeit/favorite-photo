// src/components/atoms/Card/Card.jsx
'use client';
import { Styles } from './Card.module.css';

export default function Card({ children }) {
  return <div className={Styles.card}>{children}</div>;
}
