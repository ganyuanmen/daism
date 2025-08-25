import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { type AppDispatch, setTokenList, setTokenFilter } from '@/store/store';


export function useFetchToken() {
  const dispatch = useDispatch<AppDispatch>();

  const fetchToken = useCallback((userAccount: string) => {

    fetch(`/api/getData?did=${userAccount}`, {
      headers: { 'x-method': 'getToken' }
    })
      .then((res: Response) => {
        if (!res.ok) {
          console.error('Fetch error:', res.statusText);
          return null;
        }
        return res.json() as Promise<DaismToken[]>;
      })
      .then((data: DaismToken[] | null) => {
        if (!data) return;
        dispatch(setTokenList(data));
        dispatch(setTokenFilter(data));
      })
      .catch((err: any) => {
        console.error('Network error:', err);
      });
  }, [dispatch]);

  return fetchToken;
}
