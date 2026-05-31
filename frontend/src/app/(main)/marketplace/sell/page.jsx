'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CardSellingForm from '@/components/organisms/CardSellingForm/CardSellingForm';
import styles from './page.module.css';

const STORAGE_SELL_CARD = 'marketplace_sell_card';
const STORAGE_SELL_SUCCESS = 'marketplace_sell_success_data';

export default function MarketplaceSellPage() {
  const router = useRouter();
  const [cardData, setCardData] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? sessionStorage.getItem(STORAGE_SELL_CARD) : null;
    if (!raw) {
      router.replace('/marketplace');
      return;
    }
    try {
      const data = JSON.parse(raw);
      setCardData(data);
    } catch {
      router.replace('/marketplace');
    }
    setMounted(true);
  }, [router]);

  const handleBack = () => {
    if (typeof window !== 'undefined') sessionStorage.removeItem(STORAGE_SELL_CARD);
    router.push('/marketplace');
  };

  const handleSuccess = (payload) => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_SELL_CARD);
    }
    router.push('/marketplace/sell/success');
  };

  if (!mounted || !cardData) {
    return null;
  }

  return (
    <div className={styles.pageContainer}>
      <CardSellingForm
        cardData={cardData}
        onBack={handleBack}
        onSuccess={handleSuccess}
        isInModal={false}
      />
    </div>
  );
}
