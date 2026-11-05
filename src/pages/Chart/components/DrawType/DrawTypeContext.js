import { createContext, useContext } from 'react';

export const DrawTypeContext = createContext(null);

export function useDrawType() {
  const context = useContext(DrawTypeContext);
  if (context === null) {
    throw new Error('useDrawType 必須在 DrawTypeProvider 裡面使用');
  }
  return context;
}
