import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Oauth() {
  const kakaoApiKey = process.env.REACT_APP_KAKAO_API_KEY;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

  const navigate = useNavigate();

  const [redirect, setRedirect] = useState(false);
  const URL = process.env.REACT_APP_BACK_URL;

  const getToken = async (code) => {
    if (!code) {
      throw new Error('인증코드가 없습니다.');
    }
    // 2. code를 이용하여 카카오 서버에서 Access Token을 받아옴
    const res = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: kakaoApiKey,
        redirect_uri: REDIRECT_URI,
        code,
      }),
    });
    return res.json();
  };

  const getUserInfo = async (token) => {
    const res = await fetch('https://kapi.kakao.com/v2/user/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  };

  useEffect(() => {
    const fetchData = async () => {
      // 1. 카카오 로그인 버튼을 클릭하면 인증코드를 받아옴 code=xxxx
      const code = new URL(window.location.href).searchParams.get('code');
      if (!code) {
        console.log('인증코드가 없습니다.');
        return;
      }
      try {
        // 2. 코드를 잘 받아왔다면 토큰을 받아옴
        const tokenRes = await getToken(code);

        //3. 인증코드를 localStorage에 저장 'token'명으로 저장
        localStorage.setItem('onSightKakaoToken', JSON.stringify(tokenRes));

        // 사용자 정보 가져오기
        const kakaoInfo = await getUserInfo(tokenRes.access_token);

        const apiUrl =
          'https://port-0-onsight-be-m1euz2429dd546a4.sel4.cloudtype.app';

        const response = await fetch(`${apiUrl}/user/kakao`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kakaoInfo }),
        });

        const data = await response.json();

        if (data.token) {
          localStorage.setItem('onSightToken', data.token);
          setRedirect(true);
        }

        // 사용자 정보를 localStorage에 저장 (필요에 따라)
        // localStorage.setItem('', JSON.stringify(userInfo));

        // 5. 토큰을 이용하여 사용자 정보를 받아올 수 있음 Header or Nav에 사용자 정보 표시
      } catch (err) {
        console.log('토큰 요청 중 에러 발생:', err);
        alert('토큰 요청 중 에러 발생: ' + err.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (redirect) {
      navigate('/');
    }
  }, [redirect, navigate]);

  return <></>;
}

export default Oauth;
