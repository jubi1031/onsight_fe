import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import style from '../css/Search.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { filterCenters } from '../utils/searchUtils';
import CenterDetails from '../components/CenterDetails'; // CenterDetails 컴포넌트 임포트
import MapView from '../components/MapView';
import { setUserAllInfo } from '../store/userStore';

const Search = () => {
  const location = useLocation();
  const user = useSelector((state) => state.user.userInfo); // 리덕스의 유저정보
  const dispatch = useDispatch();
  const [centerList, setCenterList] = useState([]); // 센터 리스트
  const [guList, setGuList] = useState([]); // 구 리스트
  const [gu, setGu] = useState('전체'); // 선택된 구 상태 추가
  const [city, setCity] = useState('서울특별시'); // 선택된 시 상태 추가
  const [searchTerm, setSearchTerm] = useState(''); // 검색 상태 추가
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [filteredCenters, setFilteredCenters] = useState([]); // 필터링된 센터 리스트
  const [mapMarkers, setMapMarkers] = useState([]); // 구에 따른 맵마커 리스트
  const [currentCenter, setCurrentCenter] = useState(null); // 선택된 센터 상태 추가
  const [showDetails, setShowDetails] = useState(false); // 상세 정보 표시 상태 추가
  const [activeTab, setActiveTab] = useState('home'); // 활성 탭 상태 추가
  const [userLikes, setUserLikes] = useState(user?.like || []); // 사용자 좋아요 상태 추가
  const [records, setRecords] = useState([]); // 기록 상태 추가
  const apiUrl = process.env.REACT_APP_BACK_URL;

  useEffect(() => {
    if (user && user.like) {
      setUserLikes(user.like);
    }

    const fetchCenterData = async () => {
      try {
        const response = await fetch(`${apiUrl}/center/centerList`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCenterList(data);
          setFilteredCenters(filterCenters(data, searchTerm, gu)); // 초기 필터링 수행
          setMapMarkers(filterCenters(data, '', gu)); // 초기 구 필터링 수행
        } else {
          console.error('Failed to fetch center');
        }
      } catch (err) {
        console.error('Error fetching center', err);
      }
    };

    const loadGuData = () => {
      const guData = localStorage.getItem('guList');
      if (guData) {
        setGuList(JSON.parse(guData));
      } else {
        console.error('No gu data in local storage');
      }
    };

    fetchCenterData();
    loadGuData();
  }, [user, gu]);

  useEffect(() => {
    if (location.state && location.state.detailData) {
      const center = location.state.detailData;
      handleCenterClick(center);
    }
  }, [location.state]);

  const fetchRecords = async (centerId) => {
    try {
      const response = await fetch(`${apiUrl}/center/${centerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      } else {
        console.error('Failed to fetch records');
      }
    } catch (err) {
      console.error('Error fetching records', err);
    }
  };

  const handleDistrictChange = (e) => {
    const selectedGu = e.target.value;
    setGu(selectedGu);
    const guData = guList.find((g) => g.gu === selectedGu);
    if (guData) {
      setMapCenter({ lat: guData.latlng.lat, lng: guData.latlng.lng });
    } else {
      setMapCenter({ lat: 37.5665, lng: 126.978 }); // 기본 좌표 설정
    }
    const newFilteredCenters = filterCenters(centerList, '', selectedGu);
    setFilteredCenters(newFilteredCenters); // 구 변경 시 필터링 수행
    setMapMarkers(newFilteredCenters); // 구 변경 시 맵마커 업데이트
  };

  const handleCenterClick = (center) => {
    setMapCenter({ lat: center.latlng.lat, lng: center.latlng.lng });
    setCurrentCenter(center);
    setShowDetails(true);
    fetchRecords(center.center); // 선택한 센터에 해당하는 records 값을 가져옴
  };

  const performSearch = () => {
    setFilteredCenters(filterCenters(centerList, searchTerm, gu));
  };

  const resetFilters = () => {
    setCity('서울특별시');
    setGu('전체');
    setSearchTerm('');
    setMapCenter({ lat: 37.5665, lng: 126.978 });
    const initialFilteredCenters = filterCenters(centerList, '', '전체');
    setFilteredCenters(initialFilteredCenters);
    setMapMarkers(initialFilteredCenters);
    setShowDetails(false);
    setCurrentCenter(null);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      performSearch();
    }
  };

  const handleToggleLike = async (centerId) => {
    try {
      const response = await fetch(`${apiUrl}/user/toggleLike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id, centerId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          setUserLikes(data.like);
          dispatch(setUserAllInfo(data));
        }
      } else {
        console.error('Failed to toggle like');
      }
    } catch (err) {
      console.error('Error toggling like', err);
    }
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setCurrentCenter(null);
  };

  const selectedCoordinates = mapCenter;

  return (
    <main className={`${style.viewCon} ${style.search}`}>
      <div className={`${style.sidebar} ${showDetails ? style.details : ''}`}>
        {showDetails && currentCenter ? (
          <CenterDetails
            currentCenter={currentCenter}
            showDetails={showDetails}
            activeTab={activeTab}
            records={records}
            handleCloseDetails={handleCloseDetails}
            setActiveTab={setActiveTab}
            userLikes={userLikes}
            toggleLike={handleToggleLike}
          />
        ) : (
          <>
            <div className={style.searchInputCon}>
              <h3>암장 찾기</h3>
              <div className={style.selectCity}>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="서울특별시">서울특별시</option>
                </select>
                <select value={gu} onChange={handleDistrictChange}>
                  {guList.map((district) => (
                    <option key={district.gu} value={district.gu}>
                      {district.gu}
                    </option>
                  ))}
                </select>
              </div>
              <div className={style.searchCon}>
                <input
                  type="text"
                  className={style.searchInput}
                  placeholder="검색창"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleKeyPress(e);
                    }
                  }}
                />
                <i
                  className={`fa-solid fa-magnifying-glass ${style.readingGlasses}`}
                  onClick={performSearch}
                ></i>
                <i
                  className={`fa-solid fa-rotate-left ${style.rotate}`}
                  onClick={resetFilters}
                ></i>
              </div>
            </div>
            <div className={style.searchResults}>
              {filteredCenters.map((center) => (
                <div
                  key={center._id}
                  className={style.centerList}
                  onClick={() => handleCenterClick(center)}
                >
                  <img src={center.thumbnail} alt={center.center} />
                  <div className={style.centerInfo}>
                    <div>
                      <h4>{center.center}</h4>
                      <p>{center.gu}</p>
                    </div>
                    <i
                      className={`fa-regular fa-star ${style.likeStar} ${
                        userLikes.includes(center._id) ? 'fa-solid' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLike(center._id);
                      }}
                    ></i>
                  </div>
                  <p className={style.centerDetail}>{center.detail}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className={style.mapContainer}>
        <MapView
          mapCenter={selectedCoordinates}
          climbingCenters={mapMarkers}
          selectedCity={city}
          selectedDistrict={gu}
          handleMarkerClick={handleCenterClick}
        />
      </div>
    </main>
  );
};

export default Search;
