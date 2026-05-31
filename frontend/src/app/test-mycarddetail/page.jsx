// Favorite-Nextjs-FE/src/app/test-mycarddetail/page.jsx

'use client';

import MyCardDetail from '@/components/organisms/MyCardDetail/MyCardDetail';

export default function TestMyCardDetailPage() {
  const handleQuantityChange = (newQuantity) => {
    console.log('수량 변경:', newQuantity);
    alert(`수량이 ${newQuantity}로 변경되었습니다!`);
  };

  const handlePriceChange = (newPrice) => {
    console.log('가격 변경:', newPrice);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#000000', minHeight: '100vh' }}>
      <h1
        style={{
          textAlign: 'center',
          color: '#fff',
          marginTop: '20px',
          marginBottom: '30px',
          fontSize: '20px',
          fontWeight: '700',
        }}
      >
        MyCardDetail 컴포넌트 테스트
      </h1>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <MyCardDetail
          rarity="COMMON"
          category="풍경"
          owner="미쓰손"
          maxQuantity={3}
          initialQuantity={1}
          price=""
          onQuantityChange={handleQuantityChange}
          onPriceChange={handlePriceChange}
        />
      </div>

      <div style={{ maxWidth: '600px', margin: '40px auto 0' }}>
        <h2
          style={{
            color: '#fff',
            marginBottom: '20px',
            fontSize: '16px',
            fontWeight: '600',
          }}
        ></h2>
        <MyCardDetail
          rarity="COMMON"
          category="풍경"
          owner="유디"
          maxQuantity={3}
          initialQuantity={2}
          price="20"
          onQuantityChange={handleQuantityChange}
          onPriceChange={handlePriceChange}
        />
      </div>
    </div>
  );
}
