import { useState } from 'react';

import { DrawTypeContext } from './DrawTypeContext';

const DrawTypeProvider = ({ children }) => {
  const [drawType, setDrawType] = useState('');

  return <DrawTypeContext value={{ drawType, setDrawType }}>{children}</DrawTypeContext>;
};

export default DrawTypeProvider;
