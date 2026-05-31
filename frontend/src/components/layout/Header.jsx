'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { http } from '@/lib/http/client';

import AlarmDropdownContent from './_components/AlarmDropdownContent';
import ProfileDropdownContent from './_components/ProfileDropdownContent';

/* ======================
   utils
====================== */
function formatTimeAgo(input) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  const diff = Date.now() - d.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return '방금 전';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}분 전`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;
  const day = Math.floor(hour / 24);
  return `${day}일 전`;
}

export default function Header() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  /* ======================
     mobile menu
  ====================== */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const menuTriggerRef = useRef(null);

  /* ======================
     profile dropdown
  ====================== */
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileWrapRef = useRef(null);

  /* ======================
     alarm dropdown
  ====================== */
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const alarmWrapRefDesktop = useRef(null);
  const alarmWrapRefMobile = useRef(null);

  // ✅ 알림 상태
  const [alarms, setAlarms] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [alarmLoading, setAlarmLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  /* ======================
     mobile menu position
  ====================== */
  useEffect(() => {
    if (!mounted || !isMenuOpen || !menuTriggerRef.current) return;
    const rect = menuTriggerRef.current.getBoundingClientRect();
    setMenuStyle({ top: rect.bottom + 6, left: rect.left });
  }, [mounted, isMenuOpen]);

  /* ======================
     user fetch
  ====================== */
  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await http.get('/users/me');
        setUser(data?.user ?? null);
      } catch {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    }
    fetchUser();
  }, []);

  /* ======================
     notifications fetch
  ====================== */
  const fetchNotifications = useCallback(async () => {
    if (!user || alarmLoading) return;

    setAlarmLoading(true);
    try {
      const { data } = await http.get('/notifications?limit=20');
      if (!data?.ok) throw new Error('notifications ok:false');

      const items = Array.isArray(data?.data?.items) ? data.data.items : [];

      setAlarms(
        items.map((n) => ({
          id: n.id,
          message: n.message,
          timeText: n.createdAt ? formatTimeAgo(n.createdAt) : '',
          isRead: Boolean(n.isRead),
        })),
      );

      setUnreadCount(Number(data?.data?.unreadCount) || 0);
    } catch {
      setAlarms([]);
      setUnreadCount(0);
    } finally {
      setAlarmLoading(false);
    }
  }, [user, alarmLoading]);

  const handleToggleAlarm = async () => {
    setIsAlarmOpen((v) => !v);
    setIsProfileOpen(false);
    await fetchNotifications();
  };

  /* ======================
     logout
  ====================== */
  async function handleLogout() {
    try {
      await http.post('/users/logout');
    } finally {
      setUser(null);
      setAlarms([]);
      setUnreadCount(0);
      setIsMenuOpen(false);
      setIsAlarmOpen(false);
      setIsProfileOpen(false);
      router.replace('/');
      router.refresh();
    }
  }

  /* ======================
     outside click
  ====================== */
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        menuTriggerRef.current &&
        !menuTriggerRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }

      if (profileWrapRef.current && !profileWrapRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }

      const inDesktop =
        alarmWrapRefDesktop.current && alarmWrapRefDesktop.current.contains(e.target);
      const inMobile = alarmWrapRefMobile.current && alarmWrapRefMobile.current.contains(e.target);

      if (!inDesktop && !inMobile) {
        setIsAlarmOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.nickname ?? user?.email ?? '';
  const points = user?.points ?? 0;

  const isAlarmOn = unreadCount > 0;
  const alarmIconSrc = isAlarmOn ? '/assets/icons/ic_alarm_on.svg' : '/assets/icons/ic_alarm.svg';

  return (
    <header className="sticky top-0 z-50 w-full bg-black">
      <Container className="flex h-[72px] items-center justify-between">
        {/* ================= Desktop ================= */}
        <div className="hidden min-[768px]:flex w-full items-center justify-between">
          <Link href="/" className="no-underline">
            <Image src="/assets/logos/logo.svg" alt="최애의포토" width={140} height={28} priority />
          </Link>

          <div className="flex items-center gap-4 text-sm text-white/80">
            {authLoading ? (
              <span className="text-white/50">...</span>
            ) : user ? (
              <>
                <div className="flex items-center gap-1">
                  <span>{Number(points).toLocaleString()}</span>
                  <span>P</span>
                </div>

                {/* Alarm */}
                <div ref={alarmWrapRefDesktop} className="relative">
                  <button
                    type="button"
                    onClick={handleToggleAlarm}
                    className="relative rounded p-2 text-white/70 hover:bg-white/10"
                    aria-label="알림"
                  >
                    <Image src={alarmIconSrc} alt="알림" width={24} height={24} />
                    {unreadCount > 0 && (
                      <span className="absolute right-[6px] top-[6px] h-[6px] w-[6px] rounded-full bg-red-500" />
                    )}
                  </button>

                  {isAlarmOpen && (
                    <div className="absolute right-0 top-[calc(100%+10px)] z-[9999] rounded-[12px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
                      <AlarmDropdownContent items={alarms} loading={alarmLoading} />
                    </div>
                  )}
                </div>

                {/* Profile */}
                <div ref={profileWrapRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen((v) => !v);
                      setIsAlarmOpen(false);
                    }}
                    className="rounded px-2 py-2 text-white/80 hover:bg-white/10"
                  >
                    {displayName}
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 top-[calc(100%+10px)] z-[9999] rounded-[12px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
                      <ProfileDropdownContent
                        userName={displayName}
                        ownedPoint={Number(points) || 0}
                        onLogout={handleLogout}
                        onNavigate={(href) => {
                          setIsProfileOpen(false);
                          router.push(href);
                        }}
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="cursor-pointer text-white/50 hover:text-white"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="cursor-pointer text-yellow-300 hover:underline">
                로그인
              </Link>
            )}
          </div>
        </div>

        {/* ================= Mobile ================= */}
        <div className="flex w-full min-[768px]:hidden items-center gap-2 px-2">
          <div className="flex flex-1 justify-start">
            {user && (
              <button
                ref={menuTriggerRef}
                onClick={() => setIsMenuOpen((v) => !v)}
                className="rounded p-2 text-white/70 hover:bg-white/10"
              >
                <Image src="/assets/icons/ic_menu.svg" alt="" width={24} height={24} />
              </button>
            )}
          </div>

          <Link href="/" className="flex flex-1 justify-center">
            <Image src="/assets/logos/logo.svg" alt="최애의포토" width={120} height={24} />
          </Link>

          <div className="flex flex-1 justify-end">
            {user && (
              <div ref={alarmWrapRefMobile} className="relative">
                <button onClick={handleToggleAlarm} className="relative p-2">
                  <Image src={alarmIconSrc} alt="알림" width={24} height={24} />
                  {unreadCount > 0 && (
                    <span className="absolute right-[6px] top-[6px] h-[6px] w-[6px] rounded-full bg-red-500" />
                  )}
                </button>

                {isAlarmOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] z-[9999] rounded-[12px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
                    <AlarmDropdownContent items={alarms} loading={alarmLoading} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>

      <div className="h-px w-full bg-white/20" />
    </header>
  );
}
