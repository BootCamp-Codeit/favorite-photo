'use client';

export default function AlarmDropdownContent({ items = [], loading = false, onItemClick }) {
  if (loading) {
    return (
      <div className="w-[300px] bg-[#161616] px-5 py-4 text-[13px] text-white/60">
        불러오는 중...
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="w-[300px] bg-[#161616] px-5 py-4 text-[13px] text-white/60">
        알림이 없습니다.
      </div>
    );
  }

  return (
    <div className="w-[300px] bg-[#161616]">
      {items.map((a) => (
        <button
          key={a.id}
          type="button"
          onClick={() => onItemClick?.(a)}
          className="
            w-full text-left
            px-5 py-4
            cursor-pointer
            hover:bg-white/5
            focus:outline-none focus:bg-white/5
          "
        >
          <div className="text-[14px] font-normal leading-[1.4] text-white">{a.message}</div>
          <div className="mt-2 text-[12px] font-light text-white/50">{a.timeText}</div>
          <div className="mt-4 h-px w-full bg-white/20" />
        </button>
      ))}
    </div>
  );
}
