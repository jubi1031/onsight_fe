import styleHd from '../css/MyPageHd.module.css';
import styleInfo from '../css/MyPageInfo.module.css';
import { useSelector } from 'react-redux';
import {
  useNavigate,
  useParams,
  NavLink,
  Link,
  Outlet,
} from 'react-router-dom';
import { useEffect, useState } from 'react';

const MyPage = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.userInfo);
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const apiUrl = process.env.REACT_APP_BACK_URL;

  // 사용자 정보 조회 함수
  const fetchUserInfo = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/user/${id}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Failed to fetch user info');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAndSetUser = async () => {
      if (!currentUser) {
        alert('로그인 후 사용가능해요. 로그인 하시겠어요?');
        navigate('/signinpage');
        return;
      }

      if (userId) {
        const fetchedUser = await fetchUserInfo(userId);
        if (fetchedUser) {
          setUser(fetchedUser);
        } else {
          alert('사용자를 찾을 수 없습니다.');
          navigate('/signinpage');
        }
      } else {
        setUser(currentUser);
      }
    };

    fetchAndSetUser();
  }, [userId, currentUser, navigate]);

  useEffect(() => {
    if (user) {
      const imgBox = document.querySelector(`.${styleInfo.tit}`);
      if (imgBox) {
        imgBox.style.setProperty(
          '--thumbnail-url',
          `url(${apiUrl}${user.thumbnail})`
        );
      }
    }
  }, [user]);

  const isOwnProfile = currentUser && (!userId || currentUser.id === userId);

  const displayedUserId = userId || currentUser?.id;

  if (!user) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className={`con1`}>
      <main className={`mw`}>
        <section className={styleHd.hdSec}>
          <h2>{isOwnProfile ? '마이페이지' : `${user.nick}`}</h2>
          <nav className={styleHd.navSec}>
            <ul>
              <li>
                <NavLink
                  to={`/mypage/${displayedUserId}/home`}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  마이홈
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/mypage/${displayedUserId}/crews`}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  암장
                </NavLink>
              </li>
              {isOwnProfile && (
                <li>
                  <NavLink
                    to={`/mypage/${displayedUserId}/feeds`}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    피드
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  to={`/mypage/${displayedUserId}/records`}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  기록
                </NavLink>
              </li>
            </ul>
          </nav>
        </section>
        <div className={styleInfo.infoCon}>
          {isOwnProfile && (
            <div>
              <p className={styleInfo.tit}>
                <span>
                  <i>{user ? user.nick : 'null'}</i> 님,
                </span>{' '}
                반갑습니다! <Link to="/Profile">나의 정보관리</Link>
              </p>
            </div>
          )}
        </div>
        <Outlet context={{ user, isOwnProfile }} />
      </main>
    </div>
  );
};

export default MyPage;
