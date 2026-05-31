'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/atoms/Modal';
import { ButtonPrimary } from '@/components/atoms/Button';
import useBreakpoint from '@/hooks/useBreakpoint';

export default function LoginRequiredModal({ open, onClose, redirectTo = '/marketplace' }) {
  const router = useRouter();
  const bp = useBreakpoint();

  const ui = useMemo(() => {
    switch (bp) {
      case 'sm':
        return {
          containerClass: 'w-[345px] h-[291px] px-6 py-6',
          buttonSize: 's',
          buttonWrapClass: 'w-[120px]', // ✅ 버튼 폭 (S)
          buttonH: 55,
        };

      case 'md':
        return {
          containerClass: 'w-[400px] h-[291px] px-7 py-7',
          buttonSize: 'm',
          buttonWrapClass: 'w-[140px]', // ✅ 버튼 폭 (M)
          buttonH: 60,
        };

      case 'lg':
      default:
        return {
          containerClass: 'w-[560px] h-[375px] px-8 py-8',
          buttonSize: 'l',
          buttonWrapClass: 'w-[170px]', // ✅ 버튼 폭 (L)
          buttonH: 60,
        };
    }
  }, [bp]);

  const handleConfirm = () => {
    onClose?.();
    router.push(`/auth/login?redirect=${encodeURIComponent(redirectTo)}`);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      containerClassName={[
        'rounded-xl bg-neutral-900 border border-white/10',
        ui.containerClass,
        'flex flex-col',
      ].join(' ')}
      showCloseButton
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h2 className="text-white text-lg font-bold">로그인이 필요합니다.</h2>

        <p className="mt-10 mb-10 text-sm text-white/60 leading-relaxed">
          로그인 하시겠습니까?
          <br />
          다양한 서비스를 편리하게 이용하실 수 있습니다.
        </p>

        <div className={['mt-6', ui.buttonWrapClass].join(' ')}>
          <ButtonPrimary
            size={ui.buttonSize}
            thickness="thin"
            onClick={handleConfirm}
            style={{ width: '100%', height: ui.buttonH }}
          >
            확인
          </ButtonPrimary>
        </div>
      </div>
    </Modal>
  );
}
