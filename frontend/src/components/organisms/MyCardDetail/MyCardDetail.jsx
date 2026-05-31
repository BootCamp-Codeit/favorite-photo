'use client';

import styles from './MyCardDetail.module.css';
import Label from '../../atoms/Label/Label';
import InputLabel from '../../molecules/InputLabel/InputLabel';
import { ButtonPrimary, ButtonSecondary, ResponsiveButton } from '@/components/atoms/Button';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getRarityColor } from '@/constants/rarityColors';

export default function MyCardDetail({
  rarity = 'COMMON',
  category = '풍경',
  owner = '미쓰손',
  maxQuantity = 3,
  initialQuantity = 1,
  price = '',
  onQuantityChange,
  onPriceChange,
}) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [priceValue, setPriceValue] = useState(price);
  const [priceTouched, setPriceTouched] = useState(false);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  useEffect(() => {
    setPriceValue(price);
  }, [price]);

  const isSingleCard = maxQuantity <= 1;

  const handleMinus = () => {
    if (quantity > 1 && !isSingleCard) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      if (onQuantityChange) onQuantityChange(newQuantity);
    }
  };

  const handlePlus = () => {
    if (quantity < maxQuantity && !isSingleCard) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      if (onQuantityChange) onQuantityChange(newQuantity);
    }
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceValue(newPrice);
    if (onPriceChange) onPriceChange(newPrice);
  };

  const handlePriceBlur = () => {
    setPriceTouched(true);
  };

  const parsedPrice = Number(String(priceValue || '').replace(/\D/g, '')) || 0;
  const priceInvalid = priceTouched && (String(priceValue || '').trim() === '' || parsedPrice <= 0);

  return (
    <div className={styles.myCardDetailContainer}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Label
            className={styles.rarity}
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              lineHeight: '100%',
              color: getRarityColor(rarity),
            }}
          >
            {rarity}
          </Label>
          <span className={styles.separator}>|</span>
          <Label
            className={styles.category}
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              lineHeight: '100%',
              color: '#A4A4A4',
            }}
          >
            {category}
          </Label>
        </div>
        <Label className={styles.owner}>{owner}</Label>
      </div>
      <div className={styles.divider}></div>

      {/* Total Sales Quantity Row */}
      <div className={styles.infoRow}>
        <Label className={styles.infoLabel}>총 판매 수량</Label>
        <div className={styles.quantityRightGroup}>
          <div className={styles.quantityControl}>
            <ResponsiveButton
              className={styles.iconButton}
              onClick={handleMinus}
              disabled={quantity <= 1 || isSingleCard}
            >
              <Image
                src="/assets/icons/ic_minus.svg"
                alt="minus"
                width={20}
                height={20}
                className={styles.icon}
              />
            </ResponsiveButton>
            <Label className={styles.quantityValue}>{quantity}</Label>
            <ResponsiveButton
              className={styles.iconButton}
              onClick={handlePlus}
              disabled={quantity >= maxQuantity || isSingleCard}
            >
              <Image
                src="/assets/icons/ic_plus.svg"
                alt="plus"
                width={20}
                height={20}
                className={styles.icon}
              />
            </ResponsiveButton>
          </div>
          <div className={styles.quantityLimit}>
            <Label className={styles.limitText}>/ {maxQuantity}</Label>
            <Label className={styles.maxText}>최대 {maxQuantity}장</Label>
          </div>
        </div>
      </div>

      {/* Price Per Item Row */}
      <div className={styles.infoRow}>
        <Label className={styles.infoLabel}>장당 가격</Label>
        <div className={styles.priceInputWrapper}>
          <div className={styles.priceInputContainer}>
            <InputLabel
              label="P"
              placeholder="숫자만 입력"
              value={priceValue}
              onChange={handlePriceChange}
              onBlur={handlePriceBlur}
              className={styles.priceInputLabel}
            />
          </div>
          {priceInvalid && (
            <span className={styles.priceError} role="alert">
              가격을 입력해 주세요.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
