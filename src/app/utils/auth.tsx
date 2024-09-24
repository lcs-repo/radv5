// Authentication Utility
// A higher-order component to protect routes

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(allowedRoles?: ('RT' | 'Radiologist')[]) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
    } else if (
      allowedRoles &&
      session.user &&
      'role' in session.user &&
      !allowedRoles.includes(session.user.role as 'RT' | 'Radiologist')
    ) {
      router.push('/');
    }
  }, [session, status, router, allowedRoles]);

  return { session, status };
}