'use client';

import Image from 'next/image';
import { ICONS } from '@/constants/icons';
import Dropdown from '@/components/atoms/DropDown/DropDown';

const GRADE_OPTIONS = [
  { label: '등급', value: 'ALL' },
  { label: 'COMMON', value: 'COMMON' },
  { label: 'RARE', value: 'RARE' },
  { label: 'SUPER RARE', value: 'SUPER RARE' },
  { label: 'LEGENDARY', value: 'LEGENDARY' },
];

const GENRE_OPTIONS = [
  { label: '장르', value: 'ALL' },
  { label: '풍경', value: '풍경' },
  { label: '여행', value: '여행' },
  { label: '인물', value: '인물' },
  { label: '동물', value: '동물' },
];

// ✅ 판매 페이지에서만 쓰는 옵션
const SELL_METHOD_OPTIONS = [
  { label: '판매방법', value: 'ALL' },
  { label: '판매', value: 'SELL' },
  { label: '교환', value: 'TRADE' },
];

const SOLD_OUT_OPTIONS = [
  { label: '매진여부', value: 'ALL' },
  { label: '매진', value: 'SOLD_OUT' },
  { label: '판매중', value: 'ON_SALE' },
];

function pickValue(eOrValue) {
  if (typeof eOrValue === 'string') return eOrValue;
  return (
    eOrValue?.target?.value ??
    eOrValue?.currentTarget?.value ??
    eOrValue?.target?.dataset?.value ??
    eOrValue?.currentTarget?.dataset?.value
  );
}

export default function MyGalleryFilterBar({
  isMobile,
  search,
  onChangeSearch,

  grade,
  onChangeGrade,
  genre,
  onChangeGenre,

  // ✅ 추가: selling 페이지에서만 true로 넘기면 됨 (기본 false)
  showExtraFilters = false,

  // ✅ extra 필터 props (selling 페이지에서만 전달해도 됨)
  sellMethod,
  onChangeSellMethod,
  soldOut,
  onChangeSoldOut,

  onOpenMobileFilter,
}) {
  const handleGradeChange = (eOrValue) => {
    const next = pickValue(eOrValue);
    if (next == null) return;
    onChangeGrade(next);
  };

  const handleGenreChange = (eOrValue) => {
    const next = pickValue(eOrValue);
    if (next == null) return;
    onChangeGenre(next);
  };

  const handleSellMethodChange = (eOrValue) => {
    const next = pickValue(eOrValue);
    if (next == null) return;
    onChangeSellMethod?.(next);
  };

  const handleSoldOutChange = (eOrValue) => {
    const next = pickValue(eOrValue);
    if (next == null) return;
    onChangeSoldOut?.(next);
  };

  // =====================
  // Mobile
  // =====================
  if (isMobile) {
    return (
      <div className="mt-[16px] flex items-center gap-[12px]">
        <button
          type="button"
          onClick={onOpenMobileFilter}
          aria-label="필터 열기"
          className="w-[50px] h-[50px] flex items-center justify-center border border-white/40 rounded-[6px]"
        >
          <Image src={ICONS.DROPDOWN} alt="" width={24} height={24} />
        </button>

        <div className="flex-1 h-[50px] flex items-center px-[16px] border border-white/40 rounded-[6px]">
          <input
            value={search}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="검색"
            className="w-full bg-transparent outline-none text-white placeholder:text-white/40"
          />
          <Image src="/assets/icons/ic_search.svg" alt="검색" width={24} height={24} />
        </div>
      </div>
    );
  }

  // =====================
  // Desktop / Tablet
  // =====================
  return (
    <div className="mt-[30px] flex items-center">
      {/* 검색 */}
      <div className="w-[320px] h-[50px] shrink-0 flex items-center px-[20px] border border-white/40 rounded-[6px]">
        <input
          value={search}
          onChange={(e) => onChangeSearch(e.target.value)}
          placeholder="검색"
          className="w-full bg-transparent outline-none text-white placeholder:text-white/40"
        />
        <Image src="/assets/icons/ic_search.svg" alt="검색" width={24} height={24} />
      </div>

      {/* 간격 60px */}
      <div className="w-[60px] shrink-0" />

      {/* 드롭다운 */}
      <div className="flex items-center gap-[10px]">
        {/* 등급 */}
        <div className="w-[120px] h-[50px] shrink-0">
          <Dropdown
            label="등급"
            value={grade}
            options={GRADE_OPTIONS}
            onChange={handleGradeChange}
          />
        </div>

        {/* 장르 */}
        <div className="w-[128px] h-[50px] shrink-0">
          <Dropdown
            label="장르"
            value={genre}
            options={GENRE_OPTIONS}
            onChange={handleGenreChange}
          />
        </div>

        {/* ✅ selling 페이지에서만 노출 */}
        {showExtraFilters && (
          <>
            <div className="w-[140px] h-[50px] shrink-0">
              <Dropdown
                label="판매방법"
                value={sellMethod ?? 'ALL'}
                options={SELL_METHOD_OPTIONS}
                onChange={handleSellMethodChange}
              />
            </div>

            <div className="w-[140px] h-[50px] shrink-0">
              <Dropdown
                label="매진여부"
                value={soldOut ?? 'ALL'}
                options={SOLD_OUT_OPTIONS}
                onChange={handleSoldOutChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
