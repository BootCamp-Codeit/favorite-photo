'use client';

import { useRouter } from 'next/navigation';
import { ButtonPrimary, ButtonSecondary, ResponsiveButton } from '@/components/atoms/Button';

export default function MarketplaceSellFailPage() {
  const router = useRouter();
  return (
    <div className="w-full bg-black text-white">
      <div className="mx-auto w-full max-w-[1480px] px-5 py-10">
        <h1 className="text-[24px] font-semibold">판매 등록 실패</h1>
        <p className="mt-2 text-white/70">판매 등록이 실패했습니다. 다시 시도해주세요.</p>
      </div>
      <div className="w-full bg-black text-white">
        <div className="mx-auto w-full max-w-[1480px] px-5 py-10">
          <ResponsiveButton onClick={() => router.push('/marketplace')} className="w-full">
            다시 시도하기
          </ResponsiveButton>
        </div>
      </div>
    </div>
  );
}
