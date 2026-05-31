'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { http } from '@/lib/http/client';

import { InputEmail } from '@/components/molecules/InputEmail';
import { InputPassword } from '@/components/molecules/InputPassword';

const EMAIL_MIN_LENGTH = 8;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 30;

function validateEmail(value) {
  if (!value.trim()) return '이메일을 입력해 주세요.';
  if (!value.includes('@')) return '이메일 주소 형식이 올바르지 않습니다.';
  if (value.length < EMAIL_MIN_LENGTH) return '이메일은 8자 이상이어야 합니다.';
  return null;
}

function validatePassword(value) {
  if (!value) return '비밀번호를 입력해 주세요.';
  if (value.length < PASSWORD_MIN_LENGTH || value.length > PASSWORD_MAX_LENGTH) {
    return '비밀번호는 8자 이상 30자 이하여야 합니다.';
  }
  return null;
}

export default function LoginClient() {
  // ✅ env 값 + axios baseURL 동시에 확인
  useEffect(() => {
    console.log('API BASE (env):', process.env.NEXT_PUBLIC_API_BASE_URL);
    console.log('API BASE (axios):', http.defaults.baseURL);
  }, []);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) setPasswordError(decodeURIComponent(error));
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eErr = validateEmail(email);
    const pErr = validatePassword(password);

    setEmailError(eErr || '');
    setPasswordError(pErr || '');
    if (eErr || pErr) return;

    setLoading(true);
    try {
      await http.post('/users/login', { email, password });
      router.push('/');
    } catch (err) {
      const message = err.response?.data?.message ?? '로그인에 실패했습니다.';
      setPasswordError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-black relative">
      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0.9)_55%,rgba(0,0,0,1)_100%)]" />

      <section className="relative min-h-screen flex items-center justify-center px-4 py-8">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="
            w-full
            max-w-[345px]
            min-[500px]:max-w-[440px]
            min-[1200px]:max-w-[520px]
            flex flex-col items-center
            gap-6
          "
        >
          {/* 로고 */}
          <div className="flex justify-center mb-1">
            <Link href="/" className="cursor-pointer">
              <Image
                src="/assets/logos/logo.svg"
                alt="최애의포토"
                width={260}
                height={60}
                priority
              />
            </Link>
          </div>

          {/* 이메일 (컴포넌트 사용) */}
          <div className="w-full">
            <InputEmail
              label="이메일"
              placeholder="이메일을 입력해 주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && (
              <p className="mt-1.5 text-[13px] leading-[1.3] text-red-500">{emailError}</p>
            )}
          </div>

          {/* 비밀번호 (컴포넌트 사용: eye 포함) */}
          <div className="w-full">
            <InputPassword
              label="비밀번호"
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <p className="mt-1.5 text-[13px] leading-[1.3] text-red-500">{passwordError}</p>
            )}
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="
    h-[55px] w-full rounded-[2px]
    border-2 border-[#efff04] bg-[#efff04]
    text-[16px] font-bold text-black
    flex items-center justify-center
    cursor-pointer
    hover:opacity-95
    disabled:opacity-60 disabled:cursor-not-allowed
    mt-2
  "
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          {/* 하단 문구 */}
          <p className="mt-2 text-center text-[14px] text-white/60">
            아직 계정이 없으신가요?
            <Link
              href="/auth/signup"
              className="ml-1.5 font-semibold text-[#efff04] hover:underline"
            >
              회원가입하기
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
