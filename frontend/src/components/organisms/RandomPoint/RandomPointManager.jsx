'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import RandomPointSelectModal from './RandomPointSelectModal';
import RandomPointResultModal from './RandomPointResultModal';
import { apiUrl } from '@/lib/http/baseUrl'; // 위에서 만든 유틸

const COOLDOWN_SECONDS = 60 * 60;
const POLL_MS = 30 * 1000;

const POINT_DRAW_PATH = '/api/point-box-draws/draw';
const POINT_HISTORY_PATH = '/api/point-box-draws/draw-history';

function pad2(n) {
  return String(n).padStart(2, '0');
}
function formatRemain(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${h}시간 ${pad2(m)}분 ${pad2(ss)}초`;
}
function parseDateSafe(v) {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export default function RandomPointManager() {
  // TODO: 로그인 붙으면 userId 제거하고 서버에서 req.user로 처리
  const userId = 1;

  const [selectOpen, setSelectOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);

  const [earnedPoint, setEarnedPoint] = useState(0);
  const [remainSeconds, setRemainSeconds] = useState(COOLDOWN_SECONDS);
  const [loadingDraw, setLoadingDraw] = useState(false);

  const lastAutoOpenKeyRef = useRef(null);

  const timeText = useMemo(() => formatRemain(remainSeconds), [remainSeconds]);
  const canDraw = remainSeconds <= 0;

  useEffect(() => {
    const t = setInterval(() => {
      setRemainSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const refreshStatus = useCallback(async () => {
    try {
      const qs = new URLSearchParams({ userId: String(userId), limit: '1', offset: '0' });
      const url = `${apiUrl(POINT_HISTORY_PATH)}?${qs.toString()}`;

      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error(`status HTTP ${res.status}`);

      const json = await res.json();
      if (!json?.ok) throw new Error('status ok:false');

      const raw = json.data;
      const rows = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];

      const last = rows[0];
      if (!last) {
        setRemainSeconds(0);
        return;
      }

      const lastAt = parseDateSafe(last.reg_date ?? last.regDate);
      if (!lastAt) {
        setRemainSeconds(0);
        return;
      }

      const diffSec = Math.floor((Date.now() - lastAt.getTime()) / 1000);
      setRemainSeconds(Math.max(0, COOLDOWN_SECONDS - diffSec));
    } catch {
      // ignore
    }
  }, [userId]);

  useEffect(() => {
    refreshStatus();
    const t = setInterval(refreshStatus, POLL_MS);
    return () => clearInterval(t);
  }, [refreshStatus]);

  useEffect(() => {
    if (!canDraw) return;

    const hourBucket = Math.floor(Date.now() / (COOLDOWN_SECONDS * 1000));
    const key = `${userId}:${hourBucket}`;

    if (lastAutoOpenKeyRef.current === key) return;
    lastAutoOpenKeyRef.current = key;

    setSelectOpen(true);
  }, [canDraw, userId]);

  // ✅ 선택 박스 id도 받아서 보내도록
  const draw = useCallback(
    async (boxId) => {
      setLoadingDraw(true);
      try {
        const url = apiUrl(POINT_DRAW_PATH);

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId, boxId }),
        });

        if (res.status === 429) {
          await refreshStatus();
          return { ok: false, reason: 'COOLDOWN' };
        }
        if (!res.ok) throw new Error(`draw HTTP ${res.status}`);

        const json = await res.json();
        if (!json?.ok) throw new Error('draw ok:false');

        const data = json.data ?? json;
        const earned = Number(data.earnedPoints ?? data.earnedPoint ?? 0) || 0;

        setEarnedPoint(earned);
        setSelectOpen(false);
        setResultOpen(true);

        setRemainSeconds(COOLDOWN_SECONDS);
        return { ok: true };
      } finally {
        setLoadingDraw(false);
      }
    },
    [userId, refreshStatus],
  );

  const handleConfirm = useCallback(
    async (selectedBoxId) => {
      if (loadingDraw) return;
      if (!selectedBoxId) return;
      await draw(selectedBoxId);
    },
    [draw, loadingDraw],
  );

  return (
    <>
      <RandomPointSelectModal
        open={selectOpen}
        onClose={() => setSelectOpen(false)}
        onConfirm={handleConfirm}
        timeText={timeText}
      />
      <RandomPointResultModal
        open={resultOpen}
        onClose={() => setResultOpen(false)}
        earnedPoint={earnedPoint}
        timeText={timeText}
      />
    </>
  );
}
