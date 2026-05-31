'use client';

import Link from 'next/link';

export default function ButtonBase({
  children,
  className = '',
  disabled = false,
  href,
  onClick,
  type = 'button',
  ...props
}) {
  if (href) {
    return (
      <Link
        href={href}
        className={className}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          onClick?.(e);
        }}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={className} {...props}>
      {children}
    </button>
  );
}
