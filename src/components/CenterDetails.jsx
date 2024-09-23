import React from 'react';
import style from '../css/Search.module.css';
import RecordModal from './RecordModal';
import { useNavigate } from 'react-router-dom';

const CenterDetails = ({
  currentCenter,
  showDetails,
  activeTab,
  records,
  handleCloseDetails,
  setActiveTab,
  userLikes,
  toggleLike,
}) => {
  const navigate = useNavigate();

  const handleRecordClick = (id) => {
    navigate(`/recorddetail/${id}`);
  };
  const apiUrl = process.env.REACT_APP_BACK_URL;

  if (!showDetails || !currentCenter) return null;

  return (
    <div className={style.centerDetailCon}>
      <i
        className={`fa-solid fa-xmark ${style.iconX}`}
        onClick={handleCloseDetails}
      ></i>
      <div className={style.centerDetailImg}>
        <img src={currentCenter.thumbnail.trim()} alt={currentCenter.center} />
      </div>
      <div className={style.centerDetailInfo}>
        <div>
          <h4>{currentCenter.center}</h4>
          <p>{currentCenter.gu}</p>
        </div>
        <i
          className={`fa-regular fa-star ${style.likeStar} ${
            userLikes.includes(currentCenter._id) ? 'fa-solid' : ''
          }`}
          onClick={() => toggleLike(currentCenter._id)}
        ></i>
      </div>
      <div className={style.tabContainer}>
        <button
          className={`${style.tabButtonHome} ${
            activeTab === 'home' ? style.activeTab : ''
          }`}
          onClick={() => setActiveTab('home')}
        >
          홈
        </button>
        <button
          className={`${style.tabButtonRecode} ${
            activeTab === 'records' ? style.activeTab : ''
          }`}
          onClick={() => setActiveTab('records')}
        >
          기록
        </button>
      </div>
      <div className={style.tabContent}>
        {activeTab === 'home' && (
          <div className={style.centerHome}>
            <div className={style.centerAddress}>
              <i className="fa-solid fa-location-pin"></i>
              {currentCenter.si} {currentCenter.gu} {currentCenter.address}
            </div>
            <div>
              <i className="fa-solid fa-phone"></i>
              {currentCenter.contact}
            </div>
            <div className={style.websiteContainer}>
              <i className="fa-solid fa-globe"></i>
              <a
                href={currentCenter.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {currentCenter.website}
              </a>
            </div>
            <div>
              <p>난이도</p>
              <div className={style.levelContainer}>
                {Object.entries(currentCenter.level).map(([key, value]) => (
                  <div
                    key={key}
                    className={style.levelBox}
                    style={{ backgroundColor: value }}
                  ></div>
                ))}
              </div>
            </div>
            <div>
              <p className={style.centerDesc}>소개글</p>
              <p className={style.centerDetail}>{currentCenter.detail}</p>
            </div>
          </div>
        )}
        {activeTab === 'records' && (
          <div className={style.centerRecords}>
            <div className={style.centerRecordNav}>
              <div className={style.btnBox}>
                <RecordModal
                  currentCenter={currentCenter}
                  buttonText="기록 추가"
                  buttonClass={style.customButton}
                />
              </div>
            </div>
            <div>
              {records.length > 0 ? (
                records.map((record) => (
                  <div
                    key={record._id}
                    className={style.recordItem}
                    onClick={() => handleRecordClick(record._id)}
                  >
                    <div className={style.recordHeader}>
                      <img
                        src={`${apiUrl}${record.userThumbnail}`}
                        alt="프로필"
                        className={style.profileImage}
                      />
                      <div className={style.recordUserInfo}>
                        <div className={style.recordNickname}>
                          {record.nick}
                        </div>
                        <div className={style.recordCount}>
                          기록수 {record.userRecordCount || 0}
                        </div>
                      </div>
                    </div>
                    <div className={style.recordContent}>
                      <img
                        src={`${apiUrl}${record.thumbnail}`}
                        alt="기록 이미지"
                        className={style.recordImage}
                      />
                      <div className={style.recordText}>
                        <h5>{record.title}</h5>
                        <p>{record.content}</p>
                        <div className={style.recordDate}>
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>기록이 없습니다. 기록을 추가해보세요.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CenterDetails;
