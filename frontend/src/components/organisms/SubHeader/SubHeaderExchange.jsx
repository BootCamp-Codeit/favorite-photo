'use client';

import { useState } from 'react';
import Image from 'next/image';
import InputSearch from '@/components/molecules/InputSearch/InputSearch';
import FilterBottomSheet from './FilterBottomSheet';
import styles from './SubHeaderExchange.module.css';

export default function SubHeaderExchange({
  subtitle = '마이갤러리',
  title = '포토카드 교환하기',
  search,
  onSearchChange,
  filters = { rarity: 'all', genre: 'all', soldout: 'all' },
  onFiltersChange,
  cards = [],
  onClose,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterApply = (next) => {
    onFiltersChange?.(next);
    setIsFilterOpen(false);
  };

  return (
    <div className={styles.subHeaderExchange}>
      {/* Mobile: Top handle (replaces title + close) – click to close modal */}
      {onClose && (
        <button
          type="button"
          className={styles.mobileTopHandle}
          onClick={onClose}
          aria-label="닫기"
        >
          <span className={styles.handleBar} aria-hidden />
        </button>
      )}

      {/* Subtitle */}
      <div className={styles.subtitleBox}>
        <h2 className={styles.subtitle}>{subtitle}</h2>
      </div>

      {/* Main Title */}
      <div className={styles.titleBox}>
        <h1 className={styles.mainTitle}>{title}</h1>
      </div>

      {/* Filter and Search Section */}
      <div className={styles.filterSection}>
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className={styles.filterIconBtn}
          aria-label="필터"
        >
          <Image
            src="/assets/icons/ic_dropdown.svg"
            alt="필터"
            width={48}
            height={48}
            className={styles.filterIcon}
          />
        </button>
        <div className={styles.searchWrap}>
          <InputSearch
            placeholder="검색"
            value={search}
            onChange={onSearchChange}
            onClick={() => {}}
            fullWidth
            className={styles.searchInput}
          />
        </div>
      </div>

      <FilterBottomSheet
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialRarity={filters.rarity}
        initialGenre={filters.genre}
        initialSoldout={filters.soldout}
        onApply={handleFilterApply}
        cards={cards}
      />
    </div>
  );
}
