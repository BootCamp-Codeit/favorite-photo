'use client';

import { useState } from 'react';
import Modal from '@/components/atoms/Modal/Modal';
import MyCard from '@/components/organisms/MyCard/MyCard';
import TextBox from '@/components/atoms/TextBox/TextBox';
import { ButtonPrimary } from '@/components/atoms/Button';
import styles from './CardExchangeModal.module.css';

export default function CardExchangeModal({
  open,
  onClose,
  targetCardData,
  exchangeCardData,
  onExchangeSuccess,
}) {
  const [exchangeMessage, setExchangeMessage] = useState('');

  const handleCancel = () => {
    setExchangeMessage('');
    onClose();
  };

  const handleExchange = () => {
    // 교환 제시 로직 처리
    if (onExchangeSuccess && exchangeCardData) {
      onExchangeSuccess({
        ...exchangeCardData,
        proposalMessage: exchangeMessage,
        purchaseInfo: `${exchangeCardData.price}에 구매`,
      });
    }
    setExchangeMessage('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="custom">
      <div className={styles.exchangeModalContainer}>
        {/* Desktop: Header with title */}
        <div className={styles.header}>
          <h2 className={styles.modalTitle}>포토카드 교환하기</h2>
        </div>

        {/* Tablet/Mobile: Top handle – click to close modal */}
        {onClose && (
          <button type="button" className={styles.topHandle} onClick={onClose} aria-label="닫기">
            <span className={styles.handleBar} aria-hidden />
          </button>
        )}

        {/* Scrollable content area */}
        <div className={styles.scrollableContent}>
          {/* Card Title Section */}
          <div className={styles.cardTitleBox}>
            <h1
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
              {targetCardData?.description || "How Far I'll Go"}
            </h1>
          </div>

          {/* Main Content Area (Two-Column Layout) */}
          <div className={styles.mainContentArea}>
            {/* Left Column - MyCard Component */}
            <div className={styles.leftColumn}>
              <MyCard
                rarity={exchangeCardData?.rarity || 'SUPER RARE'}
                category={exchangeCardData?.category || '풍경'}
                owner={exchangeCardData?.owner || '랍스타'}
                description={exchangeCardData?.description || "How Far I'll Go"}
                price={exchangeCardData?.price || '4 P'}
                quantity={exchangeCardData?.quantity || 2}
                imageSrc={
                  exchangeCardData?.imageSrc || '/assets/products/photo-card-tree-with-lake.svg'
                }
                imageWidth={302}
                imageHeight={226}
              />
            </div>

            {/* Right Column - Exchange Proposal Input */}
            <div className={styles.rightColumn}>
              <h3 className={styles.proposalTitle}>교환 제시 내용</h3>
              <TextBox
                label=""
                value={exchangeMessage}
                placeholder="내용을 입력해 주세요"
                onChange={setExchangeMessage}
                className={styles.proposalTextBox}
                wrapperStyle={{ width: '100%', gap: 0 }}
                textareaStyle={{ width: '342px', minHeight: '153px', height: '153px' }}
              />

              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                <button type="button" onClick={handleCancel} className={styles.cancelButton}>
                  취소하기
                </button>
                <button type="button" onClick={handleExchange} className={styles.exchangeButton}>
                  교환하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
