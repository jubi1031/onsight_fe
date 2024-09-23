import style from '../css/challengeDetail.module.css';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChallengeJoinUser from '../components/challenge/ChallengeJoinUser';
import ListPagnation from '../components/list/ListPagnation.jsx';
import { ch } from '../api.js';
import { useSelector } from 'react-redux';

const itemsPerPage = 5;

const ChallengeDetail = () => {
  //#region 변수,Hook
  const location = useLocation();
  const { detailData } = location.state || {}; // 파라미터
  const user = useSelector((state) => state.user.userInfo);
  const username = user ? user.id : null;
  // const nickname = user ? user.nick : null;
  // const [ongoing, setOngoing] = useState(false); //detailData에서 state가 넘어와서 해당기능 주석.
  const [wrapClass, setWrapClass] = useState(style.challenge_detail_wrap);
  const [challenge_img] = useState(detailData.thumbnail); // 챌린지 이미지
  const [challenge_period] = useState(detailData.date_string); // 챌린지 기간
  const [challenge_center] = useState(detailData.center); // 챌린지 장소
  const [joinList, setJoinList] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [rank, setRank] = useState([]);
  //페이징
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItems, setCurrentItems] = useState([]);
  const [indexOfLastItem] = useState(currentPage * itemsPerPage);
  const [indexOfFirstItem] = useState(indexOfLastItem - itemsPerPage);
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(rank.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, rank]);
  const [totalPages, setTotalPages] = useState();
  const apiUrl = process.env.REACT_APP_BACK_URL;

  //#region init
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    ch.chJoinList(detailData.challengename)
      .then((result) => {
        setJoinList(result.data);
        setIsJoined(result.data.some((member) => member.id === username)); // 참가 여부 확인
      })
      .catch((error) => {
        console.log(`${error}`);
      });
    if (detailData.state === 'false' || detailData.state === false) {
      setWrapClass(`${style.challenge_detail_wrap} ${style.end}`);
      ch.chRank(detailData.challengename)
        .then((result) => {
          setRank(result.data);
          setCurrentItems(result.data.slice(indexOfFirstItem, indexOfLastItem));
          setTotalPages(Math.ceil(result.data.length / itemsPerPage));
        })
        .catch((error) => {
          console.log(`${error}`);
        });
    } else if (detailData.state === 'true' || detailData.state === true) {
      setWrapClass(style.challenge_detail_wrap);
    }
  }, [
    detailData.challengename,
    detailData.state,
    indexOfFirstItem,
    indexOfLastItem,
    currentPage,
    username,
  ]);
  //#endregion init

  // const { challenge_id, challenge_name } = useParams(); // 챌린지 제목
  const navigate = useNavigate();

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleJoinClick = () => {
    if (isJoined) return;
    ch.chEnter(detailData.challengename, username) //username
      .then((result) => {
        console.log(result.data);
        alert('참가하기 등록 성공');
        window.location.reload();
      })
      .catch((error) => {
        console.log(`${error}`);
        alert('참가하기 등록 실패');
      });
  };

  return (
    <>
      <div className="con1">
        <main id={style.container} className="mw">
          <div className={style.content}>
            {/* 아래 타이틀 및 페이지 네비 영역은 들어가야 챌린지 일정과 헤딩 태그 레벨이 맞음. */}
            <div className={style.page_tit_area}>
              <h2 className={style.page_tit}>챌린지 상세</h2>
              <nav className={style.page_nav}>
                <ul>
                  {/* <li className={style.active}>
                    <a
                      href='#'
                      className={style.page_link}
                      title='나의 챌린지 만들기 페이지 이동 링크'
                    >
                      나의 챌린지 만들기
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className={style.page_link}
                      title='나의 챌린지 보기 페이지 이동 링크'
                    >
                      나의 챌린지 보기
                    </a>
                  </li> */}
                </ul>
              </nav>
            </div>
            {/* 기본이 진행중 화면으로  기간이 지난 챌린지에는 아래 div.challenge_detail_wrap에 .end 추가하여 순위 콘텐츠 표시되도록 함 */}
            <div className={wrapClass}>
              <button
                onClick={() => navigate(-1)}
                className={style.back_button}
              >
                <i className="fa-solid fa-angle-left"></i>
              </button>
              <div className={style.challenge_info}>
                <div className={style.challenge_left}>
                  <div className={style.challenge_img}>
                    <img
                      srcSet={`${challenge_img}`}
                      src={`${challenge_img}`}
                      alt="A챌린지 이미지"
                    />
                  </div>
                  <div className={style.apply_btn_wrap}>
                    <button
                      type="button"
                      id={style.applyBtn}
                      className={`${style.apply_btn} ${
                        isJoined ? style.apply_btn_completed : ''
                      }`}
                      onClick={() => {
                        handleJoinClick();
                      }}
                      disabled={isJoined} // 참가 여부에 따라 버튼 비활성화
                    >
                      {isJoined ? '참가 완료' : '참가하기'}
                    </button>
                  </div>
                </div>
                <div className={style.challenge_detail}>
                  <div className={style.sub_tit_area}>
                    <h3 className={style.sub_tit}>
                      {detailData.challengename}
                    </h3>
                    <ul className={style.detail_list}>
                      <li>
                        <span className={style.bold}>기간</span>
                        <span>{challenge_period}</span>
                        {detailData.state === 'true' ||
                        detailData.state === true ? (
                          <span className={`${style.status} ${style.ing}`}>
                            진행 중
                          </span>
                        ) : (
                          <span className={`${style.status} ${style.end}`}>
                            기간 종료
                          </span>
                        )}
                      </li>
                      <li>
                        <span className={style.bold}>장소</span>
                        <span>{challenge_center}</span>
                      </li>
                    </ul>
                    <div className={style.entry_list_wrap}>
                      <button type="button" className={style.entry_list_btn}>
                        챌린지 참여자
                      </button>
                      <ul className={style.entry_list}>
                        {joinList.map((data, index) => (
                          <ChallengeJoinUser
                            key={index}
                            user_name={data.nick}
                            thumbnail={data.thumbnail}
                          />
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.detail_contents}>
                <div className={style.rank_table_wrap}>
                  <table className={style.rank_table}>
                    <thead>
                      <tr>
                        <th>프로필</th>
                        <th>등수</th>
                        <th>닉네임</th>
                        <th>점수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div
                              className={`${style.rank_profile} ${
                                item.rank <= 3 ? style[`rank-${item.rank}`] : ''
                              }`}
                            >
                              <img
                                src={
                                  item.thumbnail == null
                                    ? '/img/joinuser.png'
                                    : `${apiUrl}${item.thumbnail}`
                                }
                                alt="Profile"
                              />
                              {/* <span className={style.trophy} /> */}
                              {item.rank <= 3 && (
                                <span className={`${style.trophy}`} />
                              )}
                            </div>
                          </td>
                          <td>{item.rank}등</td>
                          <td>{item.nick}</td>
                          <td>{item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className={style.noti_txt}>
                    * 집계는 <em>챌린지가 끝난 후</em> 결정돼요.
                  </div>
                  {(detailData.state === 'false' ||
                    detailData.state === false) && (
                    <ListPagnation
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ChallengeDetail;
