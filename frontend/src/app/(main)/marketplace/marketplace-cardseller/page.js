// 나의 포토카드 페이지

'use client';

import { useState } from 'react';
import Image from 'next/image';
import CardSeller from '@/components/organisms/CardSeller/CardSeller';
import CardExchange from '@/components/organisms/CardExchange/CardExchange';
import OpenModal from '@/components/organisms/OpenModal/OpenModal';
import styles from './page.module.css';

export default function MarketplaceCardSellerPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Sample data for the main card
  const mainCardData = {
    rarity: 'LEGENDARY',
    category: '풍경',
    owner: '미쓰손',
    description:
      '우리집 앞마당 포토카드입니다. 우리집 앞마당 포토카드입니다. 우리집 앞마당 포토카드입니다.',
    price: '4 P',
    remaining: 2,
    outof: 5,
    secondRarity: 'RARE',
    secondCategory: '풍경',
    secondDescription: '푸릇푸릇한 여름 풍경, 눈 많이 내린 겨울 풍경 사진에 관심이 많습니다.',
    title: '우리집 앞마당',
    maxQuantity: 3,
    initialQuantity: 2,
    grade: 'COMMON',
    genre: '풍경',
    exchangeDescription: '',
  };

  // Sample data for exchange proposals
  const exchangeProposals = [
    {
      title: '스페인 여행',
      rarity: 'COMMON',
      category: '풍경',
      price: '4P',
      owner: '프로여행러',
      exchangeMessage: '스페인 여행 사진도 좋은데.. 우리집 앞마당 포토카드와 교환하고 싶습니다!',
      imageSrc: '/assets/products/photo-card-two.svg',
    },
    {
      title: "How Far I'll Go",
      rarity: 'SUPER RARE',
      category: '풍경',
      price: '4P',
      owner: '랍스타',
      exchangeMessage: '여름 바다 풍경 사진과 교환하실래요?',
      imageSrc: '/assets/products/photo-card-another.svg',
    },
    {
      title: "How Far I'll Go",
      rarity: 'SUPER RARE',
      category: '풍경',
      price: '4P',
      owner: '랍스타',
      exchangeMessage: '여름 바다 풍경 사진과 교환하실래요?',
      imageSrc: '/assets/products/photo-card-another.svg',
    },
  ];

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleTakeDown = () => {
    console.log('Take down clicked');
  };

  const handleDecline = (index) => {
    console.log('Decline clicked for proposal', index);
  };

  const handleApprove = (index) => {
    console.log('Approve clicked for proposal', index);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        {/* 1. Page Title "마켓플레이스" */}
        <div className={styles.pageTitle}>마켓플레이스</div>

        {/* 2. Card Title Box "우리집 앞마당" */}
        <div className={styles.cardTitleBox}>
          <h1
            className={styles.cardTitle}
            style={{
              fontFamily: "'Noto Sans KR', sans-serif",
              fontWeight: 700,
              fontSize: '40px',
              lineHeight: '100%',
              color: '#ffffff',
              margin: 0,
              paddingBottom: '20px',
            }}
          >
            우리집 앞마당
          </h1>
        </div>

        {/* 3. Space between title and main content (50px) */}
        <div className={styles.spacing50}></div>

        {/* 4. Main Card Content Area (Two-Column Layout) */}
        <div className={styles.mainContentArea}>
          {/* Left Column - Photo Card Image */}
          <div className={styles.leftColumn}>
            <Image
              src="/assets/products/photo-card.svg"
              alt="우리집 앞마당 포토카드"
              width={820}
              height={620}
              className={styles.cardImage}
            />
          </div>

          {/* Right Column - CardSeller Component */}
          <div className={styles.rightColumn}>
            <CardSeller
              rarity={mainCardData.rarity}
              category={mainCardData.category}
              owner={mainCardData.owner}
              description={mainCardData.description}
              price={mainCardData.price}
              remaining={mainCardData.remaining}
              outof={mainCardData.outof}
              secondRarity={mainCardData.secondRarity}
              secondCategory={mainCardData.secondCategory}
              secondDescription={mainCardData.secondDescription}
              onEdit={handleEdit}
              onTakeDown={handleTakeDown}
            />
          </div>
        </div>

        {/* 5. "교환 제시 목록" Title */}
        <div className={styles.spacing50}></div>
        <div className={styles.cardTitleBox}>
          <h1
            className={styles.cardTitle}
            style={{
              fontFamily: "'Noto Sans KR', sans-serif",
              fontWeight: 700,
              fontSize: '40px',
              lineHeight: '100%',
              color: '#ffffff',
              margin: 0,
              paddingBottom: '20px',
            }}
          >
            교환 제시 목록
          </h1>
        </div>

        {/* 6. Space between title and exchange cards (50px) */}
        <div className={styles.spacing50}></div>

        {/* 7. Proposed Exchange Cards */}
        <div className={styles.exchangeCardsContainer}>
          {exchangeProposals.map((proposal, index) => (
            <div key={index} className={styles.exchangeCardWrapper}>
              <CardExchange
                title={proposal.title}
                rarity={proposal.rarity}
                category={proposal.category}
                price={proposal.price}
                owner={proposal.owner}
                exchangeMessage={proposal.exchangeMessage}
                onDecline={() => handleDecline(index)}
                onApprove={() => handleApprove(index)}
                imageSrc={proposal.imageSrc}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Open Modal */}
      <OpenModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        cardData={mainCardData}
        mode="edit"
      />
    </div>
  );
}
