'use client';

export default function ProfileDropdownContent({ userName, ownedPoint = 0, onLogout, onNavigate }) {
  const itemBase =
    'block w-full text-left px-5 py-3 cursor-pointer text-[14px] font-bold leading-[1] text-white ' +
    'hover:bg-white/5 hover:text-white focus:outline-none focus:bg-white/5';

  return (
    <div className="w-[260px] bg-[#161616]">
      {/* top */}
      <div className="px-5 pt-5 pb-4">
        <div className="text-[18px] font-bold leading-[1] text-white">
          안녕하세요, {userName}님!
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[12px] font-light leading-[1] text-white/50">보유 포인트</span>
          <span className="text-[12px] font-normal leading-[1] text-yellow-300">
            {Number(ownedPoint).toLocaleString()} P
          </span>
        </div>
      </div>

      <div className="h-px w-full bg-white/20" />

      {/* menu */}
      <div className="py-2">
        <button type="button" onClick={() => onNavigate('/marketplace')} className={itemBase}>
          마켓플레이스
        </button>

        <button type="button" onClick={() => onNavigate('/mygallery')} className={itemBase}>
          마이갤러리
        </button>

        <button
          type="button"
          onClick={() => onNavigate('/mygallery/selling-card')}
          className={itemBase}
        >
          판매 중인 포토카드
        </button>
      </div>

      <div className="h-px w-full bg-white/20" />

      {/* logout */}
      <button
        type="button"
        onClick={onLogout}
        className="
          w-full text-left px-5 py-4
          cursor-pointer
          text-[14px] font-normal text-white/50
          hover:bg-white/5 hover:text-white
          focus:outline-none focus:bg-white/5
        "
      >
        로그아웃
      </button>
    </div>
  );
}
