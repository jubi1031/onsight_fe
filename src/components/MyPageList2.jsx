import RecordModal from '../components/RecordModal';
import style from '../css/MyPageList1.module.css';
import List from './list/List';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const MyPageList2 = () => {
  const { user, isOwnProfile } = useOutletContext();
  const [recodes, setRecodes] = useState([]);
  const apiUrl = process.env.REACT_APP_BACK_URL;

  useEffect(() => {
    const fetchRecodes = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/recodes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user }),
        });

        if (response.ok) {
          const data = await response.json();
          setRecodes(data);
        } else {
          console.error('Failed to fetch recodes');
        }
      } catch (err) {
        console.error('Error fetching recodes', err);
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
          <span>내</span>
          <span>기록</span>
        </h3>
        <div className={style.btnBox}>
          {isOwnProfile && <RecordModal buttonText="기록 추가" />}
        </div>
      </div>
      <List items={recodes} itemType="record" />
    </section>
  );
};

export default MyPageList2;
