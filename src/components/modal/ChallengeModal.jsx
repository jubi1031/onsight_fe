import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import style from '../../css/ChallengeModal.module.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko';
// import axios from 'axios';
import { ch } from '../../api.js';

registerLocale('ko', ko);

function ChallengeModal({ onClose, isOpen, username }) {
  // const [show, setShow] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [openPlace, setOpenPlace] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [climbingCenters, setClimbingCenters] = useState([]);
  const [selectedCity, setSelectedCity] = useState('서울특별시');
  const [selectedDistrict, setSelectedDistrict] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [showingCenters, setShowingCenters] = useState([]);
  const [title, setTitle] = useState('');
  const isFirstRun = useRef(true);
  const apiUrl = process.env.REACT_APP_BACK_URL;

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (!username) {
      alert('로그인이 필요합니다.');
      onClose();
    }
  }, [onClose, username]);
  const handleClose = () => {
    // setShow(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedPlace(null);
    setTitle('');
  };

  const togglePlace = () => {
    setOpenPlace(!openPlace);
  };

  const handlePlaceClick = (center) => {
    setSelectedPlace(center.center);
    setOpenPlace(false);
  };

  const handleSubmit = async () => {
    if (!title) {
      alert('제목을 입력해주세요.');
      return;
    }

    ch.chRegister(
      title,
      username,
      selectedPlace,
      '주소 모달창미구현',
      startDate.toISOString().split('T')[0]
    )
      .then((result) => {
        console.log(result);
        alert('챌린지 생성이 완료되었습니다.');
        window.location.reload();
      })
      .catch((error) => {
        console.log(`${error}`);
        alert(`${error.response.data.message}`);
      });
    handleClose();
  };

  useEffect(() => {
    const fetchCenterData = async () => {
      try {
        const response = await fetch(`${apiUrl}/center/centerList`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setClimbingCenters(data);
          setShowingCenters(data);
        } else {
          console.error('Failed to fetch center');
        }
      } catch (err) {
        console.error('Error fetching center', err);
      }
    };

    fetchCenterData();
  }, []);

  const handleSearch = () => {
    const results = climbingCenters.filter((center) => {
      return (
        center.si === selectedCity &&
        (selectedDistrict === '전체' || center.gu.includes(selectedDistrict)) &&
        center.center.includes(searchTerm)
      );
    });
    setShowingCenters(results);
  };

  const handleRefresh = () => {
    setSelectedCity('서울특별시');
    setSelectedDistrict('전체');
    setSearchTerm('');
    setShowingCenters(climbingCenters);
  };

  return (
    <>
      <Modal className={style.modalRe} show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h2>챌린지 만들기</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={style.modalBody}>
          <form className={style.recordCon}>
            <label htmlFor="title">챌린지 이름</label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="date">날짜 선택</label>
            <div className={style.dateWrap}>
              <DatePicker
                dateFormat="yyyy.MM.dd"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                maxDate={new Date()}
                locale="ko"
              />
            </div>
            <label htmlFor="place">운동 장소</label>
            <div className={style.placeC}>
              <div className={style.placeView} onClick={togglePlace}>
                <span>{selectedPlace || '장소 선택'}</span>
                <i className="fa-solid fa-chevron-down"></i>
              </div>
              {openPlace && (
                <div className={style.placeList}>
                  <div>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                    >
                      <option value="서울특별시">서울특별시</option>
                    </select>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => {
                        setSelectedDistrict(e.target.value);
                        setShowingCenters(
                          climbingCenters.filter(
                            (center) =>
                              e.target.value === '전체' ||
                              center.gu.includes(e.target.value)
                          )
                        );
                      }}
                    >
                      <option value="전체">전체</option>
                      {Array.from(
                        new Set(climbingCenters.map((center) => center.gu))
                      ).map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={style.searchCon}>
                    <input
                      type="text"
                      className={style.searchInput}
                      placeholder="검색창"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                    />
                    <div>
                      <i
                        className={`fa-solid fa-magnifying-glass ${style.readingGlasses}`}
                        onClick={handleSearch}
                      ></i>
                      <i
                        className={`fa-solid fa-rotate-left ${style.rotate}`}
                        onClick={handleRefresh}
                      ></i>
                    </div>
                  </div>
                  <ul className={style.placeResult}>
                    {showingCenters.map((center) => (
                      <li
                        key={center._id}
                        onClick={() => handlePlaceClick(center)}
                      >
                        {center.center}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </form>
          <p>*챌린지는 일주일에 하나씩만 생성 가능</p>
        </Modal.Body>
        <Modal.Footer className={style.ModalFt}>
          <Button
            className={style.saveBtn}
            variant="primary"
            onClick={handleSubmit}
          >
            챌린지 생성
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChallengeModal;
