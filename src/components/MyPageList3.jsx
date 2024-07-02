import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import style from "../css/MyPageList1.module.css";
import FeedList from "./list/FeedList";

const MyPageList3 = () => {
  const [feeds, setFeeds] = useState([]);
  const user = useSelector((state) => state.user.userInfo);

  const fetchFeeds = async () => {
    try {
      const response = await fetch(`http://localhost:8000/user/feeds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      });

      if (response.ok) {
        const data = await response.json();
        setFeeds(data);
      } else {
        console.error("Failed to fetch feeds");
      }
    } catch (err) {
      console.error("Error fetching feeds", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFeeds();
    }
  }, [user]);

  return (
    <section className={style.sec}>
      <div>
        <h3 className={style.sub}>
          <span>내</span>
          <span>피드</span>
        </h3>
      </div>
      <FeedList items={feeds} />
    </section>
  );
};

export default MyPageList3;
