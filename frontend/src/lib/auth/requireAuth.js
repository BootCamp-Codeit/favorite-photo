import { redirect } from 'next/navigation';

export function requireAuth(isLoggedIn) {
  if (!isLoggedIn) {
    redirect('/login');
  }
}
