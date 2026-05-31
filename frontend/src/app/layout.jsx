import './globals.css';

export const metadata = {
  title: '최애의 포토',
  description: '개인용 디지털 사진첩 생성 플랫폼',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="bg-neutral-950 text-white">{children}</body>
    </html>
  );
}
