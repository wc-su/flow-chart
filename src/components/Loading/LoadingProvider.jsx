import { useState } from 'react';

import { LoadingContext } from './LoadingContext';

import './LoadingProvider.scss';

const LoadingProvider = ({ children }) => {
  const [message, setMessage] = useState('');

  return (
    <LoadingContext value={setMessage}>
      {children}
      {/* 給螢幕閱讀器：一直存在，只換文字 */}
      <div role="status" className="visually-hidden">
        {message}
      </div>
      {/* 給眼睛看：有訊息才出現 */}
      {message && (
        <div className="loading" aria-hidden="true">
          <div className="loading__container">
            <span className="loading__message">{message}</span>
            <div className="loading__spinner">
              <div className="loading__dot"></div>
              <div className="loading__dot"></div>
              <div className="loading__dot"></div>
            </div>
          </div>
        </div>
      )}
    </LoadingContext>
  );
};

export default LoadingProvider;
