'use client';

import { useCallback, useState } from 'react';

const KEY = 'DEV_IS_LOGGED_IN';

function getInitial() {
  if (typeof window === 'undefined') return true;
  const saved = window.localStorage.getItem(KEY);
  return saved == null ? true : saved === 'true';
}

export default function useDevAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(getInitial);

  const setLoggedIn = useCallback((value) => {
    setIsLoggedIn(value);
    window.localStorage.setItem(KEY, String(value));
  }, []);

  const toggle = useCallback(() => setLoggedIn(!isLoggedIn), [isLoggedIn, setLoggedIn]);

  return { isLoggedIn, setLoggedIn, toggle };
}
