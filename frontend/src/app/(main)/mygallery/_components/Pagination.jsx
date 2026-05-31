'use client';

import Image from 'next/image';
import { ICONS } from '@/constants/icons';

export default function Pagination({ currentPage, totalPages, onChange, className = '' }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  // ✅ 혹시 모르니까 스타일용 클래스 남겨둠
  const pageBtnBase =
    'w-[50px] h-[50px] flex items-center justify-center rounded-[6px] border text-white';
  const pageBtnActive = 'border-white/80 bg-black'; // 선택된 페이지
  const pageBtnInactive = 'border-transparent text-white/70 hover:text-white hover:border-white/30';

  const arrowBtnBase =
    'w-[28px] h-[28px] flex items-center justify-center opacity-70 hover:opacity-100';
  const arrowBtnDisabled = 'opacity-30 cursor-not-allowed pointer-events-none';

  return (
    <nav className={`mt-[60px] flex justify-center ${className}`} aria-label="pagination">
      <ul className="flex items-center gap-[20px]">
        {/* Prev */}
        <li>
          <button
            type="button"
            onClick={() => onChange(currentPage - 1)}
            disabled={!canPrev}
            className={[arrowBtnBase, !canPrev ? arrowBtnDisabled : ''].join(' ')}
            aria-label="previous page"
          >
            <Image src={ICONS.PAGE_PREV} alt="" width={24} height={24} />
          </button>
        </li>

        {/* Pages */}
        {pages.map((p) => {
          const active = p === currentPage;
          return (
            <li key={p}>
              <button
                type="button"
                onClick={() => onChange(p)}
                className={[
                  pageBtnBase,
                  active ? pageBtnActive : pageBtnInactive, // ✅ active / inactive 분리
                ].join(' ')}
                aria-current={active ? 'page' : undefined}
              >
                {p}
              </button>
            </li>
          );
        })}

        {/* Next (180도 회전) */}
        <li>
          <button
            type="button"
            onClick={() => onChange(currentPage + 1)}
            disabled={!canNext}
            className={[arrowBtnBase, !canNext ? arrowBtnDisabled : ''].join(' ')}
            aria-label="next page"
          >
            <span className="inline-block rotate-180">
              <Image src={ICONS.PAGE_PREV} alt="" width={24} height={24} />
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
