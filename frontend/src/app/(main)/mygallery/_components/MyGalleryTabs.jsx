'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/mygallery', label: '보유 포토카드' },
  { href: '/mygallery/selling-card', label: '판매 중인 포토카드' },
  { href: '/create-card', label: '포토카드 생성' },
];

function isActive(pathname, href) {
  if (href === '/create-card') return pathname === '/create-card';
  return pathname.startsWith(href);
}

export default function MyGalleryTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {TABS.map(({ href, label }) => {
        const active = isActive(pathname, href);

        return (
          <Link
            key={href}
            href={href}
            className={[
              'rounded-full border px-4 py-2 text-sm font-semibold transition',
              active
                ? 'border-yellow-300 bg-yellow-300 text-black'
                : 'border-white/20 text-white/70 hover:bg-white/10 hover:text-white',
            ].join(' ')}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
