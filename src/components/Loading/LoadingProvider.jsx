import { useState } from 'react';

import { LoadingContext } from './LoadingContext';

import './LoadingProvider.scss';

const LoadingProvider = ({ children }) => {
  const [message, setMessage] = useState('');

  return (
    <LoadingContext value={setMessage}>
      {children}
      {message && (
        <div className="loading">
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
