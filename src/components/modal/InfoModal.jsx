import { useSelector } from "react-redux";
import style from "../../css/InfoModal.module.css";
import { useState } from "react";

const InfoModal = ({ onClose, onPwCheck }) => {
  const [password, setPassword] = useState("");
  const user = useSelector((state) => state.user.userInfo);

  const userPwCheck = async () => {
    try {
      const response = await fetch(`http://localhost:8000/user/pwCheck`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, password }),
      });

      const data = await response.json();
      if (response.ok && data) {
        onClose();
        onPwCheck();
        // onClose();
      } else {
        console.error("Failed to fetch challenges");
      }
    } catch (err) {
      console.error("Error fetching challenges", err);
    }
  };

  return (
    <div className={style.popModal}>
      <section>
        <header data-ui-mode="pc">
          <h2>나의정보관리</h2>
          <button onClick={onClose}>나의정보관리 닫기</button>
        </header>
        <header data-ui-mode="mb">
          <h2>나의정보관리</h2>
          <nav className={style.navBack}>
            <a href="#none">나의 정보관리</a>
          </nav>
        </header>
        <div className={style.content}>
          <div className={style.area}>
            <h2 className={style.tit}>비밀번호 확인</h2>
            <p className={style.txt}>
              고객님의 개인정보를 안전하게 보호하기 위해 비밀번호를 한번 더
              확인합니다.
            </p>
            <div className={style.form}>
              <div className={style.form2}>
                <input
                  type="password"
                  title="비밀번호"
                  placeholder="비밀번호를 입력해주세요."
                  id="inputPassword"
                  className={style.inputTxt}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className={style.action}>
            <button type="button" className={style.btn} onClick={userPwCheck}>
              확인
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InfoModal;
