'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubHeader from '@/components/organisms/SubHeader/SubHeader';
import CardOriginal from '@/components/organisms/CardOriginal/CardOriginal';
import CardSellingListModal from '@/components/organisms/CardSellingListModal/CardSellingListModal';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

const LISTINGS_LIMIT = 10;
const INITIAL_COUNT = 10;
const LOAD_MORE_COUNT = 10;

/* ============================
 * ✅ 이미지 URL 정규화 함수 (추가)
 * ============================ */
function normalizeImageUrl(url) {
  if (!url) return null;

  let normalized = url;

  // 1️⃣ "/public/xxx" → "/xxx"
  if (normalized.startsWith('/public/')) {
    normalized = normalized.replace('/public', '');
  }

  // 2️⃣ 상대경로면 백엔드 baseURL 붙이기
  if (normalized.startsWith('/')) {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (base) return `${base}${normalized}`;
  }

  // 이미 https:// 로 시작하면 그대로
  return normalized;
}

/**
 * API 리스팅 항목을 카드 표시용 객체로 변환
 */
function listingToCard(item) {
  const pc = item?.photoCard ?? {};
  const quantity = Number(item?.quantity ?? 0);
  const pricePerUnit = item?.pricePerUnit ?? 0;

  const imageSrc = normalizeImageUrl(pc?.imageUrl) || '/assets/products/photo-card.svg';

  return {
    id: item?.listingId,
    rarity: pc?.grade ?? 'COMMON',
    category: pc?.genre ?? '풍경',
    owner: item?.sellerNickname ?? '판매자',
    description: pc?.description || pc?.name || '-',
    price: `${pricePerUnit} P`,
    remaining: quantity,
    outof: quantity,
    imageSrc,
  };
}

function filterCards(cards, filters) {
  const { rarity, genre, soldout } = filters || {};
  return cards.filter((c) => {
    if (rarity && rarity !== 'all') {
      const r = {
        common: 'COMMON',
        rare: 'RARE',
        superRare: 'SUPER RARE',
        legendary: 'LEGENDARY',
      }[rarity];
      if (r && c.rarity !== r) return false;
    }
    if (genre && genre !== 'all' && c.category !== genre) return false;
    if (soldout === 'soldout' && c.remaining > 0) return false;
    if (soldout === 'available' && c.remaining === 0) return false;
    return true;
  });
}

export default function MarketplacePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [isSellingModalOpen, setIsSellingModalOpen] = useState(false);
  const [filters, setFilters] = useState({ rarity: 'all', genre: 'all', soldout: 'all' });
  const [displayCount, setDisplayCount] = useState(INITIAL_COUNT);
  const loadMoreRef = useRef(null);

  const [listings, setListings] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await http.get('/users/me');
        setCurrentUser(data?.user ?? null);
      } catch (err) {
        setCurrentUser(null);
        if (err?.response?.status === 401) {
          router.replace('/auth/login');
        }
      }
    }
    fetchUser();
  }, [router]);

  const fetchListings = useCallback(async (cursor = null, append = false) => {
    const isLoadMore = append && cursor != null;
    if (isLoadMore) setLoadMoreLoading(true);
    else setLoading(true);

    setError(null);
    try {
      const params = new URLSearchParams({ limit: String(LISTINGS_LIMIT) });
      if (cursor != null) params.set('cursor', String(cursor));

      const res = await http.get(`/api/listings?${params.toString()}`);
      const data = res.data?.data;
      const items = data?.items ?? [];
      const next = data?.nextCursor ?? null;

      // ✅ 여기 추가 (핵심)
      console.log('LISTINGS RAW ITEMS:', items);
      if (items.length >= 2) {
        console.log('CARD 0 photocard:', items[0]?.photoCard);
        console.log('CARD 1 photocard:', items[1]?.photoCard);
      }

      const cards = items.map(listingToCard);

      setListings((prev) => (append ? [...prev, ...cards] : cards));
      setNextCursor(next);
    } catch (err) {
      setError(err?.message ?? '리스팅을 불러오지 못했습니다.');
      if (!append) setListings([]);
    } finally {
      setLoading(false);
      setLoadMoreLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const filteredCards = useMemo(() => filterCards(listings, filters), [listings, filters]);
  const visibleCards = useMemo(
    () => filteredCards.slice(0, displayCount),
    [filteredCards, displayCount],
  );

  const hasMore = displayCount < filteredCards.length || nextCursor != null;

  useEffect(() => {
    setDisplayCount(INITIAL_COUNT);
  }, [filters]);

  const loadMore = useCallback(
    (entries) => {
      const [entry] = entries;
      if (!entry?.isIntersecting || loadMoreLoading) return;

      if (displayCount < filteredCards.length) {
        setDisplayCount((n) => Math.min(n + LOAD_MORE_COUNT, filteredCards.length));
      } else if (nextCursor != null) {
        fetchListings(nextCursor, true);
      }
    },
    [displayCount, filteredCards.length, nextCursor, loadMoreLoading, fetchListings],
  );

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(loadMore, {
      rootMargin: '200px',
      threshold: 0.1,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  return (
    <div className="w-full bg-black text-white">
      <SubHeader
        onSellClick={() => setIsSellingModalOpen(true)}
        filters={filters}
        onFiltersChange={setFilters}
        cards={listings}
      />

      <div className={`mx-auto w-full max-w-[1280px] px-5 py-10 ${styles.listWrapper}`}>
        <div className={styles.cardGrid}>
          {visibleCards.map((card) => (
            <CardOriginal
              key={card.id}
              rarity={card.rarity}
              category={card.category}
              owner={card.owner}
              description={card.description}
              price={card.price}
              remaining={card.remaining}
              outof={card.outof}
              imageSrc={card.imageSrc}
              onClick={() => router.push(`/marketplace/${card.id}`)}
              detailHref={`/marketplace/${card.id}`}
            />
          ))}
        </div>

        {hasMore && <div ref={loadMoreRef} className={styles.sentinel} />}
      </div>

      <CardSellingListModal
        open={isSellingModalOpen}
        onClose={() => setIsSellingModalOpen(false)}
        onSellCardSelect={() => {
          setIsSellingModalOpen(false);
          router.push('/marketplace/sell');
        }}
        sellerUserId={currentUser?.id}
      />
    </div>
  );
}
