'use client';

import Image from 'next/image';
import { Modal } from '@/components/atoms/Modal';
import useBreakpoint from '@/hooks/useBreakpoint';
import { getRewardImage } from '@/utils/eventImages';
import styles from './RandomPointResultModal.module.css';

export default function RandomPointResultModal({
  open,
  onClose,
  earnedPoint = 2,
  timeText = '59분 59초',
}) {
  const bp = useBreakpoint();
  const size = bp === 'sm' ? 'sm' : bp === 'md' ? 'md' : 'lg';

  const pointImageSrc = getRewardImage(size);

  return (
    <Modal
      open={open}
      onClose={onClose}
      showCloseButton={false}
      closeOnOverlay
      closeOnEsc
      noBorder
      containerClassName={styles.container}
    >
      <div className={styles.root}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="닫기">
          ×
        </button>

        <h2 className={styles.title}>
          랜덤<span className={styles.titleAccent}>포인트</span>
        </h2>

        <div className={styles.illust}>
          <Image src={pointImageSrc} alt="포인트 획득" width={340} height={324} priority />
        </div>

        <p className={styles.reward}>
          <span className={styles.rewardAccent}>{earnedPoint}P</span> 획득!
        </p>

        <p className={styles.timer}>
          다음 기회까지 남은 시간 <span className={styles.timerAccent}>{timeText}</span>
        </p>
      </div>
    </Modal>
  );
}
