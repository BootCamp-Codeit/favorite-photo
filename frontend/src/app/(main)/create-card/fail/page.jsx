import Container from '@/components/layout/Container';
import FailClient from './FailClient';

const gradeLabelMap = {
  common: 'COMMON',
  rare: 'RARE',
  epic: 'SUPER RARE',
  legendary: 'LEGENDARY',
};

export default function CreateCardFailPage({ searchParams }) {
  const grade = searchParams?.grade ?? 'rare';
  const title = searchParams?.title ?? '제목 없음';

  const gradeLabel = gradeLabelMap[grade] ?? grade;

  return (
    <main className="min-h-screen bg-black text-white relative">
      <Container className="min-h-screen grid place-items-center relative">
        <FailClient grade={gradeLabel} title={title} />
      </Container>
    </main>
  );
}
