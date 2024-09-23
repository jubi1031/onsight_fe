import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import style from '../css/SignUpPage.module.css';

const SignUpPage = () => {
  const [id, setId] = useState('');
  const [nick, setNick] = useState('');
  const [password, setPassword] = useState('');
  const [pdcon, setPdcon] = useState('');
  const [messages, setMessages] = useState({
    id: '',
    nick: '',
    password: '',
    pdcon: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACK_URL;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordVisibility2 = () => {
    setPasswordVisible2(!passwordVisible2);
  };

  const validateForm = () => {
    let valid = true;
    const newMessages = { id: '', nick: '', password: '', pdcon: '' };

    if (!/^[a-zA-Z0-9_-]{4,10}$/.test(id)) {
      newMessages.id = '4~10자 내외 영문,숫자,특수기호,_,-만 사용 가능합니다.';
      valid = false;
    }
    if (!/^[a-zA-Z0-9가-힣\u4E00-\u9FFF_-]{1,10}$/.test(nick)) {
      newMessages.nick = '닉네임은 10자 이내로 입력하세요.';
      valid = false;
    }
    if (
      !/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      newMessages.password =
        '영문소문자,숫자,특수문자를 포함한 8자이상 입력해주세요';
      valid = false;
    }
    if (password !== pdcon) {
      newMessages.pdcon = '동일한 패스워드를 입력하세요';
      valid = false;
    }

    setMessages(newMessages);
    return valid;
  };

  const register = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nick, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('회원가입에 성공하였습니다.');
        navigate('/SignInPage');
      } else {
        setErrorMessage(data.message || '회원가입 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setErrorMessage(
        '서버와의 통신 중 오류가 발생했습니다. 다시 시도해 주세요.'
      );
      console.error('Error during fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="con1">
      <main className={`mw ${style.register}`}>
        <form onSubmit={register}>
          <h2>회원가입</h2>
          <label>아이디 입력(4~10자)</label>
          <input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <span>{messages.id}</span>
          <label>닉네임</label>
          <input
            type="text"
            placeholder="닉네임"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            required
          />
          <span>{messages.nick}</span>
          <label>비밀번호</label>
          <div className={style.eye}>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="toggle-password" onClick={togglePasswordVisibility}>
              <img
                src={passwordVisible ? '/img/eye.png' : '/img/eye-slash.png'}
                alt={passwordVisible ? 'Hide password' : 'Show password'}
              />
            </p>
          </div>
          <label>비밀번호 확인</label>
          <div className={style.eye}>
            <input
              type={passwordVisible2 ? 'text' : 'password'}
              placeholder="비밀번호 확인"
              value={pdcon}
              onChange={(e) => setPdcon(e.target.value)}
              required
            />
            <p className="toggle-password" onClick={togglePasswordVisibility2}>
              <img
                src={passwordVisible2 ? '/img/eye.png' : '/img/eye-slash.png'}
                alt={passwordVisible2 ? 'Hide password' : 'Show password'}
              />
            </p>
          </div>
          <span>{messages.pdcon}</span>
          {errorMessage && <p className={style.error}>{errorMessage}</p>}
          <button type="submit" disabled={loading}>
            {loading ? '회원가입 중...' : '회원가입'}
          </button>
        </form>
        <p>
          이미 계정이 있으신가요? <Link to="/SignInPage">로그인</Link>
        </p>
      </main>
    </div>
  );
};

export default SignUpPage;
