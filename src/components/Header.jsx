import { useEffect, useState } from 'react';
import style from '../css/Header.module.css';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserAllInfo, setUserAllInfo } from '../store/userStore';
import { persistor } from '../store/store';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const user = useSelector((state) => state.user.userInfo);
  const [hoverImg, setHoverImg] = useState({
    link1: false,
    link2: false,
    link3: false,
    link4: false,
    link5: false,
  });

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACK_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('onSightToken');
        if (token) {
          if (isTokenExpired(token)) {
            // 토큰 유효기간 확인
            localStorage.removeItem('onSightToken');
            dispatch(clearUserAllInfo());
            alert('로그인이 만료되었습니다. 다시 로그인 해주세요.');
            navigate('/signinpage');
            return;
          }
          const response = await fetch(`${apiUrl}/user/profile`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const userInfo = await response.json();
            dispatch(setUserAllInfo(userInfo));
          } else {
            dispatch(clearUserAllInfo());
          }
        }
      } catch (error) {
        console.error('error', error);
        dispatch(clearUserAllInfo());
      }
    };

    const token = localStorage.getItem('onSightToken');
    if (!user && token) {
      fetchProfile();
    }
  }, [dispatch, location.pathname, user]);

  // 토큰의 유효기간을 확인하는 함수
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  const username = user ? user.id : null;
  const nickname = user ? user.nick : null;

  const signout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/user/logout`, {
        method: 'POST',
      });
      if (response.ok) {
        dispatch(clearUserAllInfo());
        localStorage.removeItem('onSightToken');
        localStorage.removeItem('onSightKakaoToken');
        persistor.purge();
        alert('로그아웃 되었어요');
        navigate('/');
      } else {
        console.error('fail', response.statusText);
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const MouseHover = (link) => {
    setHoverImg((prevState) => ({ ...prevState, [link]: true }));
  };

  const MouseLeave = (link) => {
    setHoverImg((prevState) => ({ ...prevState, [link]: false }));
  };

  return (
    <header className={style.gnb}>
      <div>
        <h1>
          <div>
            <NavLink to="/">
              <img src="../../img/logo.png" alt="" />
            </NavLink>
          </div>
        </h1>
        <nav>
          <div className={`${style.holdBar} ${menuOpen ? style.showMenu : ''}`}>
            <NavLink
              to="/SearchPage"
              onClick={() => setMenuOpen(false)}
              onMouseEnter={() => MouseHover('link1')}
              onMouseLeave={() => MouseLeave('link1')}
              className={({ isActive }) => (isActive ? style.active : '')}
            >
              {({ isActive }) => (
                <>
                  <img
                    src={
                      hoverImg.link1 || isActive
                        ? '/img/eholdr.png'
                        : '/img/holdr.png'
                    }
                    alt=""
                  />
                  <span
                    style={{
                      color: hoverImg.link1 || isActive ? '#FF454A' : '#FFFFFF',
                    }}
                  >
                    암장찾기
                  </span>
                </>
              )}
            </NavLink>
            <NavLink
              to="/crew"
              onClick={() => setMenuOpen(false)}
              onMouseEnter={() => MouseHover('link2')}
              onMouseLeave={() => MouseLeave('link2')}
              className={({ isActive }) => (isActive ? style.active : '')}
            >
              {({ isActive }) => (
                <>
                  <img
                    src={
                      hoverImg.link2 || isActive
                        ? '/img/eholdb.png'
                        : '/img/holdb.png'
                    }
                    alt=""
                  />
                  <span
                    style={{
                      color: hoverImg.link2 || isActive ? '#0295CF' : '#FFFFFF',
                    }}
                  >
                    크루
                  </span>
                </>
              )}
            </NavLink>
            <NavLink
              to="/challenge"
              onClick={() => setMenuOpen(false)}
              onMouseEnter={() => MouseHover('link3')}
              onMouseLeave={() => MouseLeave('link3')}
              className={({ isActive }) => (isActive ? style.active : '')}
            >
              {({ isActive }) => (
                <>
                  <img
                    src={
                      hoverImg.link3 || isActive
                        ? '/img/eholdy.png'
                        : '/img/holdy.png'
                    }
                    alt=""
                  />
                  <span
                    style={{
                      color: hoverImg.link3 || isActive ? '#FFD02C' : '#FFFFFF',
                    }}
                  >
                    챌린지
                  </span>
                </>
              )}
            </NavLink>
            <NavLink
              to="/rank"
              onClick={() => setMenuOpen(false)}
              onMouseEnter={() => MouseHover('link4')}
              onMouseLeave={() => MouseLeave('link4')}
              className={({ isActive }) => (isActive ? style.active : '')}
            >
              {({ isActive }) => (
                <>
                  <img
                    src={
                      hoverImg.link4 || isActive
                        ? '/img/eholdg.png'
                        : '/img/holdg.png'
                    }
                    alt=""
                  />
                  <span
                    style={{
                      color: hoverImg.link4 || isActive ? '#A2D262' : '#FFFFFF',
                    }}
                  >
                    랭킹
                  </span>
                </>
              )}
            </NavLink>
            <NavLink
              to={`/mypage/${user?.id}`}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={() => MouseHover('link5')}
              onMouseLeave={() => MouseLeave('link5')}
              className={({ isActive }) => (isActive ? style.active : '')}
            >
              {({ isActive }) => (
                <>
                  <img
                    src={
                      hoverImg.link5 || isActive
                        ? '/img/eholdp.png'
                        : '/img/holdp.png'
                    }
                    alt=""
                  />
                  <span
                    style={{
                      color: hoverImg.link5 || isActive ? '#BE65FF' : '#FFFFFF',
                    }}
                  >
                    MY
                  </span>
                </>
              )}
            </NavLink>
          </div>
        </nav>
      </div>
      <div className={style.viewMore}>
        {username ? (
          <div className={style.signOutWrap}>
            <span>{nickname}님</span>
            <div className={style.nickBox}>
              <i className="fa-solid fa-sign-out-alt"></i>
              <span onClick={signout}>로그아웃</span>
              <i className="fa-solid fa-bars" onClick={toggleMenu}></i>
            </div>
          </div>
        ) : (
          <div className={style.signInWrap}>
            <div className={style.signInBox}>
              <i className="fa-solid fa-gear"></i>
              <span onClick={() => navigate('/signinpage')}>로그인</span>
              <i className="fa-solid fa-bars" onClick={toggleMenu}></i>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
