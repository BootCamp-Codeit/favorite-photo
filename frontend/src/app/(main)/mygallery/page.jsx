'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useBreakpoint from '@/hooks/useBreakpoint';

import CardOriginal from '@/components/organisms/CardOriginal/CardOriginal';
import GradeChips from './_components/GradeChips';
import Pagination from './_components/Pagination';
import MyGalleryFilterBar from './_components/MyGalleryFilterBar';
import MyGalleryMobileHeader from './_components/MyGalleryMobileHeader';
import { useMyGalleryCount } from './_components/MyGalleryCountContext';

import styles from './page.module.css';

const PAGE_SIZE = 15;

// ✅ NEXT_PUBLIC_API_BASE_URL만 사용 (뒤 슬래시 제거)
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

// ✅ grade 표준화 (rare → RARE, SUPER_RARE → SUPER RARE 등)
function normalizeGrade(v) {
  const g = String(v ?? '').toUpperCase();
  if (g === 'SUPER_RARE') return 'SUPER RARE';
  return g || 'COMMON';
}

// ✅ 이미지 URL 정규화: /public 제거 + 상대경로면 API_BASE 붙이기
function normalizeImageUrl(url) {
  if (!url) return null;
  let u = String(url);

  if (u.startsWith('/public/')) u = u.replace('/public', '');

  if (u.startsWith('/')) {
    if (!API_BASE) return u; // base 없으면 일단 상대경로 유지
    return `${API_BASE}${u}`;
  }

  return u;
}

/** ✅ BE → CardOriginal props로 매핑 */
function mapMyCardToCard(item) {
  // users/me/cards 응답이 userCard(=photoCard 래핑)일 수도 있고, 그냥 photoCard일 수도 있음
  const pc = item?.photoCard ?? item;

  const grade = normalizeGrade(pc?.grade ?? pc?.rarity);
  const category = pc?.genre ?? pc?.category ?? 'ALL';

  const quantity = Number(item?.quantity ?? pc?.quantity ?? 0);

  // ✅ 제목은 name 우선 (CardOriginal은 description을 타이틀처럼 보여주니까 여기로 넣음)
  const title = pc?.name ?? pc?.title ?? pc?.description ?? '';

  // ✅ 가격: minPrice / min_price 우선
  const minPrice = Number(pc?.minPrice ?? pc?.min_price ?? 0);

  const imageSrc =
    normalizeImageUrl(pc?.imageUrl ?? pc?.image_url ?? pc?.image) ||
    '/assets/products/photo-card.svg';

  return {
    id: item?.user_card_id ?? pc?.id ?? item?.id,

    // CardOriginal이 받는 키들
    rarity: grade,
    category,
    owner: pc?.ownerNickname ?? pc?.ownerName ?? '',
    description: title,
    price: `${minPrice} P`,
    remaining: quantity,
    outof: quantity,
    imageSrc,
  };
}

export default function MyGalleryPage() {
  const router = useRouter();
  const bp = useBreakpoint();
  const isMobile = bp === 'sm';

  const { setOwnedCount, setTitle } = useMyGalleryCount();

  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState('ALL');
  const [genre, setGenre] = useState('ALL');
  const [page, setPage] = useState(1);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /** ✅ 내 카드 목록 */
  const fetchMyCards = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      if (!API_BASE) throw new Error('NEXT_PUBLIC_API_BASE_URL is missing');

      const res = await fetch(`${API_BASE}/users/me/cards`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();

      const rawItems = Array.isArray(json?.data?.items)
        ? json.data.items
        : Array.isArray(json?.items)
          ? json.items
          : Array.isArray(json?.data)
            ? json.data
            : [];

      const mapped = rawItems.map(mapMyCardToCard);

      setItems(mapped);
      setOwnedCount(mapped.length);
    } catch (e) {
      setError(e?.message ?? 'failed to load');
      setItems([]);
      setOwnedCount(0);
    } finally {
      setLoading(false);
    }
  }, [setOwnedCount]);

  useEffect(() => {
    fetchMyCards();
  }, [fetchMyCards]);

  // 타이틀 고정
  useEffect(() => {
    setTitle?.('마이갤러리');
  }, [setTitle]);

  // ✅ 필터 적용 (search/grade/genre)
  const filteredItems = useMemo(() => {
    return items.filter((c) => {
      const hay = `${c.description ?? ''} ${c.owner ?? ''} ${c.category ?? ''}`.toLowerCase();

      const okSearch = search ? hay.includes(search.toLowerCase()) : true;
      const okGrade = grade === 'ALL' ? true : c.rarity === grade;
      const okGenre = genre === 'ALL' ? true : c.category === genre;

      return okSearch && okGrade && okGenre;
    });
  }, [items, search, grade, genre]);

  // ✅ chips counts (필터된 기준으로 보여주고 싶으면 filteredItems, 전체 기준이면 items)
  const counts = useMemo(() => {
    const src = filteredItems;
    return {
      common: src.filter((c) => c.rarity === 'COMMON').length,
      rare: src.filter((c) => c.rarity === 'RARE').length,
      superRare: src.filter((c) => c.rarity === 'SUPER RARE').length,
      legendary: src.filter((c) => c.rarity === 'LEGENDARY').length,
    };
  }, [filteredItems]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const pagedItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, grade, genre]);

  return (
    <div className={styles.listWrapper}>
      {isMobile && <MyGalleryMobileHeader title="마이갤러리" onBack={() => router.back()} />}

      {!isMobile && <GradeChips counts={counts} />}

      {!isMobile && <div className="mt-[60px] h-px w-full bg-white/20" />}

      <MyGalleryFilterBar
        isMobile={isMobile}
        search={search}
        onChangeSearch={setSearch}
        grade={grade}
        onChangeGrade={setGrade}
        genre={genre}
        onChangeGenre={setGenre}
      />

      {error && (
        <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading && <div className="mt-6 text-sm text-white/60">불러오는 중...</div>}

      <div className={styles.cardGrid}>
        {!loading && pagedItems.length === 0 ? (
          <div className="col-span-full mt-10 text-center text-white/60">
            보유한 포토카드가 없습니다.
          </div>
        ) : (
          pagedItems.map((card) => <CardOriginal key={card.id} {...card} />)
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
