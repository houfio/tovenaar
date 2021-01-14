import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useAuthentication } from '../states/authentication';

export function useAuthGuard(to = '/admin/login') {
  const { push, locale } = useRouter();
  const [{ token }] = useAuthentication();
  const skip = typeof document !== 'undefined' && !token;

  useEffect(() => {
    if (skip) {
      void push(to, undefined, { locale });
    }
  }, [skip, to, push]);

  return skip ?? true;
}
