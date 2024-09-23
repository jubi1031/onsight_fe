import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import style from '../css/RecordDetail.module.css';
import GaugeBar from '../components/GaugeBar';
const apiUrl = process.env.REACT_APP_BACK_URL;

const RecordDetail = () => {
  const { id } = useParams();
  const records = useSelector((state) => state.record.recordInfo);
  const record = records.find((record) => record._id === id);
  const navigate = useNavigate();

  const userRecords = records
    .filter((rec) => rec.userId === record.userId && rec._id !== record._id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const centerRecords = records.filter((rec) => rec.center === record.center);

  const levelSums = centerRecords
    .map((rec) => rec.levelsum)
    .sort((a, b) => a - b);

  const recordIndex = levelSums.indexOf(record.levelsum);
  let percentileRank = Math.floor(
    ((levelSums.length - recordIndex - 1) / levelSums.length) * 100
  );

  percentileRank = Math.max(percentileRank, 1);

  const transformDate = (records) => {
    return records
      .map((record) => ({
        ...record,
        date: new Date(record.date).toLocaleDateString(),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const transformedUserRecords = transformDate(userRecords);

  return (
    <div className={`${style.allCon} con1`}>
      <div className={`${style.allBox} mw`}>
        <button onClick={() => navigate(-1)} className={style.back_button}>
          <i className="fa-solid fa-angle-left"></i>
        </button>
        <h2>
          <strong>{record.title}</strong>
          <span>{new Date(record.date).toLocaleDateString()}</span>
        </h2>

        <div className={style.recordWrap}>
          <div className={style.rightBox}>
            <div className={style.gaugeBox}>
              <GaugeBar percentileRank={percentileRank} />
              <span>{record.levelsum}</span>
            </div>
            <div className={style.gaugeTextBox}>
              <span>'{record.nick}'</span> 님의 이 기록은
              <br />
              <span> '{record.center}'</span> 에서 <br />
              상위 <span>'{percentileRank}%'</span> 에 위치하고 있어요
            </div>
          </div>
          <div className={style.leftBox}>
            <div className={style.imgBox}>
              <img src={`${apiUrl}${record.thumbnail}`} alt="thumbnail" />
            </div>
            <div className={style.crewDetailTextBox}>
              <p>{record.content}</p>
            </div>
          </div>
          <div className={style.lowerBox}>
            <div className={style.relatedRecords}>
              <div className={style.chartBox}>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={transformedUserRecords}
                    margin={{ top: 100, right: 130, bottom: 20, left: 100 }}
                  >
                    <XAxis dataKey="date" hide />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#A2D262',
                        color: '#fff',
                      }}
                      itemStyle={{ color: '#fff' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="levelsum"
                      stroke="#ffffff"
                      strokeWidth={8}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p>
                <span>'{record.nick}'</span> 님의
                <br />
                최근 기록 추이
              </p>
              <div></div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default RecordDetail;
