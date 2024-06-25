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
  console.log(selectedCrew);

  const crewAdmin = selectedCrew && selectedCrew.userId === user.id;

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/feed/crew/${crewId}`
        );
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
        await axios.delete(`http://localhost:8000/feed/${feedId}`);
        setFeeds(feeds.filter((feed) => feed._id !== feedId));
      } catch (error) {
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
            {' '}
            <i
              class="fa-solid fa-ellipsis-vertical"
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
            <div id="listCnt"></div>
            <span className={style.listCnt}>150</span>
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
