const LABEL = {
  common: 'COMMON',
  rare: 'RARE',
  superRare: 'SUPER RARE',
  legendary: 'LEGENDARY',
};

const COLOR = {
  common: 'text-yellow-300',
  rare: 'text-sky-300',
  superRare: 'text-purple-300',
  legendary: 'text-pink-300',
};

export default function Grade({ grade, size = 'sm', className = '' }) {
  const base = 'font-semibold leading-[100%] tracking-[0%]';

  const sizeClass = {
    sm: 'text-[16px]',
    lg: 'text-[24px]',
  }[size];

  return (
    <span className={`${base} ${sizeClass} ${COLOR[grade]} ${className}`}>{LABEL[grade]}</span>
  );
}
