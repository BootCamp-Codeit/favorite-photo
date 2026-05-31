'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Container from '@/components/layout/Container';
import Title from '@/components/atoms/Title/Title';
import ButtonPrimary from '@/components/atoms/Button/ButtonPrimary';
import { MyGalleryCountProvider } from './MyGalleryCountContext';

export default function MyGalleryShell({ children }) {
  const router = useRouter();

  const [title, setTitle] = useState('마이갤러리');

  const [label, setLabel] = useState('보유한 포토카드');

  const [ownedCount, setOwnedCount] = useState(0);

  return (
    <MyGalleryCountProvider value={{ title, setTitle, label, setLabel, ownedCount, setOwnedCount }}>
      <main className="min-h-screen bg-black text-white">
        <Container className="pt-[60px] pb-[20px]">
          <div className="flex items-center justify-between gap-6">
            <Title
              text={title} // ✅ 큰 타이틀
              as="h1"
              showLine={false}
              style={{ fontSize: '62px', lineHeight: '100%' }}
            />

            <ButtonPrimary
              size="l"
              thickness="thick"
              className="w-[440px] h-[60px]"
              onClick={() => router.push('/create-card')}
            >
              포토카드 생성하기
            </ButtonPrimary>
          </div>

          <div className="mt-[20px] mb-[50px] h-[2px] w-full bg-[#EEEEEE]" />

          <div className="mt-[24px]">
            <div className="flex items-end gap-2">
              <span className="text-[24px] font-bold leading-[100%] text-white/80">{label}</span>
              <span className="text-[20px] font-normal leading-[100%] text-white/50">
                ({ownedCount}장)
              </span>
            </div>
          </div>

          <div className="mt-[24px]">{children}</div>
        </Container>
      </main>
    </MyGalleryCountProvider>
  );
}
