import { useRef, useState } from 'react';

import './AuthModal.scss';
import Signup from './Signup';
import Login from './Login';
import ForgotPwd from './ForgotPwd';
import { AUTH_VIEWS } from './authViews';

const AuthModal = ({ authView, setAuthView, setIsMenuOpen }) => {
  const clickAction = useRef(false);

  const [errMsg, setErrMsg] = useState('');

  function handleMouseDown() {
    clickAction.current = true;
  }

  function handleMouseUp() {
    if (clickAction.current) {
      clickAction.current = false;
      setAuthView(AUTH_VIEWS.NOT_DISPLAY);
    }
  }

  return (
    <div className="authModal" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      <div className="authModal__container" onMouseDown={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="authModal__closeBtn"
          aria-label="Close"
          onClick={() => setAuthView(AUTH_VIEWS.NOT_DISPLAY)}
        ></button>
        {errMsg && <p className="authModal__errMsg">{errMsg}</p>}
        {authView === AUTH_VIEWS.LOGIN && (
          <Login setAuthView={setAuthView} setErrMsg={setErrMsg} setIsMenuOpen={setIsMenuOpen} />
        )}
        {authView === AUTH_VIEWS.SIGNUP && (
          <Signup setAuthView={setAuthView} setErrMsg={setErrMsg} setIsMenuOpen={setIsMenuOpen} />
        )}
        {authView === AUTH_VIEWS.FORGOT_PWD && <ForgotPwd setAuthView={setAuthView} setErrMsg={setErrMsg} />}
      </div>
    </div>
  );
};

export default AuthModal;
