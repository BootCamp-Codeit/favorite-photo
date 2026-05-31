'use client';

import styles from './CardSeller.module.css';
import Image from 'next/image';
import Label from '../../atoms/Label/Label';
import RefreshIcon from '../../../../public/assets/icons/ic_refresh.svg';

export default function CardSeller({
  rarity,
  category,
  owner,
  description,
  price,
  remaining,
  outof,
  secondRarity,
  secondCategory,
  secondDescription,
  onEdit,
  onTakeDown,
}) {
  return (
    <div className={styles.cardSellerContainer}>
      <div className={styles.cardSeller}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span
              className={styles.rarity}
              style={{
                color:
                  rarity === 'LEGENDARY'
                    ? '#FF0000'
                    : rarity === 'SUPER RARE'
                      ? '#9D4EDD'
                      : rarity === 'RARE'
                        ? '#60a5fa'
                        : '#FFD700',
              }}
            >
              {rarity}
            </span>
            <span className={styles.separator}>|</span>
            <span className={styles.category}>{category}</span>
          </div>
          <span className={styles.owner}>{owner}</span>
        </div>

        {/* Description */}
        <div className={styles.description}>{description}</div>

        <div className={styles.divider}></div>

        {/* Price and Remaining */}
        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <label className={styles.infoItemLabel}>가격</label>
            <div className={styles.infoValue}>{price}</div>
          </div>
          <div className={styles.infoItem}>
            <label className={styles.infoItemLabel}>잔여</label>
            <div className={styles.infoValue}>
              <span className={styles.remaining}>{remaining}</span>
              <span className={styles.outof}> / {outof}</span>
            </div>
          </div>
        </div>

        {/* Exchange Wish Info */}
        <div className={styles.exchangeWishBox}>
          <Image src={RefreshIcon} alt="exchange" width={28} height={28} />
          <span className={styles.exchangeWishText}>교환 희망 정보</span>
        </div>

        <div className={styles.divider}></div>

        {/* Second Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.secondRarity}>{secondRarity}</span>
            <span className={styles.separator}>|</span>
            <span className={styles.category}>{secondCategory}</span>
          </div>
        </div>
        <div className={styles.divider}></div>

        {/* Second Description */}
        <div className={styles.wishDescription}>{secondDescription}</div>

        {/* Action Buttons */}
        <button className={styles.editButton} onClick={onEdit}>
          수정하기
        </button>
        <button className={styles.takeDownButton} onClick={onTakeDown}>
          판매 내리기
        </button>
      </div>
    </div>
  );
}
