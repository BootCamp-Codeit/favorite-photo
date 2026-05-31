'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from '@/components/atoms/Modal/Modal';
import MyCardDetail from '@/components/organisms/MyCardDetail/MyCardDetail';
import DropDown from '@/components/atoms/DropDown/DropDown';
import TextBox from '@/components/atoms/TextBox/TextBox';
import { ButtonPrimary, ButtonSecondary, ResponsiveButton } from '@/components/atoms/Button';
import styles from './OpenModal.module.css';

export default function OpenModal({ open, onClose, cardData, mode = 'edit', onSellSuccess }) {
  const extractPrice = (priceStr) => {
    if (!priceStr) return '';
    const match = priceStr.match(/(\d+)/);
    return match ? match[1] : '';
  };

  const [quantity, setQuantity] = useState(cardData?.initialQuantity || 1);
  const [price, setPrice] = useState(extractPrice(cardData?.price) || '');
  const [grade, setGrade] = useState(cardData?.grade || 'COMMON');
  const [genre, setGenre] = useState(cardData?.genre || '풍경');
  const [description, setDescription] = useState(cardData?.exchangeDescription || '');

  useEffect(() => {
    if (cardData) {
      setQuantity(cardData.initialQuantity || 1);
      setPrice(extractPrice(cardData.price) || '');
      setGrade(cardData.grade || 'COMMON');
      setGenre(cardData.genre || '풍경');
      setDescription(cardData.exchangeDescription || '');
    }
  }, [cardData]);

  const gradeOptions = [
    { value: 'COMMON', label: 'COMMON' },
    { value: 'RARE', label: 'RARE' },
    { value: 'SUPER RARE', label: 'SUPER RARE' },
    { value: 'LEGENDARY', label: 'LEGENDARY' },
  ];

  const genreOptions = [
    { value: '풍경', label: '풍경' },
    { value: '인물', label: '인물' },
    { value: '음식', label: '음식' },
    { value: '동물', label: '동물' },
  ];

  const handleSave = () => {
    if (mode === 'sell') {
      if (onSellSuccess) {
        onSellSuccess({
          ...cardData,
          quantity,
          rarity: grade,
          title: cardData?.title || '우리집 앞마당',
        });
      }
    } else {
      console.log('Save clicked', { quantity, price, grade, genre, description, mode });
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const modalTitle = mode === 'sell' ? '나의 포토카드 판매하기' : '수정하기';
  const saveButtonText = mode === 'sell' ? '판매하기' : '수정하기';

  return (
    <Modal open={open} onClose={onClose} size="custom">
      <div className={styles.openModalContainer}>
        <div className={styles.header}>
          <h2 className={styles.modalTitle}>{modalTitle}</h2>
        </div>

        <div className={styles.scrollableContent}>
          <div className={styles.cardTitleBox}>
            <h1 className={styles.cardTitle}>{cardData?.title || '우리집 앞마당'}</h1>
          </div>

          {/* 1. Photo first, then Details below (stacked) */}
          <div className={styles.photoAndDetailsSection}>
            <div className={styles.photoSection}>
              <Image
                src={cardData?.imageSrc || '/assets/products/photo-card.svg'}
                alt={cardData?.title || '포토카드'}
                width={480}
                height={360}
                className={styles.photoImage}
              />
            </div>
            <div className={styles.detailsSection}>
              <MyCardDetail
                rarity={cardData?.rarity || 'LEGENDARY'}
                category={cardData?.category || '풍경'}
                owner={cardData?.owner || '유디'}
                maxQuantity={cardData?.maxQuantity || 3}
                initialQuantity={quantity}
                price={price}
                onQuantityChange={setQuantity}
                onPriceChange={setPrice}
              />
            </div>
          </div>

          <div className={styles.cardTitleBox}>
            <h1 className={styles.cardTitle}>교환 희망 정보</h1>
          </div>

          {/* 2. Grade first, then Genre below (stacked) */}
          <div className={styles.gradeGenreSection}>
            <div className={styles.gradeSection}>
              <h3 className={styles.sectionTitle}>등급</h3>
              <DropDown
                options={gradeOptions}
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
            </div>
            <div className={styles.genreSection}>
              <h3 className={styles.sectionTitle}>장르</h3>
              <DropDown
                options={genreOptions}
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.descriptionSection}>
            <h3 className={styles.sectionTitle}>교환 희망 설명</h3>
            <TextBox value={description} placeholder="--- ---" onChange={setDescription} />
          </div>

          <span className={styles.divider} />

          <div className={styles.actionButtons}>
            <ResponsiveButton onClick={handleCancel} className={styles.cancelButton}>
              취소
            </ResponsiveButton>
            <ResponsiveButton onClick={handleSave} className={styles.saveButton}>
              {saveButtonText}
            </ResponsiveButton>
          </div>
        </div>
      </div>
    </Modal>
  );
}
