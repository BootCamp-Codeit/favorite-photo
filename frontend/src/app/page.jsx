'use client';

import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import Image from 'next/image';
import { useMemo } from 'react';
import useBreakpoint from '@/hooks/useBreakpoint';
import { ButtonPrimary } from '@/components/atoms/Button';

export default function Home() {
  const bp = useBreakpoint();
  const HERO = useMemo(() => {
    const img1Src =
      bp === 'sm'
        ? '/images/landing/sm/img1.svg'
        : bp === 'md'
          ? '/images/landing/md/img1.svg'
          : '/images/landing/lg/img1.svg';

    if (bp === 'sm') {
      return {
        minH: 'min-h-[550px]',
        textPt: 'pt-[52px]',
        textH: 'h-[44%]',
        title: 'text-[32px]',
        buttonW: '!w-[200px]',
        buttonH: '!h-[50px]',
        previewH: 'h-[50%]',
        img1Src,
      };
    }

    if (bp === 'md') {
      return {
        minH: 'min-h-[800px]',
        textPt: 'pt-[64px]',
        textH: 'h-[42%]',
        title: 'text-[44px]',
        buttonW: '!w-[226px]',
        buttonH: '!h-[55px]',
        previewH: 'h-[60%]',
        img1Src,
      };
    }

    return {
      minH: 'min-h-[1350px]',
      textPt: 'pt-[70px]',
      textH: 'h-[40%]',
      title: 'text-[44px]',
      buttonW: '!w-[226px]',
      buttonH: '!h-[55px]',
      previewH: 'h-[75%]',
      img1Src,
    };
  }, [bp]);

  const SECTION_TYPO = useMemo(() => {
    if (bp === 'sm') {
      return {
        title: 'text-[20px] font-bold leading-[1.2] tracking-[-0.02em]',
        body: 'text-[14px] font-normal leading-[20px]',
        bodyMt: 'mt-2',

        wrapPt: 'pt-[50px]',
        textWrap: 'px-5',
        textMaxW: 'max-w-[320px]',
        textAlign: 'text-left',
      };
    }

    return {
      title: 'text-[36px] font-bold leading-[1.2] tracking-[-0.02em]',
      body: 'text-[18px] font-normal leading-[28px]',
      bodyMt: 'mt-3',

      wrapPt: 'pt-[120px]',
      textWrap: 'px-10',
      textMaxW: 'max-w-[560px]',
      textAlign: 'text-left',
    };
  }, [bp]);

  return (
    <>
      <Header />

      {/* ================= SECTION 1 : HERO ================= */}
      <section className={`relative mt-[13px] bg-neutral-950 overflow-hidden ${HERO.minH}`}>
        {/* ✅ bg1 프레임(라운드) - 배경은 Container로 유지 */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Container className="h-full">
            <div className="relative h-full rounded-[28px] overflow-hidden">
              <Image
                src="/images/landing/background/bg1.png"
                alt="hero background"
                fill
                priority
                className="object-cover"
              />
            </div>
          </Container>
        </div>

        {/* ✅ 텍스트 영역 */}
        <div
          className={`relative z-20 flex justify-center text-center ${HERO.textH} ${HERO.textPt}`}
        >
          <Container>
            <div className="mx-auto w-full max-w-[720px]">
              <Image
                src="/assets/logos/logo.svg"
                alt="최애의포토 로고"
                width={120}
                height={32}
                className="mx-auto"
              />

              <h1 className={`mt-[18px] leading-[1.25] font-bold tracking-[-0.02em] ${HERO.title}`}>
                구하기 어려웠던
                <br />
                <span className="text-lime-400">나의 최애</span>가 여기에!
              </h1>

              <div className="mt-[28px] flex justify-center">
                <ButtonPrimary
                  href="/marketplace"
                  thickness="thin"
                  size="M"
                  className={`${HERO.buttonW} ${HERO.buttonH} !px-0`}
                >
                  최애 찾으러 가기
                </ButtonPrimary>
              </div>
            </div>
          </Container>
        </div>

        {/* ✅ 하단 프리뷰 이미지: lg/md/sm 각각 파일로 교체 */}
        <div className={`absolute inset-x-0 bottom-0 pointer-events-none z-10 ${HERO.previewH}`}>
          <Image
            src={HERO.img1Src}
            alt="hero preview"
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom"
          />
        </div>
      </section>

      <main className="bg-neutral-950 text-white">
        {/* ================= SECTION 2 ================= */}
        <section className="relative bg-neutral-950 overflow-hidden">
          <div className={`relative z-10 ${bp === 'sm' ? 'min-h-[500px]' : 'h-[800px]'}`}>
            <Container className="h-full">
              <div className="relative h-full rounded-[28px] overflow-hidden">
                {/* bg */}
                <img
                  src="/images/landing/background/bg2.svg"
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute z-0 opacity-20"
                  style={{ left: 80, top: 500, width: 1480, height: 1480 }}
                />

                <div
                  className={`relative z-10 h-full flex flex-col justify-start ${SECTION_TYPO.wrapPt}`}
                >
                  {/* 텍스트 래퍼 */}
                  <div className={SECTION_TYPO.textWrap}>
                    <div className={`${SECTION_TYPO.textAlign} ${SECTION_TYPO.textMaxW}`}>
                      <h2 className={SECTION_TYPO.title}>
                        포인트로 <span className="text-lime-400">안전하게</span> 거래하세요
                      </h2>

                      <p className={`${SECTION_TYPO.bodyMt} ${SECTION_TYPO.body} text-neutral-300`}>
                        내 포토카드를 포인트로 팔고, 원하는 포토카드를
                        <br />
                        포인트로 안전하게 교환하세요
                      </p>
                    </div>
                  </div>

                  {/* 이미지 */}
                  <div className="mt-[35px] relative mx-auto w-full max-w-[1068px] aspect-[1068/518]">
                    <Image
                      src="/images/landing/lg/img2.svg"
                      alt="포인트 거래"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </section>

        {/* ================= SECTION 3 ================= */}
        <section className="relative bg-neutral-950 overflow-hidden">
          <div className={`relative z-10 ${bp === 'sm' ? 'min-h-[500px]' : 'h-[800px]'}`}>
            <Container className="h-full">
              <div className="relative h-full rounded-[28px] overflow-hidden">
                {/* bg */}
                <img
                  src="/images/landing/background/bg3.svg"
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute z-0 opacity-20"
                  style={{ left: -80, top: 500, width: 1480, height: 1480 }}
                />

                <div
                  className={`relative z-10 h-full flex flex-col justify-start ${SECTION_TYPO.wrapPt}`}
                >
                  {/* 텍스트 래퍼 */}
                  <div className={SECTION_TYPO.textWrap}>
                    <div className={`${SECTION_TYPO.textAlign} ${SECTION_TYPO.textMaxW}`}>
                      <h2 className={SECTION_TYPO.title}>
                        알림으로 보다 <span className="text-sky-400">빨라진</span> 거래
                      </h2>

                      <p className={`${SECTION_TYPO.bodyMt} ${SECTION_TYPO.body} text-neutral-300`}>
                        교환 제안부터 판매 완료까지,
                        <br />
                        실시간 알림으로 놓치지 마세요
                      </p>
                    </div>
                  </div>

                  {/* 이미지 */}
                  <div className="mt-[35px] relative mx-auto w-full max-w-[1068px] aspect-[1068/518]">
                    <Image
                      src="/images/landing/lg/img3.svg"
                      alt="실시간 알림"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </section>

        {/* ================= SECTION 4 : RANDOM BOX ================= */}
        <section className="relative bg-neutral-950 overflow-hidden sm:pb-[80px]">
          {/* radial bg */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                'radial-gradient(150% 100% at 50% 100%, rgba(239,255,4,0.25) 0%, rgba(0,0,0,0) 70%)',
            }}
          />

          <div className={`relative z-10 ${bp === 'sm' ? 'min-h-[500px]' : 'h-[800px]'}`}>
            <Container className="h-full">
              <div className={`h-full flex flex-col justify-start ${SECTION_TYPO.wrapPt}`}>
                {/* 텍스트 래퍼 */}
                <div className={SECTION_TYPO.textWrap}>
                  <div className={`${SECTION_TYPO.textAlign} ${SECTION_TYPO.textMaxW}`}>
                    <h2 className={SECTION_TYPO.title}>
                      랜덤 상자로 <span className="text-lime-400">포인트 받자!</span> 🎉
                    </h2>

                    <p className={`${SECTION_TYPO.bodyMt} ${SECTION_TYPO.body} text-neutral-300`}>
                      한 시간마다 주어지는 랜덤 상자를 열고,
                      <br />
                      포인트를 획득하세요
                    </p>
                  </div>
                </div>

                {/* 이미지 */}
                <div className="mt-[35px] relative mx-auto w-full max-w-[1068px] aspect-[1068/518]">
                  <Image
                    src="/images/landing/lg/img4.svg"
                    alt="랜덤 상자"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </Container>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="relative bg-neutral-950 overflow-hidden">
          <div className="relative z-10 h-[600px]">
            <Container className="h-full">
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="relative mb-[18px]">
                  <Image
                    src="/images/landing/Rectangle.jpg"
                    alt="CTA 포토카드"
                    width={120}
                    height={150}
                    className="object-contain -rotate-12"
                  />
                </div>

                <h2 className={SECTION_TYPO.title}>나의 최애를 지금 찾아보세요!</h2>

                <div className="mt-[24px]">
                  <ButtonPrimary
                    href="/marketplace"
                    thickness="thin"
                    size="M"
                    className="!w-[266px] !h-[55px] !px-0"
                  >
                    최애 찾으러 가기
                  </ButtonPrimary>
                </div>
              </div>
            </Container>
          </div>
        </section>
      </main>
    </>
  );
}
