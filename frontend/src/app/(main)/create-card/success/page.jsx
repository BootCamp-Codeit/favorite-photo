import Container from '@/components/layout/Container';
import SuccessClient from './SuccessClient';

const gradeLabelMap = {
  common: 'COMMON',
  rare: 'RARE',
  epic: 'SUPER RARE',
  legendary: 'LEGENDARY',
};

export default function CreateCardSuccessPage({ searchParams }) {
  const grade = searchParams?.grade ?? 'rare';
  const title = searchParams?.title ?? '제목 없음';

  const gradeLabel = gradeLabelMap[grade] ?? grade;

  return (
    <main className="min-h-screen bg-black text-white relative">
      <Container className="min-h-screen grid place-items-center relative">
        <SuccessClient grade={gradeLabel} title={title} />
      </Container>
    </main>
  );
}
