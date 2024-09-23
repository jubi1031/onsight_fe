import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import style from '../css/CrewGroupfeed.module.css';

const CrewGroupfeed = () => {
  const { crewId } = useParams();
  const navigate = useNavigate();
  const [feeds, setFeeds] = useState([]);

  const crew = useSelector((state) => state.crew.crewInfo);
  const user = useSelector((state) => state.user.userInfo);

  const selectedCrew = crew.find((c) => c._id === crewId);
  const apiUrl = process.env.REACT_APP_BACK_URL;

  const crewAdmin = selectedCrew && selectedCrew.userId === user.id;

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await axios.get(`${apiUrl}/feed/crew/${crewId}`);
        setFeeds(response.data);
      } catch (error) {
        console.error('error', error);
      }
    };

    fetchFeeds();
  }, [crewId]);

  const handleDelete = async (feedId) => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        const response = await axios.delete(`${apiUrl}/feed/${feedId}`, {
          params: { userId: user.id },
        });
        alert(response.data.message);
        setFeeds(feeds.filter((feed) => feed._id !== feedId));
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          '오류가 발생했습니다. 다시 시도해 주세요.';
        alert(`Error: ${errorMessage}`);
        console.error('error', error);
      }
    }
  };

  const toggleDeleteButton = (feedId) => {
    const deleteButton = document.getElementById(`delete-btn-${feedId}`);
    if (deleteButton.style.display === 'block') {
      deleteButton.style.display = 'none';
    } else {
      deleteButton.style.display = 'block';
    }
  };

  return (
    <div className={style.listData2}>
      <p className={style.label}>
        <span className={style.lbListNo}>번호</span>
        <span className={style.lbListTitle}>제목</span>
        <span className={style.lbListDate}>등록일</span>
        <span className={style.lbListCnt}>조회수</span>
        {crewAdmin && (
          <>
            <i
              className="fa-solid fa-ellipsis-vertical"
              style={{ opacity: '0' }}
            ></i>
          </>
        )}
      </p>
      <ul>
        {feeds.map((feed, index) => (
          <li
            key={feed._id}
            onClick={() => {
              navigate(`/crewdetail/feeddetail/${feed._id}`);
            }}
          >
            <div id="listNo"></div>
            <span className={style.listNo}>{index + 1}</span>
            <div id="listTitle"></div>
            <span className={style.listTitle}>{feed.title}</span>
            <div id="listDate"></div>
            <span className={style.listDate}>
              {new Date(feed.createdTime).toLocaleDateString()}
            </span>
            <span className={style.listCnt}>{feed.views}</span>

            {crewAdmin && (
              <>
                <i
                  className="fa-solid fa-ellipsis-vertical"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDeleteButton(feed._id);
                  }}
                ></i>
                <button
                  id={`delete-btn-${feed._id}`}
                  className={style.deleteButton}
                  style={{ display: 'none' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(feed._id);
                  }}
                >
                  삭제하기
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrewGroupfeed;
