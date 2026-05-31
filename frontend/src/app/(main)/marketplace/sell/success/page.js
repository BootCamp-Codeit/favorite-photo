'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ButtonPrimary, ButtonSecondary, ResponsiveButton } from '@/components/atoms/Button';
import styles from './page.module.css';

const STORAGE_SELL_SUCCESS = 'marketplace_sell_success_data';

export default function MarketplaceSellSuccessPage({ onButtonClick, cardData: cardDataProp }) {
  const router = useRouter();
  const [cardData, setCardData] = useState(cardDataProp ?? null);

  useEffect(() => {
    if (cardDataProp) return;
    try {
      const raw = sessionStorage.getItem(STORAGE_SELL_SUCCESS);
      if (raw) setCardData(JSON.parse(raw));
    } catch {}
  }, [cardDataProp]);

  const quantity = cardData?.quantity ?? cardData?.initialQuantity ?? 1;
  const rarity = cardData?.rarity ?? cardData?.grade ?? 'LEGENDARY';
  const title = cardData?.title ?? cardData?.description ?? '우리집 앞마당';

  const handleClick = () => {
    try {
      sessionStorage.removeItem(STORAGE_SELL_SUCCESS);
    } catch {}
    if (onButtonClick) onButtonClick();
    else router.push('/marketplace');
  };

  return (
    <div className={styles.successContainer}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          판매 등록 <span className={styles.highlight}>성공</span>
        </h1>
        <p className={styles.description}>
          [{rarity} | {title}] {quantity}장 판매 등록에 성공했습니다!
        </p>
        <div className={styles.buttonContainer}>
          <ResponsiveButton onClick={handleClick} className={styles.button}>
            나의 판매 포토카드에서 확인하기
          </ResponsiveButton>
        </div>
      </div>
    </div>
  );
}
