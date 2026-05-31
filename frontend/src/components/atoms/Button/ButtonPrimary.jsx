'use client';

import ButtonBase from './base/ButtonBase';
import styles from './ButtonPrimary.module.css';

const SIZE = ['l', 'm', 's', 'xs'];
const THICKNESS = ['thick', 'thin'];

export default function ButtonPrimary({
  children,
  size = 'm',
  thickness = 'thick',
  disabled = false,
  className = '',
  fullWidth = false,
  ...props
}) {
  const safeSize = SIZE.includes(size) ? size : 'm';
  const safeThickness = THICKNESS.includes(thickness) ? thickness : 'thick';

  return (
    <ButtonBase
      {...props}
      disabled={disabled}
      className={[
        styles.base,
        styles.primary,
        styles[`size_${safeSize}`],
        styles[`th_${safeThickness}`],
        fullWidth && styles.fullWidth,
        disabled ? styles.disabled : styles.default,
        className,
      ].join(' ')}
    >
      {children}
    </ButtonBase>
  );
}
