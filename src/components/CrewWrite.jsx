import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import style from '../css/Write.module.css';
import Editor from './Editor';

const CrewWrite = () => {
  const location = useLocation();
  const { crewName } = location.state || {};
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message1, setMessage1] = useState('');
  const apiUrl = process.env.REACT_APP_BACK_URL;

  const navigate = useNavigate();
  const { crewId } = useParams();

  const user = useSelector((state) => state.user.userInfo);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title === '') {
      setMessage1('제목을 입력해 주세요');
      document.getElementById('title').focus();
      return;
    } else {
      setMessage1('');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('userId', user.id);
    formData.append('crewId', crewId);
    formData.append('crewName', crewName);

    try {
      const response = await axios.post(`${apiUrl}/feed`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert(response.data.message);
        navigate(-1);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        '오류가 발생했습니다. 다시 시도해 주세요.';
      alert(`Error: ${errorMessage}`);
      console.error('error', error);
    }
  };

  return (
    <div>
      <form className={style.writeCon} onSubmit={handleSubmit}>
        <div className={style.titleCon}>
          <label htmlFor="title">
            <h2>제목</h2>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <p>&nbsp;{message1}</p>
        </div>
        <div className={style.contentCon}>
          <label htmlFor="content">
            <h2>내용</h2>
          </label>
          <Editor content={content} setContent={setContent} />
        </div>

        <div className={style.buttonCon}>
          <button type="button" onClick={() => navigate(-1)}>
            취소
          </button>
          <button type="submit">작성하기</button>
        </div>
      </form>
    </div>
  );
};

export default CrewWrite;
