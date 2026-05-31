'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Modal from '@/components/atoms/Modal/Modal';
import { ButtonPrimary, ButtonSecondary, ResponsiveButton } from '@/components/atoms/Button';
import styles from './FilterBottomSheet.module.css';
import { RARITY_COLORS } from '@/constants/rarityColors';

const GENRE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: '풍경', label: '풍경' },
  { value: '여행', label: '여행' },
  { value: '인물', label: '인물' },
  { value: '동물', label: '동물' },
];

const SOLD_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'soldout', label: '매진' },
  { value: 'available', label: '판매중' },
];

function countByGrade(cards) {
  const map = { COMMON: 0, RARE: 0, 'SUPER RARE': 0, LEGENDARY: 0 };
  cards.forEach((c) => {
    if (map[c.rarity] !== undefined) map[c.rarity]++;
  });
  return map;
}

function countByGenre(cards) {
  const map = {};
  cards.forEach((c) => {
    map[c.category] = (map[c.category] || 0) + 1;
  });
  return map;
}

function countSold(cards) {
  let sold = 0;
  let available = 0;
  cards.forEach((c) =>
    c.status === 'SOLD_OUT' || c.remaining === 0 ? sold++ : available++,
  );
  return { soldout: sold, available };
}

export default function FilterBottomSheet({
  open,
  onClose,
  initialRarity = 'all',
  initialGenre = 'all',
  initialSoldout = 'all',
  onApply,
  cards = [],
}) {
  const [activeTab, setActiveTab] = useState('grade');
  const [rarity, setRarity] = useState(initialRarity);
  const [genre, setGenre] = useState(initialGenre);
  const [soldout, setSoldout] = useState(initialSoldout);

  useEffect(() => {
    if (open) {
      setRarity(initialRarity);
      setGenre(initialGenre);
      setSoldout(initialSoldout);
    }
  }, [open, initialRarity, initialGenre, initialSoldout]);

  const gradeCounts = useMemo(() => countByGrade(cards), [cards]);
  const genreCounts = useMemo(() => countByGenre(cards), [cards]);
  const soldCounts = useMemo(() => countSold(cards), [cards]);

  const rarityToCard = {
    common: 'COMMON',
    rare: 'RARE',
    superRare: 'SUPER RARE',
    legendary: 'LEGENDARY',
  };
  const filteredCount = useMemo(() => {
    return cards.filter((c) => {
      if (rarity !== 'all') {
        const r = rarityToCard[rarity];
        if (r && c.rarity !== r) return false;
      }
      if (genre !== 'all' && c.category !== genre) return false;
      if (soldout === 'soldout' && c.status !== 'SOLD_OUT' && c.remaining > 0) return false;
      if (soldout === 'available' && (c.status === 'SOLD_OUT' || c.remaining === 0)) return false;
      return true;
    }).length;
  }, [cards, rarity, genre, soldout]);

  const handleApply = () => {
    onApply?.({ rarity, genre, soldout });
    onClose?.();
  };

  const handleReset = () => {
    setRarity('all');
    setGenre('all');
    setSoldout('all');
  };

  const gradeOptionsWithCount = [
    { value: 'all', label: '전체', count: cards.length },
    { value: 'common', label: 'COMMON', count: gradeCounts.COMMON ?? 0 },
    { value: 'rare', label: 'RARE', count: gradeCounts.RARE ?? 0 },
    { value: 'superRare', label: 'SUPER RARE', count: gradeCounts['SUPER RARE'] ?? 0 },
    { value: 'legendary', label: 'LEGENDARY', count: gradeCounts.LEGENDARY ?? 0 },
  ];

  const genreOptionsWithCount = [
    { value: 'all', label: '전체', count: cards.length },
    ...Object.entries(genreCounts).map(([value, count]) => ({ value, label: value, count })),
  ];

  const soldOptionsWithCount = [
    { value: 'all', label: '전체', count: cards.length },
    { value: 'soldout', label: '매진', count: soldCounts.soldout },
    { value: 'available', label: '판매중', count: soldCounts.available },
  ];

  return (
    <Modal open={open} onClose={onClose} size="bottomSheet" showCloseButton={false}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <h2 className={styles.sheetTitle}>필터</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'grade' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('grade')}
          >
            등급
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'genre' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('genre')}
          >
            장르
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'soldout' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('soldout')}
          >
            매진 여부
          </button>
        </div>

        <div className={styles.options}>
          {activeTab === 'grade' &&
            gradeOptionsWithCount.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={styles.optionRow}
                onClick={() => setRarity(opt.value)}
              >
                <span
                  className={styles.optionLabel}
                  style={{
                    color: opt.value === 'all' ? '#fff' : RARITY_COLORS[opt.label] || '#fff',
                  }}
                >
                  {opt.label}
                </span>
                <span className={styles.optionCount}>{opt.count}개</span>
              </button>
            ))}
          {activeTab === 'genre' &&
            genreOptionsWithCount.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={styles.optionRow}
                onClick={() => setGenre(opt.value)}
              >
                <span className={styles.optionLabel}>{opt.label}</span>
                <span className={styles.optionCount}>{opt.count}개</span>
              </button>
            ))}
          {activeTab === 'soldout' &&
            soldOptionsWithCount.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={styles.optionRow}
                onClick={() => setSoldout(opt.value)}
              >
                <span className={styles.optionLabel}>{opt.label}</span>
                <span className={styles.optionCount}>{opt.count}개</span>
              </button>
            ))}
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.refreshBtn}
            onClick={handleReset}
            aria-label="초기화"
          >
            <Image src="/assets/icons/ic_refresh.svg" alt="초기화" width={24} height={24} />
          </button>
          <ResponsiveButton onClick={handleApply} className={styles.applyBtn}>
            {filteredCount}개 포토보기
          </ResponsiveButton>
        </div>
      </div>
    </Modal>
  );
}
