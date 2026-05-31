import Grade from '@/components/atoms/Grade/Grade';

const STYLE = {
  common: { border: 'border-yellow-300', text: 'text-yellow-300' },
  rare: { border: 'border-sky-300', text: 'text-sky-300' },
  superRare: { border: 'border-purple-300', text: 'text-purple-300' },
  legendary: { border: 'border-pink-300', text: 'text-pink-300' },
};

const ORDER = ['common', 'rare', 'superRare', 'legendary'];

export default function GradeChips({ counts }) {
  return (
    <div className="flex gap-[20px]">
      {ORDER.map((grade) => {
        const s = STYLE[grade];
        const count = counts?.[grade] ?? 0;

        return (
          <div
            key={grade}
            className={`inline-flex items-center h-[40px] px-[20px] gap-[10px] border ${s.border}`}
          >
            <Grade grade={grade} size="sm" className={`!font-light ${s.text}`} />
            <span className={`text-[16px] font-light ${s.text}`}>{count}장</span>
          </div>
        );
      })}
    </div>
  );
}
