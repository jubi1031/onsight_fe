import style from '../css/MyPageList1.module.css';
import List from './list/List';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const MyPageList4 = () => {
  const { user } = useOutletContext();
  const [crews, setCrews] = useState([]);
  const apiUrl = process.env.REACT_APP_BACK_URL;

  useEffect(() => {
    const fetchRecodes = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/centerlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user }),
        });

        if (response.ok) {
          const data = await response.json();
          setCrews(data);
        } else {
          console.error('Failed to fetch crews');
        }
      } catch (err) {
        console.error('Error fetching crews', err);
      }
    };

    if (user) {
      fetchRecodes();
    }
  }, [user]);

  return (
    <section className={style.sec}>
      <div>
        <h3 className={style.sub}>
          <span>즐겨찾기한</span>
          <span>암장 목록</span>
        </h3>
      </div>
      <List items={crews} itemType="center" />
    </section>
  );
};

export default MyPageList4;
