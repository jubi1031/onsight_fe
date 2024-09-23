import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {
  setClimbingCenters,
  setDistrictCoordinates,
  setRecords,
} from '../store/searchStore';

const useSearchData = (currentCenter) => {
  const dispatch = useDispatch();
  const [districtCoordinates, setDistrictCoordinatesState] = useState({});
  const apiUrl = process.env.REACT_APP_BACK_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/district-coordinates`)
      .then((response) => {
        const coordinates = {};
        response.data.forEach((item) => {
          coordinates[item.gu] = item.latlng;
        });
        setDistrictCoordinatesState(coordinates);
        dispatch(setDistrictCoordinates(coordinates));
      })
      .catch((error) => console.error('API 요청 에러:', error));
  }, [dispatch]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/center`)
      .then((response) => {
        dispatch(setClimbingCenters(response.data));
      })
      .catch((error) => console.error('API 요청 에러:', error));
  }, [dispatch]);

  useEffect(() => {
    if (currentCenter) {
      axios
        .get(`${apiUrl}/record/center?center=${currentCenter.center}`)
        .then((response) => {
          dispatch(setRecords(response.data));
        })
        .catch((error) => console.error('기록 데이터 요청 에러:', error));
    }
  }, [currentCenter, dispatch]);

  return { districtCoordinates };
};

export default useSearchData;
