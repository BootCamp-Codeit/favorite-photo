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

function normalizeImageUrl(url) {
  if (!url) return null;

  let normalized = url;
  if (normalized.startsWith('/public/')) {
    normalized = normalized.replace('/public', '');
  }
  if (normalized.startsWith('/')) {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (base) return `${base}${normalized}`;
  }
  return normalized;
}

function normalizeGrade(v) {
  const g = String(v ?? '').toUpperCase();
  if (g === 'SUPER_RARE') return 'SUPER RARE';
  return g || 'COMMON';
}

function listingToCard(item) {
  const pc = item?.photoCard ?? {};
  const quantity = Number(item?.quantity ?? 0);
  const pricePerUnit = item?.pricePerUnit ?? 0;
  const status = item?.status ?? 'ACTIVE';
  const imageSrc = normalizeImageUrl(pc?.imageUrl) || '/assets/products/photo-card.svg';

  return {
    id: item?.listingId,
    rarity: normalizeGrade(pc?.grade),
    category: pc?.genre ?? '풍경',
    owner: item?.sellerNickname ?? '판매자',
    description: pc?.description || pc?.name || '-',
    price: `${pricePerUnit} P`,
    priceValue: Number(pricePerUnit) || 0,
    remaining: quantity,
    outof: quantity,
    status,
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
    if (soldout === 'soldout' && c.status !== 'SOLD_OUT' && c.remaining > 0) return false;
    if (soldout === 'available' && (c.status === 'SOLD_OUT' || c.remaining === 0)) return false;
    return true;
  });
}

function sortParamsFromKey(sort) {
  if (sort === 'lowPrice') return { sortBy: 'price', sortOrder: 'ASC' };
  if (sort === 'highPrice') return { sortBy: 'price', sortOrder: 'DESC' };
  return { sortBy: 'reg_date', sortOrder: 'DESC' };
}

function statusParamFromSoldout(soldout) {
  if (soldout === 'soldout') return 'SOLD_OUT';
  if (soldout === 'available') return 'ACTIVE';
  return null;
}

export default function MarketplacePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [isSellingModalOpen, setIsSellingModalOpen] = useState(false);
  const [filters, setFilters] = useState({ rarity: 'all', genre: 'all', soldout: 'all' });
  const [sort, setSort] = useState('newest');
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

  const fetchListings = useCallback(
    async (cursor = null, append = false, soldoutFilter = filters.soldout, sortKey = sort) => {
      const isLoadMore = append && cursor != null;
      if (isLoadMore) setLoadMoreLoading(true);
      else setLoading(true);

      setError(null);
      try {
        const { sortBy, sortOrder } = sortParamsFromKey(sortKey);
        const params = new URLSearchParams({
          limit: String(LISTINGS_LIMIT),
          sortBy,
          sortOrder,
        });
        const status = statusParamFromSoldout(soldoutFilter);
        if (status) params.set('status', status);
        else params.set('status', 'ALL');
        if (cursor != null) params.set('cursor', String(cursor));

        let res = await http.get(`/api/listings?${params.toString()}`);
        let data = res.data?.data;
        let items = data?.items ?? [];

        // BE 배포 전 status=ALL 미지원 시 ACTIVE(기본)로 폴백
        if (
          items.length === 0 &&
          soldoutFilter === 'all' &&
          cursor == null &&
          params.get('status') === 'ALL'
        ) {
          params.delete('status');
          res = await http.get(`/api/listings?${params.toString()}`);
          data = res.data?.data;
          items = data?.items ?? [];
        }

        const next = data?.nextCursor ?? null;
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
    },
    [filters.soldout, sort],
  );

  useEffect(() => {
    setDisplayCount(INITIAL_COUNT);
    fetchListings(null, false, filters.soldout, sort);
  }, [filters.soldout, sort, fetchListings]);

  const filteredCards = useMemo(() => filterCards(listings, filters), [listings, filters]);
  const visibleCards = useMemo(
    () => filteredCards.slice(0, displayCount),
    [filteredCards, displayCount],
  );

  const hasMore = displayCount < filteredCards.length || nextCursor != null;

  useEffect(() => {
    setDisplayCount(INITIAL_COUNT);
  }, [filters.rarity, filters.genre]);

  const loadMore = useCallback(
    (entries) => {
      const [entry] = entries;
      if (!entry?.isIntersecting || loadMoreLoading) return;

      if (displayCount < filteredCards.length) {
        setDisplayCount((n) => Math.min(n + LOAD_MORE_COUNT, filteredCards.length));
      } else if (nextCursor != null) {
        fetchListings(nextCursor, true, filters.soldout, sort);
      }
    },
    [displayCount, filteredCards.length, nextCursor, loadMoreLoading, fetchListings, filters.soldout, sort],
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
        sort={sort}
        onSortChange={setSort}
        cards={listings}
      />

      <div className={`mx-auto w-full max-w-[1280px] px-5 py-10 ${styles.listWrapper}`}>
        {loading && listings.length === 0 && (
          <div className="py-10 text-center text-white/60">불러오는 중...</div>
        )}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className={styles.cardGrid}>
          {!loading &&
            visibleCards.map((card) => (
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

        {!loading && visibleCards.length === 0 && (
          <div className="py-10 text-center text-white/60">조건에 맞는 포토카드가 없습니다.</div>
        )}

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
