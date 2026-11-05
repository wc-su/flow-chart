import { createContext, useContext } from 'react';

export const ToolContext = createContext(null);

export function useTool() {
  const context = useContext(ToolContext);
  if (context === null) {
    throw new Error('useTool 必須在 ToolProvider 裡面使用');
  }
  return context;
}
