'use client';

import ButtonBase from './base/ButtonBase';
import styles from './ButtonSecondary.module.css';

const SIZE = ['l', 'm', 's', 'xs'];
const THICKNESS = ['thick', 'thin'];

export default function ButtonSecondary({
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
        styles.secondary,
        styles[`size_${safeSize}`],
        styles[`th_${safeThickness}`],
        disabled ? styles.disabled : styles.default,
        className,
      ].join(' ')}
    >
      {children}
    </ButtonBase>
  );
}
