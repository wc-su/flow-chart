import { useState } from 'react';

import { AUTH_VIEWS } from './authViews';

import './AuthForm.scss';

const ForgotPwd = ({ setAuthView }) => {
  const [email, setEmail] = useState('');

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  async function sendResetPwdEmail() {
    console.log('sendResetPwdEmail');
  }

  return (
    <div className="authForm">
      <p>Enter your email to reset password</p>
      <input className="authForm__input" type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
      <input
        className="authForm__input authForm__input--submit"
        type="button"
        value="Reset password"
        onClick={sendResetPwdEmail}
      />
      <button type="button" className="authForm__textBtn" onClick={() => setAuthView(AUTH_VIEWS.LOGIN)}>
        Cancel
      </button>
    </div>
  );
};

export default ForgotPwd;
