import './css/my_reset.css';
import './css/App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Main from './pages/Main';
import SignInPage from './pages/SignInPage';
import Oauth from './pages/Oauth';
import SignUpPage from './pages/SignUpPage';
import MyPage from './pages/MyPage';
import SearchPage from './pages/SearchPage';
import Crew from './pages/Crew';
import Challenge from './pages/Challenge';
import ChallengeDetail from './pages/ChallengeDetail';
import CreateCrew from './pages/CreateCrew';
import CrewDetail from './pages/CrewDetail';
import Profile from './pages/Profile';
import Ranking from './pages/Ranking';
import CrewFeedDetail from './pages/CrewFeedDetail';
import CrewFeedEdit from './pages/CrewFeedEdit';
import RecordDetail from './pages/RecordDetail';
import MyPageList1 from './components/MyPageList1';
import MyPageList2 from './components/MyPageList2';
import MyPageList3 from './components/MyPageList3';
import MyPageList4 from './components/MyPageList4';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signinpage" element={<SignInPage />} />
        <Route path="/oauth/kakao" element={<Oauth />} />
        <Route path="/signuppage" element={<SignUpPage />} />
        <Route path="/mypage/:userId/" element={<MyPage />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<MyPageList1 />} />
          <Route path="feeds" element={<MyPageList3 />} />
          <Route path="records" element={<MyPageList2 />} />
          <Route path="crews" element={<MyPageList4 />} />
        </Route>
        <Route path="/SearchPage" element={<SearchPage />} />
        <Route path="/crew" element={<Crew />} />
        <Route path="/createCrew" element={<CreateCrew />} />
        <Route path="/crewdetail/:crewId/*" element={<CrewDetail />} />
        <Route path="/challenge" element={<Challenge />} />
        <Route path="/challenge/:challenge_id/:challenge_name" element={<ChallengeDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/crewdetail/feeddetail/:feedId/*" element={<CrewFeedDetail />} />
        <Route path="/crewdetail/feeddetail/edit/:feedId" element={<CrewFeedEdit />} />
        <Route path="/rank" element={<Ranking />} />
        <Route path="/recorddetail/:id" element={<RecordDetail />} />
      </Routes>
    </div>
  );
}

export default App;
