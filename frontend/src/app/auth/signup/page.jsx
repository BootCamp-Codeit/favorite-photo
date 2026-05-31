'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { InputEmail } from '@/components/molecules/InputEmail';
import { InputPassword } from '@/components/molecules/InputPassword';
import InputLabel from '@/components/molecules/InputLabel/InputLabel';
import ButtonPrimary from '@/components/atoms/Button/ButtonPrimary';

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const canSubmit = useMemo(() => {
    return (
      email.trim() &&
      nickname.trim() &&
      password.trim() &&
      passwordConfirm.trim() &&
      password === passwordConfirm
    );
  }, [email, nickname, password, passwordConfirm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setErrorMsg('');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

      const res = await fetch(`${baseUrl}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim(),
          nickname: nickname.trim(),
          password,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorMsg(data?.message ?? '회원가입에 실패했습니다.');
        return;
      }

      // 회원가입 성공 → 로그인으로 이동
      router.replace('/auth/login');
    } catch (err) {
      setErrorMsg('네트워크 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0b0b0b]">
      {/* vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(65% 65% at 50% 45%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 60%),
            radial-gradient(85% 85% at 50% 60%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 75%)
          `,
        }}
      />

      {/* center */}
      <section className="relative z-10 grid min-h-screen place-items-center px-6 py-12">
        <div className="flex w-full max-w-[980px] flex-col items-stretch">
          {/* logo */}
          <div className="flex justify-center mb-1">
            <Link href="/" className="cursor-pointer">
              <Image
                src="/assets/logos/logo.svg"
                alt="최애의포토"
                width={260}
                height={60}
                priority
                className="mb-[30px]"
              />
            </Link>
          </div>

          {/* form */}
          <form className="flex w-full flex-col items-center gap-[18px]" onSubmit={handleSubmit}>
            {/* inputs */}
            <div className="w-full max-w-[520px]">
              <InputEmail
                label="이메일"
                placeholder="이메일을 입력해 주세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="w-full max-w-[520px]">
              <InputLabel
                label="닉네임"
                placeholder="닉네임을 입력해 주세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={30}
              />
            </div>

            <div className="w-full max-w-[520px]">
              <InputPassword
                label="비밀번호"
                placeholder="8자 이상 입력해 주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="w-full max-w-[520px]">
              <InputPassword
                label="비밀번호 확인"
                placeholder="비밀번호를 한번 더 입력해 주세요"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>

            {/* client validations */}
            {passwordConfirm && password !== passwordConfirm && (
              <p className="w-full max-w-[520px] text-left text-[12px] text-red-400">
                비밀번호가 일치하지 않습니다.
              </p>
            )}

            {/* server error */}
            {errorMsg && (
              <p className="w-full max-w-[520px] text-left text-[12px] text-red-400">{errorMsg}</p>
            )}

            {/* submit */}
            <div className="mt-10 mb-10 w-full max-w-[520px]">
              <ButtonPrimary
                type="submit"
                size="l"
                disabled={!canSubmit || submitting}
                className="h-[60px] w-full"
              >
                {submitting ? '가입 중...' : '가입하기'}
              </ButtonPrimary>
            </div>

            {/* bottom text */}
            <p className="text-center text-[12px] text-white/70">
              이미 최애의포토 회원이신가요?
              <Link href="/auth/login" className="ml-1 font-bold text-[#efff04] underline">
                로그인하기
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
