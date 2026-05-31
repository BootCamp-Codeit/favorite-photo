// src/components/atoms/Title/Title.jsx
// created by Myeonghwan Kim
// tailwind css 사용, 따로 폰트 적용 added by Taeyoung, 1/21/2026
'use client';

export default function Title({ text, as = 'h1', showLine = false, className, style }) {
  //props 추가
  const Heading = as;

  return (
    //style 추가 tailwind css 사용
    <div className="flex flex-col gap-4">
      <Heading
        className={`text-white ${className ?? ''}`.trim()}
        style={{
          fontFamily: '"BR B", sans-serif',
          fontWeight: 400,
          fontSize: '62px',
          lineHeight: '100%',
          letterSpacing: '-0.03em',
          ...(style ?? {}),
        }}
      >
        {text}
      </Heading>
    </div>
  );
}
