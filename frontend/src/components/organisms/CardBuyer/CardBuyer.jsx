'use client';

import styles from './CardBuyer.module.css';
import Image from 'next/image';
import Label from '../../atoms/Label/Label';
import { ButtonBase } from '@/components/atoms/Button';

const RARITY_COLORS = {
  COMMON: '#FFD700',
  RARE: '#60a5fa',
  'SUPER RARE': '#9D4EDD',
  LEGENDARY: '#FF1744',
};

function hasValue(v) {
  return v != null && v !== '';
}

export default function CardBuyer({
  rarity = 'COMMON',
  category = '풍경',
  owner = '미쓰손',
  description = '우리집 앞마당 포토카드입니다. 우리집 앞마당 포토카드입니다. 우리집 앞마당 포토카드입니다.',
  price = '4 P',
  remaining = '2 / 5',
  quantity = 2,
  maxQuantity,
  onQuantityChange,
  totalPrice = '8 P (2장)',
  onPurchase,
}) {
  const hasData = [description, price, rarity].some(hasValue);

  const maxQty = maxQuantity != null ? Number(maxQuantity) : undefined;
  const atMax = maxQty != null && quantity >= maxQty;

  const handleDecrease = () => {
    if (quantity > 1 && onQuantityChange) onQuantityChange(quantity - 1);
  };

  const handleIncrease = () => {
    if (onQuantityChange && !atMax) onQuantityChange(quantity + 1);
  };

  if (!hasData) {
    return (
      <div className={styles.cardBuyerContainer}>
        <div className={styles.cardBuyer}>
          <div className={styles.noData}>no data</div>
        </div>
      </div>
    );
  }

  const rarityColor = RARITY_COLORS[rarity] || '#FFD700';

  return (
    <div className={styles.cardBuyerContainer}>
      <div className={styles.cardBuyer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.rarity} style={{ color: rarityColor }}>
              {rarity}
            </span>
            <span className={styles.separator}>|</span>
            <span className={styles.category}>{category}</span>
          </div>
          <span className={styles.owner}>{owner}</span>
        </div>

        {/* Description */}
        <div className={styles.description}>{description}</div>

        {/* Price and Remaining */}
        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <Label>가격</Label>
            <div className={styles.infoValue}>{price}</div>
          </div>
          <div className={styles.infoItem}>
            <Label>잔여</Label>
            <div className={styles.infoValue}>{remaining}</div>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Purchase Quantity */}
        <div className={styles.quantitySection}>
          <Label>구매수량</Label>
          <div className={styles.quantitySelector}>
            <ButtonBase
              size="xs"
              className={styles.quantityButton}
              onClick={handleDecrease}
              disabled={quantity <= 1}
              aria-label="수량 감소"
            >
              <Image src="/assets/icons/ic_minus.svg" alt="" width={20} height={20} />
            </ButtonBase>

            <div className={styles.quantityValue}>{quantity}</div>

            <ButtonBase
              size="xs"
              className={styles.quantityButton}
              onClick={handleIncrease}
              disabled={atMax}
              aria-label="수량 증가"
            >
              <Image src="/assets/icons/ic_plus.svg" alt="" width={20} height={20} />
            </ButtonBase>
          </div>
        </div>

        {/* Total Price */}
        <div className={styles.totalPriceSection}>
          <Label>총 가격</Label>
          <div className={styles.totalPriceValue}>{totalPrice}</div>
        </div>

        {/* Purchase Button */}
        <button type="button" className={styles.purchaseButton} onClick={onPurchase}>
          포토카드 구매하기
        </button>
      </div>
    </div>
  );
}
