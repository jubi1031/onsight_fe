import style from '../../css/Withdrawal.module.css';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

const WithdrawalModal = ({ onClose, onWithdrawSuccess }) => {
  const user = useSelector((state) => state.user.userInfo);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const apiUrl = process.env.REACT_APP_BACK_URL;

  const passwordRef = useRef(null);

  const withdrawal = async () => {
    try {
      const response = await fetch(`${apiUrl}/user/withdrawal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        onClose();
        onWithdrawSuccess();
      } else {
        alert(data.message || '회원 탈퇴에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다. 다시 시도해 주세요.');
      console.error('회원 탈퇴 중 서버 오류:', err);
    }
  };

  const toggleVisibility = (setter, ref) => {
    setter((prev) => !prev);
    ref.current.type = ref.current.type === 'password' ? 'text' : 'password';
  };

  return (
    <div className={style.popModal}>
      <section>
        <header data-ui-mode="pc">
          <h2>회원 탈퇴하기</h2>
          <button onClick={onClose}>회원 탈퇴 닫기</button>
        </header>
        <header data-ui-mode="mb">
          <h2>회원 탈퇴하기</h2>
          <nav className={style.navBack}>
            <a onClick={onClose}>나의 정보관리</a>
          </nav>
        </header>
        <div className={style.content}>
          <h2 className={style.tit}>회원탈퇴</h2>
          <p className={style.txt}>
            홈페이지를 이용해 주셔서 감사합니다.
            <br />
            회원탈퇴 시 회원정보는 안전하게 모두 삭제됩니다.
          </p>
          <div className={style.formBox}>
            <fieldset>
              <legend>회원탈퇴사유입력</legend>
              <dl className={style.form}>
                <dt>아이디</dt>
                <dd>
                  <div className={style.form2}>
                    <input
                      type="text"
                      title="아이디"
                      disabled="disabled"
                      className={style.inputTxt}
                      value={user.id}
                    />
                  </div>
                </dd>
              </dl>
              <dl className={style.form}>
                <dt>비밀번호</dt>
                <dd>
                  <div className={style.form2}>
                    <input
                      type="password"
                      title="비밀번호"
                      placeholder="비밀번호 입력"
                      id="Password"
                      className={style.inputTxt}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      ref={passwordRef}
                    />
                    <button
                      type="button"
                      className={`${style.btnIcon} ${
                        showPassword ? style.ic2 : style.ic1
                      }`}
                      onClick={() =>
                        toggleVisibility(setShowPassword, passwordRef)
                      }
                    ></button>
                  </div>
                </dd>
              </dl>
            </fieldset>
          </div>
          <div className={style.actionBox}>
            <button type="button" className={style.btnSub} onClick={onClose}>
              취소
            </button>
            <button type="button" className={style.btnSub} onClick={withdrawal}>
              탈퇴
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WithdrawalModal;
