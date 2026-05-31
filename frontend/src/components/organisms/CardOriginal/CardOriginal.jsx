'use client';
import Link from 'next/link';
import styles from './CardOriginal.module.css';
import Label from '../../atoms/Label/Label';
import { getRarityColor } from '@/constants/rarityColors';

export default function CardOriginal({
  rarity = 'COMMON',
  category = '풍경',
  owner = '미쓰손',
  description = '우리집 앞마당 우리집 앞마당 우리집 ...',
  price = '4 P',
  remaining = 2,
  outof = 5,
  imageSrc = '/assets/products/photo-card.svg',
  onClick,
  detailHref,
}) {
  const imageNode = (
    <img
      src={imageSrc}
      alt="Photo Card"
      className={styles.cardImage}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.src = '/assets/products/photo-card.svg';
      }}
    />
  );

  const logoNode = (
    <img
      src="/assets/logos/logo.svg"
      alt="Logo"
      className={styles.logo}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );

  return (
    <div
      className={styles.cardOriginal}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Image Section - link to detail when detailHref provided */}
      <div className={styles.imageContainer}>
        {detailHref ? (
          <Link href={detailHref} onClick={(e) => e.stopPropagation()}>
            {imageNode}
          </Link>
        ) : (
          imageNode
        )}
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Title */}
        <div className={styles.title}>{description}</div>

        {/* Metadata */}
        <div className={styles.metadata}>
          <div className={styles.metadataLeft}>
            <Label className={styles.rarity} style={{ color: getRarityColor(rarity) }}>
              {rarity}
            </Label>
            <Label className={styles.separator}>|</Label>
            <Label className={styles.category}>{category}</Label>
          </div>
          <Label className={styles.owner}>{owner}</Label>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Price and Remaining */}
        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <Label className={styles.infoLabel}>가격</Label>
            <Label className={styles.infoValue}>{price}</Label>
          </div>
          <div className={styles.infoRow}>
            <Label className={styles.infoLabel}>잔여</Label>
            <div className={styles.infoValue}>
              <Label className={styles.remaining}>{remaining}</Label>
              <Label className={styles.outof}> / {outof}</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Logo */}
      <div className={styles.footer}>
        <span className={styles.logo}>{logoNode}</span>
      </div>
    </div>
  );
}
