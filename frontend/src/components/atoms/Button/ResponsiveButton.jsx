'use client';

import { useRouter } from 'next/navigation';
import ButtonPrimary from './ButtonPrimary';
import ButtonSecondary from './ButtonSecondary';

/**
 * Renders ButtonPrimary on desktop (≥1200px) and ButtonSecondary on tablet/mobile (<1200px).
 * Visibility is controlled by globals.css (.rb-desktop-only / .rb-mobile-only).
 */
export default function ResponsiveButton({ href, onClick, children, className = '', ...rest }) {
  const router = useRouter();
  const handleClick = (e) => {
    onClick?.(e);
    if (href) router.push(href);
  };

  const commonProps = {
    ...rest,
    onClick: href || onClick ? handleClick : undefined,
    className,
    children,
  };

  return (
    <span className={['inline-flex', className].filter(Boolean).join(' ')}>
      <span className="rb-desktop-only">
        <ButtonPrimary {...commonProps}>{children}</ButtonPrimary>
      </span>
      <span className="rb-mobile-only">
        <ButtonSecondary {...commonProps}>{children}</ButtonSecondary>
      </span>
    </span>
  );
}
