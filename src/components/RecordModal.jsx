import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import style from '../css/RecordModal.module.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

registerLocale('ko', ko);

function RecordModal({
  currentCenter,
  buttonText = '내 기록 추가하기',
  buttonClass,
}) {
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [openPlace, setOpenPlace] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [openDiffi, setOpenDiffi] = useState(false);
  const [selectedDiffis, setSelectedDiffis] = useState([]);
  const [counts, setCounts] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [climbingCenters, setClimbingCenters] = useState([]);
  const [selectedCity, setSelectedCity] = useState('서울특별시');
  const [selectedDistrict, setSelectedDistrict] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [showingCenters, setShowingCenters] = useState([]);
  const [diffiList, setDiffiList] = useState([]);
  const apiUrl = process.env.REACT_APP_BACK_URL;

  const user = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  useEffect(() => {
    if (currentCenter) {
      setSelectedPlace(currentCenter.center);
      if (currentCenter.level) {
        setDiffiList(
          Object.keys(currentCenter.level).map((key) => `난이도 (v${key})`)
        );
      }
    }
  }, [currentCenter]);

  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  const handleShow = () => {
    if (!user) {
      alert('로그인 후 사용가능해요. 로그인 하시겠어요?');
      navigate('/signinpage');
    }
    setShow(true);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setSelectedDiffis([]);
    setCounts({});
    setSelectedPlace(null);
    setTitle('');
    setContent('');
  };

  const togglePlace = () => {
    setOpenDiffi(false);
    setOpenPlace(!openPlace);
  };

  const handlePlaceClick = (center) => {
    setSelectedPlace(center.center);
    setOpenPlace(false);
    setSelectedDiffis([]);
    setCounts({});
    if (center.level) {
      setDiffiList(Object.keys(center.level).map((key) => `난이도 (v${key})`));
    }
  };

  const toggleDiffi = () => {
    if (!selectedPlace && !currentCenter) {
      alert('먼저 운동 장소를 선택해주세요.');
      return;
    }
    setOpenPlace(false);
    setOpenDiffi(!openDiffi);
  };

  const handleDiffiClick = (diffi) => {
    if (!selectedDiffis.includes(diffi)) {
      setSelectedDiffis((prev) => [...prev, diffi]);
      setCounts((prevCounts) => ({
        ...prevCounts,
        [diffi]: 0,
      }));
      setOpenDiffi(false);
    } else {
      alert('이미 선택된 난이도입니다.');
    }
  };

  const increase = (diffi) =>
    setCounts({ ...counts, [diffi]: counts[diffi] + 1 });
  const decrease = (diffi) =>
    setCounts({ ...counts, [diffi]: Math.max(counts[diffi] - 1, 0) });

  const handleRemoveDiffi = (diffiToRemove) => {
    setSelectedDiffis((prev) =>
      prev.filter((diffi) => diffi !== diffiToRemove)
    );
    setCounts((prevCounts) => {
      const newCounts = { ...prevCounts };
      delete newCounts[diffiToRemove];
      return newCounts;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(file.name.toLowerCase());
    const mimetype = fileTypes.test(file.type);

    if (mimetype && extname) {
      setSelectedFile(file);
    } else {
      alert('이미지 파일만 업로드할 수 있습니다.');
      e.target.value = null;
      setSelectedFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!title) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content) {
      alert('상세내용을 입력해주세요.');
      return;
    }
    if (!selectedFile) {
      alert('파일을 업로드해주세요.');
      return;
    }

    const level = selectedDiffis.reduce((acc, diffi) => {
      const diffiNum = diffi.match(/\(v(\d+)\)/)[1];
      acc[diffiNum] = counts[diffi];
      return acc;
    }, {});

    const levelSum = selectedDiffis.reduce((sum, diffi) => {
      const diffiNum = diffi.match(/\(v(\d+)\)/)[1];
      return sum + diffiNum * counts[diffi];
    }, 0);

    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('nick', user.nick);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('center', selectedPlace);
    formData.append('date', startDate.toISOString().split('T')[0]);
    formData.append('level', JSON.stringify(level));
    formData.append('levelsum', levelSum);
    if (selectedFile) {
      formData.append('thumbnail', selectedFile);
    }

    try {
      const response = await axios.post(`${apiUrl}/record`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data && response.data.message) {
        alert(response.data.message);
      }
      handleClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        '오류가 발생했습니다. 다시 시도해 주세요.';
      alert(`Error: ${errorMessage}`);
      console.error('error', err);
    }
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

  const handleClick = (e, action, diffi) => {
    e.stopPropagation();
    action(diffi);
  };

  const sortedDiffis = selectedDiffis.sort((a, b) => {
    const numA = parseInt(a.match(/\(v(\d+)\)/)[1], 10);
    const numB = parseInt(b.match(/\(v(\d+)\)/)[1], 10);
    return numA - numB;
  });

  const CounterButton = ({ action, diffi, label }) => (
    <button
      className={style.inDeBtn}
      type="button"
      onClick={(e) => handleClick(e, action, diffi)}
    >
      {label}
    </button>
  );

  return (
    <>
      <button onClick={handleShow} className={`${style.addBtn} ${buttonClass}`}>
        <span>{buttonText}</span>
      </button>
      <Modal className={style.modalRe} show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h2>기록 추가</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={style.modalBody}>
          <form className={style.recordCon}>
            <label htmlFor="title">제목</label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="content">상세내용</label>
            <input
              type="text"
              name="content"
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
            {currentCenter ? (
              <>
                <label htmlFor="place">운동 장소</label>
                <div className={style.placeC}>
                  <div className={style.placeView}>
                    <span>{currentCenter.center}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
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
                            key={center._id} // Use unique key from center object
                            onClick={() => handlePlaceClick(center)}
                          >
                            {center.center}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
            <label htmlFor="difficulty">운동 난이도</label>
            <div className={style.diffiC}>
              <div className={style.diffiView} onClick={toggleDiffi}>
                <span>난이도 선택</span>
                <i className="fa-solid fa-chevron-down"></i>
              </div>
              {openDiffi && (
                <ul className={style.diffiList}>
                  {diffiList.map((diffi) => (
                    <li key={diffi} onClick={() => handleDiffiClick(diffi)}>
                      {diffi}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={style.diffiCon}>
              {sortedDiffis.map((diffi) => (
                <div className={style.diffiCountList} key={diffi}>
                  <span>{diffi}</span>
                  <div>
                    <CounterButton action={decrease} diffi={diffi} label="-" />
                    {counts[diffi]}
                    <CounterButton action={increase} diffi={diffi} label="+" />
                    <i
                      className="fa-solid fa-xmark"
                      onClick={() => handleRemoveDiffi(diffi)}
                    ></i>
                  </div>
                </div>
              ))}
            </div>
            <input
              type="file"
              name="thumbnail"
              id="thumbnail"
              onChange={handleFileChange}
            />
            <div className={style.preview}>
              {selectedFile ? (
                <img src={apiUrl.createObjectURL(selectedFile)} alt="preview" />
              ) : (
                ''
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className={style.ModalFt}>
          <Button
            className={style.saveBtn}
            variant="primary"
            onClick={handleSubmit}
          >
            기록하기
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RecordModal;
