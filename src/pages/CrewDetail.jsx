import style from '../css/CrewDetail.module.css';
import {
  NavLink,
  Routes,
  Route,
  useParams,
  useNavigate,
  Link,
} from 'react-router-dom';
import CrewHome from '../components/CrewHome';
import CrewWrite from '../components/CrewWrite';
import CrewManage from '../components/CrewManage';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setUserAllInfo } from '../store/userStore';
import { setCrewAllInfo } from '../store/crewStore';
import { setUsers } from '../store/userAllStore';

const CrewDetail = () => {
  const { crewId } = useParams();
  const crew = useSelector((state) => state.crew.crewInfo);
  const users = useSelector((state) => state.userAll.userAllInfo);
  const user = useSelector((state) => state.user.userInfo);
  const selectedCrew = crew.find((c) => c._id === crewId);
  const apiUrl = process.env.REACT_APP_BACK_URL;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [crewMember, setCrewMember] = useState(false);
  const [crewAdmin, setCrewAdmin] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);

  useEffect(() => {
    if (selectedCrew) {
      setCrewMember(selectedCrew.members.includes(user.id));
      setCrewAdmin(selectedCrew.userId === user.id);
      setFilteredMembers(selectedCrew.members);
    }
  }, [selectedCrew, user]);

  const handleSearch = () => {
    const filtered = selectedCrew.members.filter((memberId) => {
      const memberInfo = users.find((user) => user.id === memberId);
      return memberInfo.nick.includes(searchTerm);
    });
    setFilteredMembers(filtered);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleJoinCrew = async () => {
    try {
      const response = await fetch(`${apiUrl}/crew/crewjoin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user, crewId: selectedCrew }),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(setUserAllInfo(data.updateUser));
        dispatch(setUsers(data.users));
        dispatch(setCrewAllInfo(data.crews));
      } else {
        console.error('Failed to join crew');
      }
    } catch (err) {
      console.error('Error joining crew', err);
    }
  };

  const handleLeaveCrew = async () => {
    if (window.confirm('정말로 크루를 탈퇴하시겠습니까?')) {
      try {
        const response = await fetch(`${apiUrl}/crew/crewleave`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user, crewId: selectedCrew }),
        });
        const data = await response.json();
        if (response.ok) {
          dispatch(setUserAllInfo(data.updateUser));
          dispatch(setUsers(data.users));
          dispatch(setCrewAllInfo(data.crews));
        } else {
          console.error('Failed to leave crew');
        }
      } catch (err) {
        console.error('Error leaving crew', err);
      }
    }
  };

  const moveToCrew = () => {
    navigate('/crew');
  };

  const handleMemberClick = (memberId) => {
    navigate(`/mypage/${memberId}`);
  };

  if (!selectedCrew) {
    return <p>메인페이지 갔다오세요</p>;
  }
  // 이거 없으니까 새로고침할 때마다 리덕스 초기화되고 빨간화면 떠서 추가함
  // 나중에 redux persist 쓰거나 local storage 쓰게되면 삭제할 예정

  const toggleSidebar = () => {
    setToggle(!toggle);
  };

  return (
    <div className={`${style.mainCrew} ${toggle ? style.mainCrewToggled : ''}`}>
      <div className={style.leftCon}>
        <h3>크루원 찾기</h3>
        <i
          className={`fa-solid ${toggle ? 'fa-angle-right' : 'fa-angle-left'} ${
            toggle ? style.iconLeft : style.iconRight
          }`}
          onClick={toggleSidebar}
        ></i>
        <div className={style.leftConinner}>
          <div className={style.searchCon}>
            <input
              type="text"
              placeholder=" 크루원 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className={style.iconButton} onClick={handleSearch}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <ul className={`${style.memberCon} ${!crewMember ? style.blur : ''}`}>
            {selectedCrew &&
              filteredMembers.map((memberId) => {
                const memberInfo = users.find((user) => user.id === memberId);
                return (
                  <li
                    key={memberId}
                    onClick={() => handleMemberClick(memberInfo.id)}
                  >
                    <div className={style.nickWrap}>
                      <div className={style.profileBox}>
                        <img
                          src={`${apiUrl}${memberInfo.thumbnail}`}
                          alt="프로필 사진"
                        />
                      </div>
                      <span>{memberInfo.nick}</span>
                    </div>
                    {memberInfo.id === selectedCrew.userId && (
                      <strong>크루장</strong>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
      <section className={style.rightCon}>
        <i className="fa-solid fa-xmark" onClick={moveToCrew}></i>
        <div className={style.righttxt}>
          <div className={style.crewName}>
            <h2>{selectedCrew?.name}</h2>
          </div>
          <div className={style.menu}>
            <nav className={style.page_nav}>
              <ul>
                <li>
                  <NavLink
                    to={`/crewdetail/${crewId}/crewhome`}
                    aria-current={({ isActive }) =>
                      isActive ? 'page' : undefined
                    }
                  >
                    크루홈
                  </NavLink>
                </li>
                <li>
                  {crewMember ? (
                    <NavLink
                      to={`/crewdetail/${crewId}/crewwrite`}
                      state={{ crewName: selectedCrew.name }}
                      aria-current={({ isActive }) =>
                        isActive ? 'page' : undefined
                      }
                    >
                      글쓰기
                    </NavLink>
                  ) : (
                    <Link to="#" onClick={handleJoinCrew}>
                      가입하기
                    </Link>
                  )}
                </li>
                {crewAdmin && (
                  <li>
                    <NavLink
                      to={`/crewdetail/${crewId}/crewmanage`}
                      aria-current={({ isActive }) =>
                        isActive ? 'page' : undefined
                      }
                    >
                      관리하기
                    </NavLink>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
        <div>
          <Routes>
            <Route path="crewhome" element={<CrewHome />} />
            <Route path="crewwrite" element={<CrewWrite />} />
            <Route path="crewmanage" element={<CrewManage />} />
            <Route path="*" element={<CrewHome />} />
          </Routes>
        </div>
        {crewMember && !crewAdmin && (
          <span onClick={handleLeaveCrew}>크루 탈퇴하기</span>
        )}
      </section>
    </div>
  );
};

export default CrewDetail;
