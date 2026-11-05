import { useState } from 'react';

import { ToolContext } from './ToolContext';

const ToolProvider = ({ children }) => {
  const [tool, setTool] = useState(null);

  return <ToolContext value={{ tool, setTool }}>{children}</ToolContext>;
};

export default ToolProvider;
