import CrewGroupfeed from './CrewGroupfeed';
import style from '../css/CrewHome.module.css';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const CrewHome = () => {
  const { crewId } = useParams();
  const crew = useSelector((state) => state.crew.crewInfo);
  const user = useSelector((state) => state.user.userInfo);

  const selectedCrew = crew.find((c) => c._id === crewId);
  const apiUrl = process.env.REACT_APP_BACK_URL;

  const [crewMember, setCrewMember] = useState(false);

  useEffect(() => {
    if (selectedCrew && user) {
      setCrewMember(selectedCrew.members.includes(user.id));
    }
  }, [selectedCrew, user, crew]);

  if (!selectedCrew) {
    return <div>삭제되었거나 존재하지 않는 크루입니다.</div>;
  }

  return (
    <div>
      <div key={selectedCrew._id} className={style.introCrew}>
        <div className={style.crewImgCon}>
          <img src={`${apiUrl}${selectedCrew.crewImg}`} alt="crew" />
        </div>
        <p>{selectedCrew.content}</p>
        <span>피드</span>
      </div>
      {crewMember ? (
        <CrewGroupfeed />
      ) : (
        <div className={style.memberNot}>크루에 가입해주세요</div>
      )}
    </div>
  );
};

export default CrewHome;
