'use client';

import { useRouter } from 'next/navigation';

export default function FailClient({ grade, title }) {
  const router = useRouter();
  const goMyGallery = () => router.push('/mygallery');

  return (
    <div className="w-full max-w-[460px] text-center relative">
      {/* X 버튼: 콘텐츠에 묶이게 absolute */}
      <button
        type="button"
        aria-label="닫기"
        onClick={goMyGallery}
        className="
          absolute
          -top-[80px]
          right-[-120px]
          text-[20px]
          text-white/80
          hover:text-white
        "
      >
        ×
      </button>

      <h1
        className="
          font-['BR_B']
          text-[46px]
          font-normal
          leading-[100%]
          tracking-[-0.03em]
        "
      >
        포토카드 생성 <span className="text-white/50">실패</span>
      </h1>

      <p
        className="
          mt-[62px]
          font-['Noto_Sans_KR']
          text-[18px]
          font-medium
          leading-[100%]
          text-white/90
        "
      >
        [{grade} | {title}] 포토카드 생성에 실패했습니다.
      </p>

      <button
        type="button"
        onClick={goMyGallery}
        className="
          mt-[50px]
          w-[440px]
          h-[60px]
          px-[32px]
          border border-white/40
          text-[18px]
          font-medium
          hover:border-white/70
          active:translate-y-[1px]
        "
      >
        마이갤러리로 돌아가기
      </button>
    </div>
  );
}
