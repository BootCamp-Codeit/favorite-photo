const WIDTH = {
  main: 'max-w-[1200px] xl:max-w-[1280px]',
  auth: 'max-w-[420px] sm:max-w-[480px]',
};

export default function Container({ children, className = '', variant = 'main' }) {
  return (
    <div
      className={['mx-auto w-full', 'px-4 sm:px-6 lg:px-8', WIDTH[variant], className].join(' ')}
    >
      {children}
    </div>
  );
}
