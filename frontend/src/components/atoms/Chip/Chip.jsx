const LABEL = {
  selling: '판매 중',
  exchangePending: '교환 제시 대기 중',
};

export default function Chip({ status, size = 'lg', className = '' }) {
  // 박스(컨테이너)
  const boxBase = 'inline-flex items-center justify-center border-2 rounded bg-neutral-900';
  const boxSize = {
    lg: 'h-[31px] px-[10px] py-[4px]',
    md: 'h-[27px] px-[10px] py-[4px]',
    sm: 'h-[23px] px-[10px] py-[4px]',
  }[size];

  // 텍스트
  const textBase = 'font-normal leading-[100%] tracking-[0%]';
  const textSize = {
    lg: 'text-[16px]',
    md: 'text-[14px]',
    sm: 'text-[12px]',
  }[size];
  const textColor = status === 'selling' ? 'text-white' : 'text-yellow-300';

  return (
    <span className={`${boxBase} ${boxSize} ${className}`}>
      <span className={`${textBase} ${textSize} ${textColor}`}>{LABEL[status]}</span>
    </span>
  );
}
