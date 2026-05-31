'use client';
import styles from './MyCard.module.css';
import Image from 'next/image';
import Label from '../../atoms/Label/Label';
// import logo from '../../../../public/assets/icons/logos/logo.svg';
// import photoCardSoldout from '../../../../public/assets/products/photo-card-soldout.svg';

export default function MyCard({
  rarity = 'COMMON',
  category = '풍경',
  owner = '랍스타타',
  description = "How Far I'll Go",
  price = '4 P',
  quantity = 1,
  imageSrc = '/assets/products/photo-card-mycard.svg',
  imageWidth = 400,
  imageHeight = 400,
  onClick,
}) {
  return (
    <div
      className={styles.myCard}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
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
        <div className={styles.title}>{description}</div>

        {/* Metadata */}
        <div className={styles.metadata}>
          <div className={styles.metadataLeft}>
            <Label className={styles.rarity}>{rarity}</Label>
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
            <Label className={styles.infoLabel}>수량</Label>
            <div className={styles.infoValue}>
              <Label className={styles.quantity}>{quantity}</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Logo */}
      <div className={styles.footer}>
        <span className={styles.logo}>
          <Image
            src="/assets/logos/logo.svg"
            alt="Logo"
            width={100}
            height={100}
            className={styles.logo}
          />
        </span>
      </div>
    </div>
  );
}
