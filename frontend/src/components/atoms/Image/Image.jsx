'use client';

import NextImage from 'next/image';
import { useState } from 'react';

export default function Image({
  src,
  alt = '',
  className = '',
  priority = false,
  sizes = '360px',
  fallbackSrc = '/images/placeholder.png',
}) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <NextImage
        src={imgSrc}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
        onError={() => setImgSrc(fallbackSrc)}
      />
    </div>
  );
}
