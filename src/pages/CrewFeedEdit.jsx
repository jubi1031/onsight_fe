import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Editor from '../components/Editor';
import style from '../css/CrewFeedDetail.module.css';

const CrewFeedEdit = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message1, setMessage1] = useState('');

  const navigate = useNavigate();
  const { feedId } = useParams();

  const user = useSelector((state) => state.user.userInfo);
  const apiUrl = process.env.REACT_APP_BACK_URL;

  useEffect(() => {
    if (feedId) {
      const fetchFeed = async () => {
        try {
          const response = await axios.get(`${apiUrl}/feed/${feedId}`);
          const result = response.data;
          setTitle(result.title);
          setContent(result.content);
        } catch (error) {
          console.error('error', error);
        }
      };
      fetchFeed();
    }
  }, [feedId]);

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

    try {
      const response = await axios.put(`${apiUrl}/feed/${feedId}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        navigate(`/crewdetail/feeddetail/${feedId}`);
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  return (
    <div>
      <form className={`${style.writeCon} con1`} onSubmit={handleSubmit}>
        <div className={`${style.writeWrap} mw`}>
          <div className={`${style.titleCon}`}>
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
            <button type="submit">수정하기</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CrewFeedEdit;
