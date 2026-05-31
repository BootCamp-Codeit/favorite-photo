'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/atoms/Modal';
import { ButtonPrimary } from '@/components/atoms/Button';
import useBreakpoint from '@/hooks/useBreakpoint';
import { getEventImage } from '@/utils/eventImages';
import styles from './RandomPointSelectModal.module.css';

const UI = {
  lg: { boxW: 250, boxH: 198 },
  md: { boxW: 165, boxH: 127 },
  sm: { boxW: 98, boxH: 76 },
};

export default function RandomPointSelectModal({
  open,
  onClose,
  onConfirm,
  timeText = '59분 59초',
}) {
  const bp = useBreakpoint();
  const size = bp === 'sm' ? 'sm' : bp === 'md' ? 'md' : 'lg';
  const { boxW, boxH } = UI[size] ?? UI.lg;

  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const isSelected = Boolean(selectedBoxId);

  const containerSizeClass =
    size === 'sm' ? styles.containerSm : size === 'md' ? styles.containerMd : styles.containerLg;

  const containerHeightClass = isSelected ? styles.containerSelected : styles.containerDefault;

  const handleClose = () => {
    setSelectedBoxId(null);
    onClose?.();
  };

  const box1 = useMemo(() => getEventImage(size, 'box_01.png'), [size]);
  const box2 = useMemo(() => getEventImage(size, 'box_02.png'), [size]);
  const box3 = useMemo(() => getEventImage(size, 'box_03.png'), [size]);

  const handlePick = (id) => setSelectedBoxId(id);

  const handleConfirm = () => {
    if (!selectedBoxId) return;
    onConfirm?.(selectedBoxId);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      showCloseButton={false}
      closeOnOverlay
      closeOnEsc
      noBorder
      containerClassName={[styles.container, containerSizeClass, containerHeightClass].join(' ')}
    >
      <div className={styles.root}>
        <button type="button" className={styles.close} onClick={handleClose} aria-label="닫기">
          ×
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>
            랜덤<span className={styles.titleAccent}>포인트</span>
          </h2>

          <p className={styles.desc}>
            1시간마다 돌아오는 기회!
            <br />
            랜덤 상자 뽑기를 통해 포인트를 획득하세요!
          </p>

          <p className={styles.timer}>
            다음 기회까지 남은 시간 <span className={styles.timerAccent}>{timeText}</span>
          </p>
        </div>

        <div
          className={[
            styles.boxRow,
            size === 'md' && styles.boxRowMd,
            size === 'sm' && styles.boxRowSm,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <button
            type="button"
            className={[
              styles.boxButton,
              selectedBoxId === 'box1' && styles.boxSelected,
              isSelected && selectedBoxId !== 'box1' && styles.boxDimmed,
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handlePick('box1')}
            aria-pressed={selectedBoxId === 'box1'}
          >
            <Image src={box1} alt="랜덤 박스 1" width={boxW} height={boxH} priority />
          </button>

          <button
            type="button"
            className={[
              styles.boxButton,
              selectedBoxId === 'box2' && styles.boxSelected,
              isSelected && selectedBoxId !== 'box2' && styles.boxDimmed,
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handlePick('box2')}
            aria-pressed={selectedBoxId === 'box2'}
          >
            <Image src={box2} alt="랜덤 박스 2" width={boxW} height={boxH} priority />
          </button>

          <button
            type="button"
            className={[
              styles.boxButton,
              selectedBoxId === 'box3' && styles.boxSelected,
              isSelected && selectedBoxId !== 'box3' && styles.boxDimmed,
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handlePick('box3')}
            aria-pressed={selectedBoxId === 'box3'}
          >
            <Image src={box3} alt="랜덤 박스 3" width={boxW} height={boxH} priority />
          </button>
        </div>

        {isSelected && (
          <div className={styles.footer}>
            <ButtonPrimary
              thickness="thin"
              size="l"
              className={styles.confirmButton}
              onClick={handleConfirm}
            >
              선택완료
            </ButtonPrimary>
          </div>
        )}
      </div>
    </Modal>
  );
}
