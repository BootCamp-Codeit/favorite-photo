'use client';

/*
  Modal Atom 요약
  -------------------
  1. open 여부에 따른 렌더링 제어
  2. overlay(배경 dim) 렌더링
  3. ESC 키로 닫기 처리
  4. overlay 클릭으로 닫기 처리
  5. body 스크롤 잠금 / 해제
  6. portal을 이용해 document.body 최상단에 렌더링
  7. 닫기 버튼(X) 표시 여부 제어
  8. size 옵션에 따른 모달 크기 제어
  9. 접근성(role, aria-modal) 기본 제공
*/

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export default function Modal({
  open,
  onClose,
  children,
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseButton = true,
  size = 'md',
  noBorder = false,

  containerClassName = '',
  overlayClassName = '',
}) {
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (!closeOnEsc) return;
      if (e.key === 'Escape') onClose?.();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, closeOnEsc, onClose]);

  if (!open) return null;

  const isBottomSheet = size === 'bottomSheet';
  const isBottomSheetFull = size === 'bottomSheetFull';

  const overlayExtra = isBottomSheetFull
    ? styles.overlayBottomSheetFull
    : isBottomSheet
      ? styles.overlayBottomSheet
      : '';

  const containerExtra = isBottomSheetFull
    ? styles.bottomSheetFull
    : isBottomSheet
      ? styles.bottomSheet
      : styles[size];

  const computedOverlayClassName = [styles.overlay, overlayExtra].filter(Boolean).join(' ');

  return createPortal(
    <div className={[computedOverlayClassName, overlayClassName].filter(Boolean).join(' ')}>
      <div className={styles.backdrop} onClick={closeOnOverlay ? onClose : undefined} />

      <div
        className={[
          styles.container,
          containerExtra,
          noBorder ? styles.customNoBorder : '',
          containerClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        role="dialog"
        aria-modal="true"
      >
        {showCloseButton && (
          <button className={styles.close} onClick={onClose} aria-label="닫기">
            ×
          </button>
        )}

        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
