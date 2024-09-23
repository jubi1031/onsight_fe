import React from 'react';
import { useSelector } from 'react-redux';
import style from '../css/RankList.module.css';
import { useNavigate } from 'react-router-dom';

const RankList = ({ hoveredCard }) => {
  const records = useSelector((state) => state.record.recordInfo);
  const users = useSelector((state) => state.userAll.userAllInfo);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACK_URL;

  const userLevelSumMap = {};

  records.forEach((record) => {
    const { userId, levelsum } = record;
    if (userLevelSumMap[userId]) {
      userLevelSumMap[userId] += levelsum;
    } else {
      userLevelSumMap[userId] = levelsum;
    }
  });

  const userList = Object.keys(userLevelSumMap).map((userId) => {
    const user = users.find((user) => user.id === userId) || {};
    return {
      ...user,
      levelsum: userLevelSumMap[userId],
    };
  });

  const sortedUsers = userList.sort((a, b) => b.levelsum - a.levelsum);
  const top3Users = sortedUsers.slice(0, 3);
  const top8Users = sortedUsers.slice(3, 8);

  const rankCrown = (rank) => {
    if (rank === 0) return '/img/crown1.png';
    if (rank === 1) return '/img/crown2.png';
    if (rank === 2) return '/img/crown3.png';
    return null;
  };

  const handleProfileClick = (userId) => {
    navigate(`/mypage/${userId}`);
  };

  return (
    <div>
      <ul className={style.rankListCon}>
        <div className={style.btnBox}>
          <button>전체</button>
        </div>
        {top3Users.map((user, index) => (
          <li
            key={user.id}
            className={`${style.rankListCard} ${
              hoveredCard === index + 1 ? style.hover : ''
            }`}
            onClick={() => handleProfileClick(user.id)}
          >
            <strong>{index + 1}</strong>
            <span>
              <img
                src={`${apiUrl}${user.thumbnail}` || '/img/test.jpg'}
                alt=""
              />
              <strong>{user.nick || '클라이머'}</strong>
              <img
                src={rankCrown(index)}
                alt={`crown${index + 1}`}
                className={style.crown}
              />
            </span>
            <span>{user.levelsum.toLocaleString()}</span>
          </li>
        ))}
      </ul>
      <ul className={style.rankListCon2}>
        {top8Users.map((user, index) => (
          <li
            key={user.id}
            className={`${style.rankListCard2} ${
              hoveredCard === index + 4 ? style.hover : ''
            }`}
            onClick={() => handleProfileClick(user.id)}
          >
            <div className={style.rankListCard2Prof}>
              <strong>{index + 4}</strong>
              <span>
                <img
                  src={`${apiUrl}${user.thumbnail}` || '/img/test.jpg'}
                  alt=""
                />
                <strong>{user.nick || '클라이머'}</strong>
              </span>
            </div>
            <span>{user.levelsum.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RankList;
