import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useSelector } from 'react-redux'; // 리덕스 훅 추가
import style from '../css/FeedDetail.module.css';

const CrewFeedDetail = () => {
  const navigate = useNavigate();
  const { feedId } = useParams();
  const [feed, setFeed] = useState(null);
  const [crewId, setCrewId] = useState(null);
  // 이 부분이 문제인가싶어서 크루id를 먼저 저장해봤는데
  // error 밑에도 navgiate 넣으면 해결되는거였어서 지워도 되는지
  // 실험은 나중에 해볼 예정

  const user = useSelector((state) => state.user.userInfo);
  const apiUrl = process.env.REACT_APP_BACK_URL;

  useEffect(() => {
    const fetchFeedDetail = async () => {
      try {
        const response = await axios.get(`${apiUrl}/feed/detail/${feedId}`);
        setFeed(response.data);
        setCrewId(response.data.crewId);

        await axios.post(`${apiUrl}/feed/viewIncrement/${feedId}`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('error', error);
      }
    };

    fetchFeedDetail();
  }, [feedId]);

  const goBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/crewdetail/feeddetail/edit/${feedId}`);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        const response = await axios.delete(`${apiUrl}/feed/${feedId}`, {
          params: { userId: user.id },
        });
        alert(response.data.message);
        navigate(`/crewdetail/${crewId}`);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          '오류가 발생했습니다. 다시 시도해 주세요.';
        alert(`Error: ${errorMessage}`);
        console.error('error', error);
        navigate(`/crewdetail/${crewId}`);
        // 크루 페이지 삭제되면서 41번째 줄에서 오류나고 navgiate가 작동을 안하는데
        // gpt한테 물어보니까 에러 밑에도 navgiate 달라고하고 이것도 일반적인 방법이라고 하길래 이렇게 썼어요
      }
    }
  };

  if (!feed) {
    return <p>메인페이지</p>;
  }

  return (
    <div>
      <div className="con2">
        <div className={`${style.allCon} mw`}>
          <div className={style.topCon}>
            <button className={style.backBtn} onClick={goBack}>
              <i className="fa-solid fa-arrow-left-long"></i>
            </button>
            <div className={style.profileBox}>
              {/* <div className={style.imgBox}>
                <img src="/img/test.jpg" alt="" />
              </div> */}
              <span>{feed.nick}</span>
            </div>
          </div>
          <div className={style.outPutArea}>
            <h2>{feed.title}</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(feed.content),
              }}
            ></div>
            {user && user.id === feed.userId && (
              <div className={style.middelBtnBox}>
                <button onClick={handleEdit}>수정</button>
                <button onClick={handleDelete}>삭제</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrewFeedDetail;
