// src/app/(main)/create-card/_components/CreateCardForm.jsx
'use client';

import { useMemo, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import Input from '@/components/atoms/Input/Input';
import TextBox from '@/components/atoms/TextBox/TextBox';
import { ButtonPrimary } from '@/components/atoms/Button';
import Modal from '@/components/atoms/Modal/Modal';

import CreateCardDropdown from './CreateCardDropdown';
import FormField from './FormField';

// ✅ Netlify env 예시: https://be-1-yqrf.onrender.com/api
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

const GRADE_OPTIONS = [
  { label: 'COMMON', value: 'common' },
  { label: 'RARE', value: 'rare' },
  { label: 'SUPER RARE', value: 'epic' }, // BE: epic
  { label: 'LEGENDARY', value: 'legendary' },
];

const GENRE_OPTIONS = [
  { label: '풍경', value: '풍경' },
  { label: '음식', value: '음식' },
  { label: '인물', value: '인물' },
  { label: '동물', value: '동물' },
];

const FIELD_TEXT =
  'text-[16px] font-light leading-[1] tracking-[0] text-gray-200 placeholder:text-gray-200';

const FIELD_BOX =
  'w-full h-[60px] rounded-[2px] border border-gray-200 bg-black px-[20px] py-[18px] outline-none disabled:opacity-60';

const FIELD_ERROR = '!border-red-500';
const FIELD_CLASS = `${FIELD_BOX} ${FIELD_TEXT}`;

const FILE_BUTTON_CLASS = `
  !h-[60px]
  !rounded-[2px]
  !border
  !border-main
  !bg-transparent
  !px-[28px]
  !py-[18px]
  !text-[16px]
  !font-light
  !leading-[1]
  !tracking-[0]
  !text-main
  hover:!text-main
  active:!text-main
  hover:!bg-transparent
  active:!bg-transparent
  !shadow-none
`.trim();

const onlyDigits = (v) => v.replace(/\D/g, '');

export default function CreateCardForm() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // values
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState('');
  const [total, setTotal] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);

  // modal
  const [fileErrorOpen, setFileErrorOpen] = useState(false);

  // submitting
  const [submitting, setSubmitting] = useState(false);

  // touched
  const [touched, setTouched] = useState({
    name: false,
    grade: false,
    genre: false,
    price: false,
    total: false,
    file: false,
    desc: false,
  });

  // scroll targets
  const refs = {
    name: useRef(null),
    grade: useRef(null),
    genre: useRef(null),
    price: useRef(null),
    total: useRef(null),
    file: useRef(null),
    desc: useRef(null),
  };

  const errors = useMemo(() => {
    const e = {};

    if (!name.trim()) e.name = '포토카드 이름을 입력해 주세요.';
    else if (name.trim().length > 20) e.name = '포토카드 이름은 20자 이내로 입력해 주세요.';

    if (!grade) e.grade = '등급을 선택해 주세요.';
    if (!genre) e.genre = '장르를 선택해 주세요.';

    if (price === '') e.price = '가격을 입력해 주세요.';
    else if (!/^\d+$/.test(price)) e.price = '가격은 숫자만 입력해 주세요.';

    if (total === '') e.total = '총 발행량을 입력해 주세요.';
    else if (!/^\d+$/.test(total)) e.total = '총 발행량은 숫자만 입력해 주세요.';
    else {
      const n = Number(total);
      if (n < 1 || n > 10) e.total = '총 발행량은 1~10장 이내로만 설정 가능합니다.';
    }

    if (!file) e.file = '이미지를 업로드해 주세요.';

    if (!desc.trim()) e.desc = '포토카드 설명을 입력해 주세요.';
    else if (desc.length > 500) e.desc = '포토카드 설명은 500자 이내로 입력해 주세요.';

    return e;
  }, [name, grade, genre, price, total, file, desc]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);
  const showError = (key) => touched[key] && !!errors[key];

  const scrollToFirstError = useCallback(() => {
    const order = ['name', 'grade', 'genre', 'price', 'total', 'file', 'desc'];
    const first = order.find((k) => errors[k]);
    if (!first) return;
    refs[first]?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [errors]);

  const openFilePicker = (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handlePickFile = (e) => {
    const picked = e.target.files?.[0] ?? null;

    if (!picked) {
      setTouched((t) => ({ ...t, file: true }));
      return;
    }

    const okTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const okExt = /\.(jpe?g|png|webp)$/i.test(picked.name);

    if (!okTypes.includes(picked.type) || !okExt) {
      setFile(null);
      setTouched((t) => ({ ...t, file: true }));
      setFileErrorOpen(true);
      e.target.value = '';
      return;
    }

    setFile(picked);
    setTouched((t) => ({ ...t, file: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      grade: true,
      genre: true,
      price: true,
      total: true,
      file: true,
      desc: true,
    });

    if (!isValid) {
      scrollToFirstError();
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      if (!API_BASE) throw new Error('NEXT_PUBLIC_API_BASE_URL is missing');

      const formData = new FormData();
      // ✅ 정석: creatorUserId 보내지 않음 (서버가 req.user로 결정)
      formData.append('name', name.trim());
      formData.append('description', desc.trim());
      formData.append('genre', genre);
      formData.append('grade', grade); // common / rare / epic / legendary
      formData.append('minPrice', String(Number(price)));
      formData.append('totalSupply', String(Number(total)));
      formData.append('file', file);

      // ✅ env에 /api 포함이므로 /api를 또 붙이지 말 것
      const res = await fetch(`${API_BASE}/photo-cards`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const qs = new URLSearchParams({
          reason: json?.error || json?.message || `HTTP_${res.status}`,
          title: name.trim(),
          grade,
        }).toString();

        router.push(`/create-card/fail?${qs}`);
        return;
      }

      const photoCardId = json?.data?.photoCardId ?? json?.data?.id ?? '';
      const qs = new URLSearchParams({
        id: photoCardId ? String(photoCardId) : '',
        title: name.trim(),
        grade,
      }).toString();

      router.push(`/create-card/success?${qs}`);
    } catch {
      const qs = new URLSearchParams({
        reason: 'NETWORK_ERROR',
        title: name.trim(),
        grade,
      }).toString();

      router.push(`/create-card/fail?${qs}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-12 max-w-[520px] flex flex-col gap-20 pb-[250px]"
      >
        <div ref={refs.name}>
          <FormField label="포토카드 이름">
            <Input
              placeholder="포토카드 이름을 입력해 주세요"
              value={name}
              maxLength={20}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              className={[FIELD_CLASS, showError('name') && FIELD_ERROR].filter(Boolean).join(' ')}
            />
            {showError('name') && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
          </FormField>
        </div>

        <div ref={refs.grade}>
          <FormField label="등급">
            <CreateCardDropdown
              value={grade}
              options={GRADE_OPTIONS}
              placeholder="등급을 선택해 주세요"
              onChange={(v) => {
                setGrade(v);
                setTouched((t) => ({ ...t, grade: true }));
              }}
              onBlur={() => setTouched((t) => ({ ...t, grade: true }))}
              className={showError('grade') ? FIELD_ERROR : ''}
            />
            {showError('grade') && <p className="mt-2 text-sm text-red-500">{errors.grade}</p>}
          </FormField>
        </div>

        <div ref={refs.genre}>
          <FormField label="장르">
            <CreateCardDropdown
              value={genre}
              options={GENRE_OPTIONS}
              placeholder="장르를 선택해 주세요"
              onChange={(v) => {
                setGenre(v);
                setTouched((t) => ({ ...t, genre: true }));
              }}
              onBlur={() => setTouched((t) => ({ ...t, genre: true }))}
              className={showError('genre') ? FIELD_ERROR : ''}
            />
            {showError('genre') && <p className="mt-2 text-sm text-red-500">{errors.genre}</p>}
          </FormField>
        </div>

        <div ref={refs.price}>
          <FormField label="가격">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="가격을 입력해 주세요"
              value={price}
              onChange={(e) => setPrice(onlyDigits(e.target.value))}
              onBlur={() => setTouched((t) => ({ ...t, price: true }))}
              className={[FIELD_CLASS, showError('price') && FIELD_ERROR].filter(Boolean).join(' ')}
            />
            {showError('price') && <p className="mt-2 text-sm text-red-500">{errors.price}</p>}
          </FormField>
        </div>

        <div ref={refs.total}>
          <FormField label="총 발행량">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="총 발행량을 입력해 주세요"
              value={total}
              onChange={(e) => setTotal(onlyDigits(e.target.value))}
              onBlur={() => setTouched((t) => ({ ...t, total: true }))}
              className={[FIELD_CLASS, showError('total') && FIELD_ERROR].filter(Boolean).join(' ')}
            />
            {showError('total') && <p className="mt-2 text-sm text-red-500">{errors.total}</p>}
          </FormField>
        </div>

        <div ref={refs.file}>
          <FormField label="사진 업로드">
            <div className="flex items-center gap-3">
              <Input
                type="text"
                placeholder="사진 업로드"
                value={file?.name ?? ''}
                disabled
                className={[`${FIELD_CLASS} flex-1`, showError('file') && FIELD_ERROR]
                  .filter(Boolean)
                  .join(' ')}
              />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handlePickFile}
              />

              <ButtonPrimary
                type="button"
                size="s"
                thickness="thin"
                className={FILE_BUTTON_CLASS}
                style={{ color: '#efff04' }}
                onClick={openFilePicker}
              >
                파일 선택
              </ButtonPrimary>
            </div>

            {showError('file') && <p className="mt-2 text-sm text-red-500">{errors.file}</p>}
          </FormField>
        </div>

        <div ref={refs.desc}>
          <FormField label="포토카드 설명">
            <TextBox
              placeholder="카드 설명을 입력해 주세요"
              value={desc}
              onChange={setDesc}
              wrapperStyle={{ marginTop: 0 }}
              textareaStyle={{
                minHeight: '160px',
                fontSize: '16px',
                fontWeight: 300,
                lineHeight: '100%',
                letterSpacing: '0px',
                color: '#E5E7EB',
                borderRadius: 0,
                borderColor: showError('desc') ? '#ef4444' : '#E5E7EB',
                borderWidth: '1px',
                borderStyle: 'solid',
                backgroundColor: '#000',
                padding: '18px 20px',
                outline: 'none',
              }}
            />
            <div className="mt-2 flex items-center justify-between">
              {showError('desc') ? (
                <p className="text-sm text-red-500">{errors.desc}</p>
              ) : (
                <span className="text-sm text-gray-400">{desc.length}/500</span>
              )}
            </div>
          </FormField>
        </div>

        <div className="pt-2">
          <ButtonPrimary
            type="submit"
            size="l"
            thickness="thin"
            fullWidth
            disabled={!isValid || submitting}
            className={
              !isValid || submitting
                ? '!text-gray-300 !bg-gray-600 cursor-not-allowed'
                : '!text-black !bg-main hover:!bg-main'
            }
          >
            {submitting ? '생성 중...' : '생성하기'}
          </ButtonPrimary>
        </div>
      </form>

      <Modal open={fileErrorOpen} onClose={() => setFileErrorOpen(false)} size="sm">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">업로드 불가</h3>
          <p className="text-sm text-gray-300">JPG / PNG / WEBP 파일만 업로드할 수 있습니다.</p>
          <div className="flex justify-end">
            <ButtonPrimary
              type="button"
              size="s"
              thickness="thin"
              onClick={() => setFileErrorOpen(false)}
            >
              확인
            </ButtonPrimary>
          </div>
        </div>
      </Modal>
    </>
  );
}
