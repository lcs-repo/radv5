// Authentication Utility
// A higher-order component to protect routes

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(requiredRole?: 'RT' | 'Radiologist') {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/pages/login');
    } else if (requiredRole && session.user && 'role' in session.user && session.user.role !== requiredRole) {
      router.push('/');
    }
  }, [session, status, router, requiredRole]);

  return { session, status };
}