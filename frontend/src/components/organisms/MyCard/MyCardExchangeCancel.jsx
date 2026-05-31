'use client';
import styles from './MyCardExchangeCancel.module.css';
import Image from 'next/image';
import Label from '../../atoms/Label/Label';
import { ButtonPrimary } from '@/components/atoms/Button';
import { getRarityColor } from '@/constants/rarityColors';

export default function MyCardExchangeCancel({
  rarity = 'COMMON',
  category = '풍경',
  owner = '유디',
  description = '스페인 여행',
  price = '4 P',
  purchaseInfo = '4 P에 구매',
  proposalMessage = '',
  imageSrc = '/assets/products/photo-card-spain.svg',
  imageWidth = 400,
  imageHeight = 400,
  onCancel,
}) {
  return (
    <div className={styles.myCardExchangeCancel}>
      {/* Image Section */}
      <div className={styles.imageContainer}>
        <Image
          src={imageSrc}
          alt="Photo Card"
          width={imageWidth}
          height={imageHeight}
          className={styles.myCardImage}
        />
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Title */}
        <h1 className={styles.title}>{description}</h1>

        {/* Metadata */}
        <div className={styles.metadata}>
          <div className={styles.metadataLeft}>
            <Label className={styles.rarity} style={{ color: getRarityColor(rarity) }}>
              {rarity}
            </Label>
            <Label className={styles.separator}>|</Label>
            <Label className={styles.category}>{category}</Label>
            <Label className={styles.separator}>|</Label>
            <Label className={styles.purchaseInfo}>{purchaseInfo}</Label>
          </div>
          <Label className={styles.owner}>{owner}</Label>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Proposal Message */}
        {proposalMessage && <div className={styles.proposalMessage}>{proposalMessage}</div>}

        {/* Cancel Button */}
        <ButtonPrimary onClick={onCancel} className={styles.cancelButton}>
          취소하기
        </ButtonPrimary>
      </div>
    </div>
  );
}
