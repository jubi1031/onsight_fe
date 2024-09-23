import { useState } from 'react';
import axios from 'axios';
import style from '../css/CreateCrew.module.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateCrew = () => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [crewImg, setCrewImg] = useState('');
  const [memberLimit, setMemberLimit] = useState('10');
  const [selectedSi, setSelectedSi] = useState('');
  const [selectedGu, setSelectedGu] = useState('');
  const [gus, setGus] = useState([]);
  const apiUrl = process.env.REACT_APP_BACK_URL;

  const navigate = useNavigate();

  const [previewSrc, setPreviewSrc] = useState('/img/noimg.jpg');

  const user = useSelector((state) => state.user.userInfo);

  const handleButtonClick = () => {
    document.getElementById('crewImgInput').click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = apiUrl.createObjectURL(file);
      setPreviewSrc(fileUrl);
      setCrewImg(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewSrc('/img/noimg.jpg');
    setCrewImg('');
    document.getElementById('crewImgInput').value = null;
  };

  const handleSiChange = (event) => {
    const si = event.target.value;
    setSelectedSi(si);

    if (si === 'seoul') {
      setGus([
        '강남구',
        '강동구',
        '강서구',
        '강북구',
        '관악구',
        '광진구',
        '구로구',
        '금천구',
        '노원구',
        '동대문구',
        '도봉구',
        '동작구',
        '마포구',
        '서대문구',
        '성동구',
        '성북구',
        '서초구',
        '송파구',
        '영등포구',
        '용산구',
        '양천구',
        '은평구',
        '종로구',
        '중구',
        '중랑구',
      ]);
    } else {
      setGus([]);
    }
  };

  const handleGuChange = (event) => {
    setSelectedGu(event.target.value);
  };

  const handleSubmitCrew = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('name', name);
    formData.append('content', content);
    formData.append('crewImg', crewImg);
    formData.append('memberLimit', memberLimit);
    formData.append('si', selectedSi);
    formData.append('gu', selectedGu);

    try {
      const response = await axios.post(`${apiUrl}/crew`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        alert('크루가 생성되었습니다.');
        navigate('/crew');
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  return (
    <main className="con1">
      <div className={`${style.createpage} mw`}>
        <form onSubmit={handleSubmitCrew} className={style.createCrew}>
          <h2>나의 크루생성</h2>
          <div className={style.topBox}>
            <div>
              <div className={style.preImgCon}>
                <img src={previewSrc} alt="미리보기" />
              </div>
              <div className={style.imgBtnCon}>
                <input
                  type="file"
                  id="crewImgInput"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className={style.Btn}
                  onClick={handleButtonClick}
                >
                  사진변경
                </button>
                <button
                  type="button"
                  className={style.Btn}
                  onClick={handleRemoveImage}
                >
                  사진삭제
                </button>
              </div>
            </div>
          </div>
          <div className={style.lowerCon}>
            <section>
              크루명 <p>크루명은 변경되지 않습니다.</p>
            </section>
            <input
              className={style.formList}
              type="text"
              placeholder="크루명을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <section>소개글</section>
            <textarea
              className={style.longList}
              placeholder="소개글을 입력해주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <section>활동 지역</section>
            <div className="selectBox">
              <select value={selectedSi} onChange={handleSiChange}>
                <option value="">전체</option>
                <option value="seoul">서울특별시</option>
              </select>
              <select value={selectedGu} onChange={handleGuChange}>
                <option value="">전체</option>
                {gus.map((gu, index) => (
                  <option key={index} value={gu}>
                    {gu}
                  </option>
                ))}
              </select>
            </div>
            <section>참가자수</section>
            <div className={style.selectBox}>
              <select
                name="limit"
                id="limit"
                value={memberLimit}
                onChange={(e) => setMemberLimit(e.target.value)}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
          <div className={style.saBtn}>
            <button className={style.Btn} type="submit">
              저장
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateCrew;
