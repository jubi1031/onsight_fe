import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import style from '../../css/PwUpModal.module.css';

const PwUpModal = ({ onClose, onPasswordChange }) => {
  const user = useSelector((state) => state.user.userInfo);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const currentPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmNewPasswordRef = useRef(null);
  const apiUrl = process.env.REACT_APP_BACK_URL;

  const pwChange = async () => {
    if (newPassword !== confirmNewPassword) {
      alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/user/pwUpdate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        onPasswordChange('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
        onClose();
      } else {
        alert(data.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다. 다시 시도해 주세요.');
      console.error('비밀번호 변경 중 서버 오류:', err);
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
          <h2>비밀번호 변경하기</h2>
          <button onClick={onClose}>비밀번호 변경하기 닫기</button>
        </header>
        <header data-ui-mode="mb">
          <h2>비밀번호 변경하기</h2>
          <nav className={style.navBack}>
            <a href="#none">나의 정보관리</a>
          </nav>
        </header>
        <div className={style.content}>
          <h2 className={style.tit}>비밀번호 변경</h2>
          <p className={style.txt}>
            회원님의 소중한 정보를 보호하기 위해 비밀번호를 암호화하여
            관리합니다.
            <br />
            새로운 비밀번호를 입력하여 주시기 바랍니다.
          </p>
          <div className={style.formBox}>
            <fieldset>
              <legend>비밀번호 변경</legend>
              <dl className={style.form}>
                <dt>현재 비밀번호</dt>
                <dd>
                  <div className={style.form2}>
                    <input
                      type="password"
                      title="현재 비밀번호"
                      placeholder="현재 비밀번호를 입력해 주세요"
                      className={style.inputTxt}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      ref={currentPasswordRef}
                    />
                    <button
                      type="button"
                      className={`${style.btnIcon} ${
                        showCurrentPassword ? style.ic2 : style.ic1
                      }`}
                      onClick={() =>
                        toggleVisibility(
                          setShowCurrentPassword,
                          currentPasswordRef
                        )
                      }
                    ></button>
                  </div>
                </dd>
              </dl>
              <dl className={style.form}>
                <dt>새로운 비밀번호</dt>
                <dd>
                  <div className={style.form2}>
                    <input
                      type="password"
                      title="새 비밀번호"
                      placeholder="새 비밀번호를 입력해 주세요"
                      className={style.inputTxt}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      ref={newPasswordRef}
                    />
                    <button
                      type="button"
                      className={`${style.btnIcon} ${
                        showNewPassword ? style.ic2 : style.ic1
                      }`}
                      onClick={() =>
                        toggleVisibility(setShowNewPassword, newPasswordRef)
                      }
                    ></button>
                  </div>
                </dd>
              </dl>
              <dl className={style.form}>
                <dt>새로운 비밀번호 확인</dt>
                <dd>
                  <div className={style.form2}>
                    <input
                      type="password"
                      title="새 비밀번호 확인"
                      placeholder="새 비밀번호를 다시 입력해 주세요"
                      className={style.inputTxt}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      ref={confirmNewPasswordRef}
                    />
                    <button
                      type="button"
                      className={`${style.btnIcon} ${
                        showConfirmNewPassword ? style.ic2 : style.ic1
                      }`}
                      onClick={() =>
                        toggleVisibility(
                          setShowConfirmNewPassword,
                          confirmNewPasswordRef
                        )
                      }
                    ></button>
                  </div>
                </dd>
              </dl>
            </fieldset>
          </div>
          <div className={style.actionBox}>
            <button type="button" className={style.btnSub} onClick={pwChange}>
              비밀번호 변경
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PwUpModal;
