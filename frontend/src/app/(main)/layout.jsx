import Header from '@/components/layout/Header';
import RandomPointManager from '@/components/organisms/RandomPoint/RandomPointManager';

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <RandomPointManager />
      <main
        style={{
          minHeight: 'calc(100vh - 120px)',
          backgroundColor: '#000000',
          width: '100%',
        }}
      >
        {children}
      </main>
    </>
  );
}
