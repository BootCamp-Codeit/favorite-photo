'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/atoms/Modal/Modal';
import InputSearch from '@/components/molecules/InputSearch/InputSearch';
import DropDown from '@/components/atoms/DropDown/DropDown';
import MyCard from '@/components/organisms/MyCard/MyCard';
import OpenModal from '@/components/organisms/OpenModal/OpenModal';
import MarketplaceSellSuccessPage from '@/app/(main)/marketplace/sell/success/page';
import CardSellingForm from '@/components/organisms/CardSellingForm/CardSellingForm';
import SubHeaderExchange from '@/components/organisms/SubHeader/SubHeaderExchange';
import { http } from '@/lib/http/client';
import styles from './CardSellingListModal.module.css';

const STORAGE_SELL_CARD = 'marketplace_sell_card';

/**
 * GET /users/me/cards 응답 항목 (user_card + photo_card)을 MyCard용 카드 객체로 변환
 * id = user_card_id so each row is distinct and we have user_card_id for creating listing
 */
function userCardRowToCard(row) {
  const quantity = Number(row?.quantity ?? 0);
  return {
    id: row?.user_card_id,
    user_card_id: row?.user_card_id,
    photo_card_id: row?.photo_card_id,
    quantity,
    rarity: row?.grade ?? 'COMMON',
    category: row?.genre ?? '풍경',
    owner: '나',
    description: row?.name ?? row?.description ?? '-',
    price: `${row?.min_price ?? 0} P`,
    imageSrc: row?.image_url || '/assets/products/photo-card.svg',
    title: row?.name,
    grade: row?.grade,
    genre: row?.genre,
  };
}

