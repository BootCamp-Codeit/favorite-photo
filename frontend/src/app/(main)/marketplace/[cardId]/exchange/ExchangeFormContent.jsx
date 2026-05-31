'use client';

import { useState } from 'react';
import MyCard from '@/components/organisms/MyCard/MyCard';
import TextBox from '@/components/atoms/TextBox/TextBox';
import { ButtonPrimary } from '@/components/atoms/Button';
import styles from './page.module.css';

/**
 * Reusable exchange form body (card title + MyCard + proposal text + buttons).
 * Used by the full exchange page and by the bottom sheet modal on tablet/mobile.
 */
export default function ExchangeFormContent({ cardData, onCancel, onExchange }) {
  const [exchangeMessage, setExchangeMessage] = useState('');

  const handleSubmit = () => {
    if (!cardData) return;
    onExchange({
      ...cardData,
      proposalMessage: exchangeMessage,
      purchaseInfo: `${cardData.price}에 구매`,
      id: cardData.id || Date.now(),
    });
    setExchangeMessage('');
  };

  if (!cardData) return null;

  return (
    <div className={styles.content}>
      <div className={styles.cardTitleBox}>
        <h2
          className={styles.cardTitle}
          style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontWeight: 700,
            fontStyle: 'normal',
            fontSize: '40px',
            lineHeight: '100%',
            color: '#ffffff',
            margin: 0,
            paddingBottom: '20px',
          }}
        >
          {cardData.description || "How Far I'll Go"}
        </h2>
      </div>

      <div className={styles.mainContentArea}>
        <div className={styles.leftColumn}>
          <MyCard
            rarity={cardData.rarity || 'SUPER RARE'}
            category={cardData.category || '풍경'}
            owner={cardData.owner || '랍스타'}
            description={cardData.description || "How Far I'll Go"}
            price={cardData.price || '4 P'}
            quantity={cardData.quantity ?? 2}
            imageSrc={cardData.imageSrc || '/assets/products/photo-card-tree-with-lake.svg'}
          />
        </div>

        <div className={styles.rightColumn}>
          <h3 className={styles.proposalTitle}>교환 제시 내용</h3>
          <TextBox
            label=""
            value={exchangeMessage}
            placeholder="내용을 입력해 주세요"
            onChange={setExchangeMessage}
            className={styles.proposalTextBox}
            wrapperStyle={{ width: '100%', gap: 0 }}
            textareaStyle={{ width: '100%', minHeight: '200px' }}
          />
          <div className={styles.actionButtons}>
            <ButtonPrimary onClick={onCancel} className={styles.cancelButton}>
              취소하기
            </ButtonPrimary>
            <ButtonPrimary onClick={handleSubmit} className={styles.exchangeButton}>
              교환하기
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  );
}
