import axios from 'axios';
import RecordList from '../components/RecordList';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setUsers } from '../store/userAllStore';

const Main = () => {
  const dispatch = useDispatch();
  const apiUrl = process.env.REACT_APP_BACK_URL;

  const fetchGuData = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/center/guList`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        const sortedData = data.sort((a, b) => a.gu.localeCompare(b.gu)); // 구를 글자순으로 정렬
        const guList = [
          { gu: '전체', latlng: { lat: 37.5665, lng: 126.978 } },
          ...sortedData,
        ];
        localStorage.setItem('guList', JSON.stringify(guList));
      } else {
        console.error('Failed to fetch gu');
      }
    } catch (err) {
      console.error('Error fetching gu', err);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/userall`);
        dispatch(setUsers(response.data));
      } catch (error) {
        console.error('error', error);
      }
    };

    fetchUsers();
    fetchGuData();
  }, [dispatch]);

  return (
    <main className="viewCon">
      <div>
        <RecordList />
      </div>
    </main>
  );
};

export default Main;
