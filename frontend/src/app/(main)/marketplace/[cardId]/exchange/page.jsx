'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import ExchangeFormContent from './ExchangeFormContent';
import styles from './page.module.css';

const STORAGE_OFFER_KEY = 'marketplace_exchange_offer_card';
const STORAGE_PENDING_KEY = 'marketplace_pending_exchange';

export default function MarketplaceExchangeInputPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = params?.cardId;
  const [exchangeCardData, setExchangeCardData] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? sessionStorage.getItem(STORAGE_OFFER_KEY) : null;
    if (!raw) {
      if (cardId) router.replace(`/marketplace/${cardId}`);
      return;
    }
    try {
      setExchangeCardData(JSON.parse(raw));
    } catch {
      if (cardId) router.replace(`/marketplace/${cardId}`);
    }
    setMounted(true);
  }, [cardId, router]);

  const handleBack = () => {
    if (typeof window !== 'undefined') sessionStorage.removeItem(STORAGE_OFFER_KEY);
    router.push(`/marketplace/${cardId}`);
  };

  const handleCancel = () => {
    handleBack();
  };

  const handleExchange = (payload) => {
    try {
      sessionStorage.setItem(STORAGE_PENDING_KEY, JSON.stringify(payload));
    } catch {}
    sessionStorage.removeItem(STORAGE_OFFER_KEY);
    router.push(`/marketplace/${cardId}`);
  };

  if (!mounted || !exchangeCardData) {
    return null;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={handleBack}
          aria-label="뒤로가기"
        >
          <Image src="/assets/icons/ic_back.svg" alt="뒤로가기" width={22} height={22} />
        </button>
        <h1 className={styles.headerTitle}>포토카드 교환하기</h1>
        <div className={styles.headerSpacer} aria-hidden />
      </div>

      <ExchangeFormContent
        cardData={exchangeCardData}
        onCancel={handleCancel}
        onExchange={handleExchange}
      />
    </div>
  );
}
