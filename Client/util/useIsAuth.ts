import { showNotification } from '@mantine/notifications';
import router from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../graphql/generated/graphql';

export const useIsAuth = (next = '/') => {
  const [{ data: user, fetching }, getMe] = useMeQuery();
  useEffect(() => {
    if (!fetching && !user?.me) {
      router.replace(`/login?next=${next}`);
    }
  }, [fetching, user, router]);
};
