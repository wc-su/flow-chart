import { createContext, useContext } from 'react';

export const LoadingContext = createContext(null);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === null) {
    throw new Error('useLoading 必須在 LoadingProvider 裡面使用');
  }
  return context;
}
