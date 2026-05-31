'use client';
import styles from './CardExchange.module.css';
import originalStyles from '../CardOriginal/CardOriginal.module.css';
import Image from 'next/image';
import Label from '../../atoms/Label/Label';
import { ButtonPrimary, ButtonSecondary, ResponsiveButton } from '@/components/atoms/Button';

export default function CardExchange({
  title,
  rarity,
  category,
  price,
  owner,
  exchangeMessage,
  onDecline,
  onApprove,
  imageSrc = '/assets/products/photo-card-exchange.svg',
}) {
  return (
    <div className={styles.cardExchange}>
      {/* Image Section - Using CardOriginal styles for padding */}
      <div className={originalStyles.imageContainer}>
        <Image
          src={imageSrc}
          alt="Photo Card"
          width={400}
          height={400}
          className={originalStyles.cardImage}
        />
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Title */}
        <div className={styles.title}>{title}</div>

        {/* Metadata */}
        <div className={styles.metadata}>
          <div className={styles.metadataLeft}>
            <Label className={styles.rarity}>{rarity}</Label>
            <Label className={styles.separator}>|</Label>
            <Label className={styles.category}>{category}</Label>
            <Label className={styles.priceInfo}>{price} 에 구매</Label>
          </div>
          <Label className={styles.owner}>{owner}</Label>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Exchange Message */}
        <div className={styles.exchangeMessage}>{exchangeMessage}</div>
      </div>

      {/* Action Buttons */}
      <div className={styles.buttonContainer}>
        <ResponsiveButton className={styles.declineButton} onClick={onDecline}>
          거절하기
        </ResponsiveButton>
        <ResponsiveButton className={styles.approveButton} onClick={onApprove}>
          승인하기
        </ResponsiveButton>
      </div>
    </div>
  );
}
