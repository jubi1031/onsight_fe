import axios from 'axios';

const baseURL =
  process.env.REACT_APP_BACK_URL ||
  'https://port-0-onsight-be-m1euz2429dd546a4.sel4.cloudtype.app';

// axios 인스턴스를 생성합니다.
const instance = axios.create({
  baseURL,
});

const ch = {
  /**
   * 참가등록
   * @param {string} challengename
   * @param {array} members
   * @returns  챌린지목록
   */
  chEnter: async (challengename, members) => {
    return await instance.post('/challenge/challegeEnter', {
      challengename: challengename,
      members: members,
    });
  },
  /**
   * 챌린지등록
   * @param {string} challengename
   * @param {string} id
   * @param {string} center
   * @param {string} address
   * @param {string} date yyyy-MM-dd
   * @returns 챌린지목록
   */
  chRegister: async (challengename, id, center, address, date) => {
    return await instance.post('/challenge/register', {
      challengename: challengename,
      id: id,
      center: center,
      address: address,
      date: date,
    });
  },

  /**
   * challenge 전체목록
   * @param {string} tag ('TOT','NOW','PAST')
   * @returns challenge Collection, 썸네일
   */
  chListEachStatus: async (tag) => {
    return await instance.post(
      '/challenge/challengeTotList',
      { STATE: tag },
      { headers: { 'Content-Type': 'application/json' } }
    );
  },

  /**
   * challenge 나의목록
   * @param {string} tag ('TOT','NOW','PAST')
   * @param {string} member_id
   * @returns challenge Collection, 썸네일
   */
  chMyList: async (tag, member_id) => {
    return await instance.post('/challenge/challengeMyList', {
      STATE: tag,
      member_id: member_id,
    });
  },

  /**
   * challenge memberList (참가자목록)
   * @param {string} challengename
   * @returns {*} id.nick,썸네일
   */
  chJoinList: async (challengename) => {
    return await instance.post('/challenge/challengeMemberList', {
      challengename: challengename,
    });
  },

  /**
   * challenge Ranking (순위목록)
   * @param {string} challengename
   * @returns {*} (순위),id.nick,썸네일,total
   */
  chRank: async (challengename) => {
    return await instance.post('/challenge/challengeRanking', {
      challengename: challengename,
    });
  },
};

//새로 추가되는 api list는 ,로 추가
export { ch };
