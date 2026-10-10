import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { AUTH_VIEWS } from './authViews';
import { userActions } from '../../redux/userSlice';

import './AuthForm.scss';

const Signup = ({ setAuthView, setIsMenuOpen }) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function signUpByGoogle() {
    console.log('signUpByGoogle');
  }

  async function signUpByEmail() {
    console.log('signUpByEmail');
    // TODO: 接 Firebase auth
    dispatch(userActions.login());
    setAuthView(AUTH_VIEWS.NOT_DISPLAY);
    setIsMenuOpen(false);
  }

  return (
    <div className="authForm">
      <input
        className="authForm__input authForm__input--google"
        type="button"
        value="Continue with Google"
        onClick={signUpByGoogle}
      />
      <p className="authForm__info">or</p>
      <input className="authForm__input" type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
      <input
        className="authForm__input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <input
        className="authForm__input authForm__input--submit"
        type="button"
        value="Create account"
        onClick={signUpByEmail}
      />
      <p className="authForm__info">
        Already have an account?{' '}
        <button type="button" className="authForm__textBtn" onClick={() => setAuthView(AUTH_VIEWS.LOGIN)}>
          Log in
        </button>
      </p>
    </div>
  );
};

export default Signup;
