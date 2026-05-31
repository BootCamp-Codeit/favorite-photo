// src/app/(main)/create-card/page.jsx
import Container from '@/components/layout/Container';
import CreateCardForm from './_components/CreateCardForm';

export default function CreateCardPage() {
  return (
    <Container>
      <section className="pt-[50px] max-w-[1400px]">
        <h1 className="text-4xl font-bold">포토카드 생성</h1>
        <div className="mt-6 h-px w-full bg-white/20" />
        <CreateCardForm />
      </section>
    </Container>
  );
}
