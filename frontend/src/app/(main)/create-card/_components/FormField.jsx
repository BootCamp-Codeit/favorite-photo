// src/app/(main)/create-card/_components/FormField.jsx
'use client';

import Label from '@/components/atoms/Label/Label';

export default function FormField({ label, children, className = '' }) {
  return (
    <div className={['flex flex-col gap-2', className].join(' ')}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
