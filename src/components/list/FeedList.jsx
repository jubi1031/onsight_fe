import { useState, useEffect } from 'react';
import ListPagnation from './ListPagnation';
import { useNavigate } from 'react-router-dom';
import style from '../../css/FeedList.module.css';
import { useSelector } from 'react-redux';
import axios from 'axios';

const formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  let formattedDate = new Intl.DateTimeFormat('ko-KR', options).format(
    new Date(date)
  );
  formattedDate = formattedDate.replace(/\./g, '.');
  if (formattedDate.endsWith('.')) {
    formattedDate = formattedDate.slice(0, -1);
  }
  return formattedDate;
};
const apiUrl = process.env.REACT_APP_BACK_URL;

const FeedList = ({ items }) => {
  const [feeds, setFeeds] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItems, setCurrentItems] = useState([]);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(feeds.length / itemsPerPage);
  const user = useSelector((state) => state.user.userInfo);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 초기 데이터 설정
  useEffect(() => {
    if (items && items.length > 0) {
      setFeeds(items);
    }
  }, [items]);

  useEffect(() => {
    if (feeds.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setCurrentItems(feeds.slice(startIndex, endIndex));
    }
  }, [currentPage, feeds]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (feeds.length > 0) {
      setCurrentPage(1); // items가 변경될 때 첫 페이지로 리셋
    }
  }, [feeds]);

  const toggleDeleteButton = (feedId) => {
    const deleteButton = document.getElementById(`delete-btn-${feedId}`);
    if (deleteButton.style.display === 'block') {
      deleteButton.style.display = 'none';
    } else {
      deleteButton.style.display = 'block';
    }
  };

  const handleDelete = async (feedId) => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        const response = await axios.delete(`${apiUrl}/feed/${feedId}`, {
          params: { userId: user.id },
        });
        alert(response.data.message);
        window.location.reload(); // 페이지 새로고침
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          '오류가 발생했습니다. 다시 시도해 주세요.';
        alert(`Error: ${errorMessage}`);
        console.error('error', error);
      }
    }
  };

  return (
    <div>
      <div className={style.listData2}>
        <p className={style.label}>
          <span className={style.lbListNo}>번호</span>
          <span className={style.lbListCrew}>크루</span>
          <span className={style.lbListTitle}>제목</span>
          <span className={style.lbListDate}>등록일</span>
          <span className={style.lbListCnt}>조회수</span>
          <span className={style.lblistDelete}>버튼</span>
        </p>
        <ul>
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <li
                key={item._id}
                onClick={() => {
                  navigate(`/crewdetail/feeddetail/${item._id}`);
                }}
              >
                <span className={style.listNo}>
                  {index + 1 + (currentPage - 1) * itemsPerPage}
                </span>
                <span className={style.listCrew}>{item.crewName}</span>
                <span className={style.listTitle}>{item.title}</span>
                <span className={style.listDate}>
                  {formatDate(item.createdTime)}
                </span>
                <span className={style.listCnt}>{item.views}</span>
                <span className={style.listDelete}>
                  <i
                    className="fa-solid fa-ellipsis-vertical"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDeleteButton(item._id);
                    }}
                  ></i>
                  <button
                    id={`delete-btn-${item._id}`}
                    className={style.deleteButton}
                    style={{ display: 'none' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item._id);
                    }}
                  >
                    삭제하기
                  </button>
                </span>
              </li>
            ))
          ) : (
            <p className={style.p}> 작성한 피드가 없습니다.</p>
          )}
        </ul>
      </div>
      <div>
        <ListPagnation
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default FeedList;
