'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Title from '@/components/atoms/Title/Title';
import { ButtonPrimary, ButtonSecondary, ResponsiveButton } from '@/components/atoms/Button';
import DropDown from '@/components/atoms/DropDown/DropDown';
import InputSearch from '@/components/molecules/InputSearch/InputSearch';
import FilterBottomSheet from './FilterBottomSheet';
import styles from './SubHeader.module.css';

export default function SubHeader({
  onSellClick,
  filters: controlledFilters,
  onFiltersChange,
  cards = [],
}) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('lowPrice');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [internalFilters, setInternalFilters] = useState({
    rarity: 'all',
    genre: 'all',
    soldout: 'all',
  });

  const isControlled = controlledFilters != null;
  const filters = isControlled ? controlledFilters : internalFilters;
  const rarity = filters.rarity ?? 'all';
  const genre = filters.genre ?? 'all';
  const soldout = filters.soldout ?? 'all';

  const setFilters = (next) => {
    if (isControlled) {
      onFiltersChange?.(typeof next === 'function' ? next(filters) : next);
    } else {
      setInternalFilters(typeof next === 'function' ? next(filters) : next);
    }
  };

  const rarityOptions = useMemo(
    () => [
      { value: 'all', label: '등급' },
      { value: 'common', label: 'COMMON' },
      { value: 'rare', label: 'RARE' },
      { value: 'superRare', label: 'SUPER RARE' },
      { value: 'legendary', label: 'LEGENDARY' },
    ],
    [],
  );

  const genreOptions = useMemo(
    () => [
      { value: 'all', label: '장르' },
      { value: '풍경', label: '풍경' },
      { value: '여행', label: '여행' },
      { value: 'portrait', label: '인물' },
      { value: 'animal', label: '동물' },
    ],
    [],
  );

  const soldoutOptions = useMemo(
    () => [
      { value: 'all', label: '매진여부' },
      { value: 'soldout', label: '매진' },
      { value: 'available', label: '판매중' },
    ],
    [],
  );

  const sortOptions = useMemo(
    () => [
      { value: 'lowPrice', label: '낮은 가격순' },
      { value: 'highPrice', label: '높은 가격순' },
      { value: 'newest', label: '최신순' },
    ],
    [],
  );

  const handleFilterApply = (next) => {
    setFilters?.(next);
    setIsFilterOpen(false);
  };

  return (
    <section className="w-full bg-black text-white">
      {/* Desktop (>= 500px) */}
      <div className={styles.desktop}>
        <div className="mx-auto w-full max-w-[1280px] px-5 pt-10">
          <div className={`flex items-center justify-between ${styles.titleButtonRow}`}>
            <div className={styles.titleWrap}>
              <Title text="마켓플레이스" as="h1" showLine={false} />
            </div>
            <div className={styles.sellBtnWrap}>
              <ResponsiveButton onClick={onSellClick} className={styles.sellBtn}>
                나의 포토카드 판매하기
              </ResponsiveButton>
            </div>
          </div>
          <div
            style={{
              marginTop: '12px',
              marginBottom: '6px',
              width: '100%',
              borderTop: '2px solid #EEEEEE',
            }}
          />
          <div className={`mt-5 ${styles.desktopFilterArea}`}>
            <div className={styles.desktopSearchWrap}>
              <InputSearch
                placeholder="검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={() => {}}
                fullWidth
              />
            </div>
            <div className={styles.desktopDropdownsRow}>
              <div className={styles.desktopDropdownItem}>
                <DropDown
                  options={rarityOptions}
                  value={rarity}
                  onChange={(e) => setFilters({ ...filters, rarity: e.target.value })}
                />
              </div>
              <div className={styles.desktopDropdownItem}>
                <DropDown
                  options={genreOptions}
                  value={genre}
                  onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                />
              </div>
              <div className={styles.desktopDropdownItem}>
                <DropDown
                  options={soldoutOptions}
                  value={soldout}
                  onChange={(e) => setFilters({ ...filters, soldout: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.desktopSortWrap}>
              <DropDown
                options={sortOptions}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{ border: '2px solid #DDDDDD' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile (<= 499px): 검색 full width, divider, 필터 아이콘 + 정렬, 하단 고정 판매 버튼 */}
      <div className={styles.mobile}>
        <div className={styles.mobileSearchWrap} style={{ padding: '11px 20px' }}>
          <InputSearch
            className={styles.mobileSearchInput}
            placeholder="검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => {}}
            fullWidth
          />
        </div>
        <span className={styles.divider} />
        <div className={styles.mobileFilterRow} style={{ padding: '12px 20px' }}>
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
          <div className={styles.sortWrap}>
            <DropDown
              options={sortOptions}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ border: '2px solid #DDDDDD' }}
            />
          </div>
        </div>
        <div className={styles.fixedBottom}>
          <ResponsiveButton onClick={onSellClick} className={styles.sellBtnFixed}>
            나의 포토카드 판매하기
          </ResponsiveButton>
        </div>
      </div>

      <FilterBottomSheet
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialRarity={rarity}
        initialGenre={genre}
        initialSoldout={soldout}
        onApply={handleFilterApply}
        cards={cards}
      />
    </section>
  );
}