export default function CardSellingListModal({
  open,
  onClose,
  modalTitle = '나의 포토카드 판매하기',
  onCardSelect,
  onSellCardSelect,
  mode = 'sell',
  sellerUserId,
}) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState('all');
  const [genre, setGenre] = useState('all');
  const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isSellSuccessModalOpen, setIsSellSuccessModalOpen] = useState(false);
  const [soldCardData, setSoldCardData] = useState(null);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [exchangeCardData, setExchangeCardData] = useState(null);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 1199 : false,
  );
  const [filters, setFilters] = useState({ rarity: 'all', genre: 'all', soldout: 'all' });
  const [showSellForm, setShowSellForm] = useState(false);
  const [sellFormCardData, setSellFormCardData] = useState(null);

  const [sellingList, setSellingList] = useState([]);
  const [sellingListLoading, setSellingListLoading] = useState(false);
  const [sellingListError, setSellingListError] = useState(null);

  // Detect mobile (≤499px) and tablet (500–1199px): use bottom sheet for both
  useEffect(() => {
    const checkViewport = () => {
      setIsMobileOrTablet(window.innerWidth <= 1199);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Reset sell form state when modal closes
  useEffect(() => {
    if (!open) {
      setShowSellForm(false);
      setSellFormCardData(null);
    }
  }, [open]);

  /** Fetch logged-in user's owned cards (user_card) for "나의 포토카드 판매하기" list */
  const fetchMyCards = useCallback(async () => {
    setSellingListLoading(true);
    setSellingListError(null);
    try {
      const res = await http.get('/users/me/cards');
      const data = res.data?.data ?? [];
      setSellingList(Array.isArray(data) ? data.map(userCardRowToCard) : []);
    } catch (err) {
      const status = err?.response?.status;
      const message =
        status === 401
          ? '로그인이 필요합니다.'
          : (err?.response?.data?.message ?? err?.message ?? '보유 카드를 불러오지 못했습니다.');
      setSellingListError(message);
      setSellingList([]);
    } finally {
      setSellingListLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchMyCards();
    if (!open) setSellingList([]);
  }, [open, fetchMyCards]);

  const gradeOptions = [
    { value: 'all', label: '등급' },
    { value: 'COMMON', label: 'COMMON' },
    { value: 'RARE', label: 'RARE' },
    { value: 'SUPER RARE', label: 'SUPER RARE' },
    { value: 'LEGENDARY', label: 'LEGENDARY' },
  ];

  const genreOptions = [
    { value: 'all', label: '장르' },
    { value: '풍경', label: '풍경' },
    { value: '여행', label: '여행' },
    { value: '인물', label: '인물' },
    { value: '동물', label: '동물' },
  ];

  // Sample card data (10 cards for 2 columns x 5 rows) - using 3 images
  const imageSources = [
    '/assets/products/photo-card-yard-with-woman.svg',
    '/assets/products/photo-card-spain.svg',
    '/assets/products/photo-card-tree-with-lake.svg',
  ];

  // API 미사용 시 폴백용 샘플 (sellerUserId 없을 때)
  const sampleCards = useMemo(
    () => [
      {
        id: 1,
        rarity: 'RARE',
        category: '풍경',
        owner: '프로여행러',
        description: '스페인 여행',
        price: '4 P',
        quantity: 1,
        imageSrc: imageSources[1],
        title: '스페인 여행',
        maxQuantity: 3,
        initialQuantity: 1,
        grade: 'RARE',
        genre: '풍경',
        exchangeDescription: '',
      },
      {
        id: 2,
        rarity: 'COMMON',
        category: '풍경',
        owner: '미쓰손',
        description: '우리집 앞마당',
        price: '4 P',
        quantity: 1,
        imageSrc: imageSources[0],
        title: '우리집 앞마당',
        maxQuantity: 3,
        initialQuantity: 1,
        grade: 'COMMON',
        genre: '풍경',
        exchangeDescription: '',
      },
      {
        id: 3,
        rarity: 'SUPER RARE',
        category: '풍경',
        owner: '랍스타',
        description: "How Far I'll Go",
        price: '4 P',
        quantity: 1,
        imageSrc: imageSources[2],
        title: "How Far I'll Go",
        maxQuantity: 3,
        initialQuantity: 1,
        grade: 'SUPER RARE',
        genre: '풍경',
        exchangeDescription: '',
      },
      {
        id: 4,
        rarity: 'COMMON',
        category: '풍경',
        owner: '미쓰손',
        description: '우리집 앞마당',
        price: '4 P',
        quantity: 1,
        imageSrc: imageSources[0],
        title: '우리집 앞마당',
        maxQuantity: 3,
        initialQuantity: 1,
        grade: 'COMMON',
        genre: '풍경',
        exchangeDescription: '',
      },
      {
        id: 5,
        rarity: 'RARE',
        category: '풍경',
        owner: '프로여행러',
        description: '스페인 여행',
        price: '4 P',
        quantity: 1,
        imageSrc: imageSources[1],
        title: '스페인 여행',
        maxQuantity: 3,
        initialQuantity: 1,
        grade: 'RARE',
        genre: '풍경',
        exchangeDescription: '',
      },
      {
        id: 6,
        rarity: 'LEGENDARY',
        category: '풍경',
        owner: '미쓰손',
        description: '우리집 앞마당',
        price: '4 P',
        quantity: 1,
        imageSrc: imageSources[0],
        title: '우리집 앞마당',
        maxQuantity: 3,
        initialQuantity: 1,
        grade: 'LEGENDARY',
        genre: '풍경',
        exchangeDescription: '',
      },
      {
        id: 7,
        rarity: 'COMMON',
        category: '풍경',
        owner: '랍스타',
        description: "How Far I'll Go",
        price: '4 P',
        quantity: 1,
        imageSrc: imageSources[2],
        title: "How Far I'll Go",
        maxQuantity: 3,
        initialQuantity: 1,
        grade: 'COMMON',
        genre: '풍경',
        exchangeDescription: '',
      },
      {
        id: 8,
        rarity: 'SUPER RARE',
        category: '풍경',
        owner: '프로여행러',
        description: '스페인 여행',
        price: '4 P',
        quantity: 1,
        imageSrc: imageSources[1],
        title: '스페인 여행',
        maxQuantity: 3,
        initialQuantity: 1,
        grade: 'SUPER RARE',
        genre: '풍경',
        exchangeDescription: '',
      },
      {
        id: 9,
        rarity: 'RARE',
        category: '풍경',
        owner: '미쓰손',
        description: '우리집 앞마당',
        price: '4 P',
        quantity: 1,
        imageSrc: imageSources[0],
        title: '우리집 앞마당',
        maxQuantity: 3,
        initialQuantity: 1,
        grade: 'RARE',
        genre: '풍경',
        exchangeDescription: '',
      },
      {
        id: 10,
        rarity: 'COMMON',
        category: '풍경',
        owner: '랍스타',
        description: "How Far I'll Go",
        price: '4 P',
        quantity: 1,
        imageSrc: imageSources[2],
        title: "How Far I'll Go",
        maxQuantity: 3,
        initialQuantity: 1,
        grade: 'COMMON',
        genre: '풍경',
        exchangeDescription: '',
      },
    ],
    [],
  );

  const cardsFromApi = sellingList.length > 0 ? sellingList : sellingListError ? [] : sampleCards;
  const filteredCards = useMemo(() => {
    let list = cardsFromApi;
    if (grade && grade !== 'all')
      list = list.filter((c) => c.grade === grade || c.rarity === grade);
    if (genre && genre !== 'all')
      list = list.filter((c) => c.genre === genre || c.category === genre);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          (c.description || '').toLowerCase().includes(q) ||
          (c.title || '').toLowerCase().includes(q) ||
          (c.name || '').toLowerCase().includes(q),
      );
    }
    return list;
  }, [cardsFromApi, grade, genre, search]);

  const handleCardClick = (card) => {
    if (mode === 'exchange' && onCardSelect) {
      setExchangeCardData(card);
      onCardSelect(card);
      onClose();
    } else if (mode === 'sell') {
      // Desktop: show sell form inside modal
      // Mobile/Tablet: navigate to full page
      if (!isMobileOrTablet) {
        // Desktop: show form in modal
        setSellFormCardData(card);
        setShowSellForm(true);
      } else if (onSellCardSelect) {
        // Mobile/Tablet: navigate to full page
        try {
          sessionStorage.setItem(STORAGE_SELL_CARD, JSON.stringify(card));
        } catch {}
        onClose();
        onSellCardSelect(card);
      } else {
        // Fallback: open OpenModal
        setSelectedCard(card);
        setIsOpenModalOpen(true);
      }
    }
  };

  const handleSellFormBack = () => {
    setShowSellForm(false);
    setSellFormCardData(null);
  };

  const handleSellFormSuccess = (payload) => {
    setShowSellForm(false);
    setSellFormCardData(null);
    setSoldCardData(payload);
    setIsSellSuccessModalOpen(true);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size={isMobileOrTablet ? 'bottomSheetFull' : 'custom'}
      showCloseButton={!isMobileOrTablet && !showSellForm}
    >
      <div className={styles.modalContainer}>
        {/* Desktop: Show sell form or card list */}
        {!isMobileOrTablet && showSellForm && sellFormCardData ? (
          <CardSellingForm
            cardData={sellFormCardData}
            onBack={handleSellFormBack}
            onSuccess={handleSellFormSuccess}
            isInModal={true}
          />
        ) : (
          /* Scrollable content area */
          <div className={styles.scrollableContent}>
            {/* Desktop (≥1200px): Original layout */}
            {!isMobileOrTablet && (
              <>
                {/* "마이갤러리" Subtitle */}
                <div className={styles.subtitleBox}>
                  <h2 className={styles.subtitle}>마이갤러리</h2>
                </div>

                {/* Main Title */}
                <div className={styles.titleBox}>
                  <h1
                    className={styles.mainTitle}
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
                    {modalTitle}
                  </h1>
                </div>

                {/* Search and Filter Section */}
                <div className={styles.filterSection}>
                  <InputSearch
                    placeholder="검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onClick={() => {}}
                    className={styles.searchInput}
                  />
                  <div className={styles.dropdownWrapper}>
                    <DropDown
                      options={gradeOptions}
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      wrapperStyle={{ border: '0px solid #ffffff' }}
                      style={{ border: '0px solid #ffffff', backgroundColor: '#141414' }}
                    />
                  </div>
                  <div className={styles.dropdownWrapper}>
                    <DropDown
                      options={genreOptions}
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      wrapperStyle={{ border: '0px solid #ffffff' }}
                      style={{ border: '0px solid #ffffff', backgroundColor: '#141414' }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Mobile & Tablet: SubHeaderExchange (bottom sheet header) */}
            {isMobileOrTablet && (
              <SubHeaderExchange
                subtitle="마이갤러리"
                title={modalTitle}
                search={search}
                onSearchChange={(e) => setSearch(e.target.value)}
                filters={filters}
                onFiltersChange={setFilters}
                cards={filteredCards}
                onClose={onClose}
              />
            )}

            {/* 보유 카드(user_card) 로딩/에러 */}
            {sellingListLoading && (
              <div className={styles.cardsGrid}>보유 카드를 불러오는 중...</div>
            )}
            {sellingListError && !sellingListLoading && (
              <div className={styles.cardsGrid}>{sellingListError}</div>
            )}

            {/* MyCard Grid */}
            {!sellingListLoading && !sellingListError && (
              <div className={styles.cardsGrid}>
                {filteredCards.length === 0 ? (
                  <div className={styles.emptyState}>등록된 카드가 없습니다.</div>
                ) : (
                  filteredCards.map((card) => (
                    <div key={card.id} className={styles.cardItem}>
                      <MyCard
                        rarity={card.rarity}
                        category={card.category}
                        owner={card.owner}
                        description={card.description}
                        price={card.price}
                        quantity={card.quantity}
                        imageSrc={card.imageSrc}
                        imageWidth={isMobileOrTablet ? 170 : 400}
                        imageHeight={isMobileOrTablet ? 150 : 400}
                        onClick={() => handleCardClick(card)}
                      />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Open Modal for selling */}
      <OpenModal
        open={isOpenModalOpen}
        onClose={() => {
          setIsOpenModalOpen(false);
          setSelectedCard(null);
        }}
        cardData={selectedCard}
        mode="sell"
        onSellSuccess={() => {
          // Close OpenModal and show success modal
          setIsOpenModalOpen(false);
          setSelectedCard(null);
          setIsSellSuccessModalOpen(true);
        }}
      />

      {/* Sell Success Modal */}
      <Modal
        open={isSellSuccessModalOpen}
        onClose={() => {
          setIsSellSuccessModalOpen(false);
          setSoldCardData(null);
        }}
        size="custom"
        noBorder={true}
      >
        <MarketplaceSellSuccessPage
          onButtonClick={() => {
            // Close success modal, keep CardSellingListModal open
            setIsSellSuccessModalOpen(false);
            setSoldCardData(null);
          }}
          cardData={soldCardData}
        />
      </Modal>
    </Modal>
  );
}
