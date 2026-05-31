'use client';

import { createContext, useContext } from 'react';

const MyGalleryCountContext = createContext(null);

export function MyGalleryCountProvider({ value, children }) {
  return <MyGalleryCountContext.Provider value={value}>{children}</MyGalleryCountContext.Provider>;
}

export function useMyGalleryCount() {
  const ctx = useContext(MyGalleryCountContext);
  if (!ctx) throw new Error('useMyGalleryCount must be used within MyGalleryCountProvider');
  return ctx;
}
