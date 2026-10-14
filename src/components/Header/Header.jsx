import clsx from 'clsx';
import { Link, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';

import { USER_STATUS, userActions } from '../../redux/userSlice';
import AuthModal from './AuthModal';
import { AUTH_VIEWS } from './authViews';

import './Header.scss';

import menuIcon from './images/menu.png';
import closeIcon from './images/close.png';

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { status } = useSelector((state) => state.user);

  const [authView, setAuthView] = useState(AUTH_VIEWS.NOT_DISPLAY);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    // TODO: 接 Firebase auth
    dispatch(userActions.logout());
    setAuthView(AUTH_VIEWS.NOT_DISPLAY);
    setIsMenuOpen(false);
  }

  function handleLogin() {
    setAuthView(AUTH_VIEWS.LOGIN);
  }

  function handleSignup() {
    setAuthView(AUTH_VIEWS.SIGNUP);
  }

  return (
    <header className="header">
      <div className="header__container">
        <Link
          to="/"
          className={clsx('header-logo', location.pathname === '/' && 'header-logo--animated')}
          aria-label="FlowChart"
        >
          {'FlowChart'.split('').map((char, i) => (
            <span
              key={i}
              className={clsx('header-logo__letter', i < 4 && 'header-logo__letter--dark')}
              style={{ '--i': i }}
            >
              {char}
            </span>
          ))}
        </Link>
        <button type="button" className="header__menuBtn" onClick={() => setIsMenuOpen(true)}>
          <img className="header__menuIcon" src={menuIcon} alt="Open menu"></img>
        </button>
        <div className={clsx('header-menu', isMenuOpen && 'header-menu--open')}>
          <button type="button" className="header-menu__closeBtn" onClick={() => setIsMenuOpen(false)}>
            <img className="header-menu__closeIcon" src={closeIcon} alt="Close menu"></img>
          </button>
          <ul className="header-menu__list">
            {status === USER_STATUS.LOGGED_IN ? (
              <li className="header-menu__item">
                <button type="button" className="header-menu__itemBtn" onClick={handleLogout}>
                  Log Out
                </button>
              </li>
            ) : (
              <>
                <li className="header-menu__item">
                  <button type="button" className="header-menu__itemBtn" onClick={handleLogin}>
                    Log In
                  </button>
                </li>
                <li className="header-menu__item">
                  <button type="button" className="header-menu__itemBtn" onClick={handleSignup}>
                    Sign Up
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      {authView !== AUTH_VIEWS.NOT_DISPLAY && (
        <AuthModal authView={authView} setAuthView={setAuthView} setIsMenuOpen={setIsMenuOpen} />
      )}
    </header>
  );
};

export default Header;
