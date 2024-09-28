import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchRankList = createAsyncThunk(
    'rankList/fetchRankList', 
    async () => {
      const response = await axios.get('YOUR_API_ENDPOINT'); // 실제 API 엔드포인트로 변경하세요
      return response.data; // API에서 반환되는 데이터를 리턴
    }
  );

// Initial state
const initialState = {
    rankList: [
    {
        "thisWeek": {
            "myLeaderBoard": {
                "leaderboardType": 0,
                "userId": 13,
                "userNickname": "Myname",
                "gainXp": 700,
                "userRank": 13,
                "userRanking": 13
            },
            "thisWeekLeaderBoard": [
                {
                    "leaderboardType": 0,
                    "userId": 1,
                    "userNickname": "User1",
                    "gainXp": 10000,
                    "userRank": 1,
                    "userRanking": 1
                },
                {
                    "leaderboardType": 0,
                    "userId": 2,
                    "userNickname": "User2",
                    "gainXp": 9000,
                    "userRank": 2,
                    "userRanking": 2
                },
                {
                    "leaderboardType": 0,
                    "userId": 3,
                    "userNickname": "User3",
                    "gainXp": 8000,
                    "userRank": 3,
                    "userRanking": 3
                },
                {
                    "leaderboardType": 0,
                    "userId": 4,
                    "userNickname": "User4",
                    "gainXp": 7000,
                    "userRank": 4,
                    "userRanking": 4
                },
                {
                    "leaderboardType": 0,
                    "userId": 5,
                    "userNickname": "User5",
                    "gainXp": 6000,
                    "userRank": 5,
                    "userRanking": 5
                },
                {
                    "leaderboardType": 0,
                    "userId": 6,
                    "userNickname": "User6",
                    "gainXp": 5000,
                    "userRank": 6,
                    "userRanking": 6
                },
                {
                    "leaderboardType": 0,
                    "userId": 7,
                    "userNickname": "User7",
                    "gainXp": 4000,
                    "userRank": 7,
                    "userRanking": 7
                },
                {
                    "leaderboardType": 0,
                    "userId": 8,
                    "userNickname": "User8",
                    "gainXp": 3000,
                    "userRank": 8,
                    "userRanking": 8
                },
                {
                    "leaderboardType": 0,
                    "userId": 9,
                    "userNickname": "User9",
                    "gainXp": 2000,
                    "userRank": 9,
                    "userRanking": 9
                },
                {
                    "leaderboardType": 0,
                    "userId": 10,
                    "userNickname": "User10",
                    "gainXp": 1000,
                    "userRank": 10,
                    "userRanking": 10
                },
                {
                    "leaderboardType": 0,
                    "userId": 11,
                    "userNickname": "User11",
                    "gainXp": 900,
                    "userRank": 11,
                    "userRanking": 11
                },
                {
                    "leaderboardType": 0,
                    "userId": 12,
                    "userNickname": "User12",
                    "gainXp": 800,
                    "userRank": 12,
                    "userRanking": 12
                },
                {
                    "leaderboardType": 0,
                    "userId": 13,
                    "userNickname": "User13",
                    "gainXp": 700,
                    "userRank": 13,
                    "userRanking": 13
                },
                {
                    "leaderboardType": 0,
                    "userId": 14,
                    "userNickname": "User14",
                    "gainXp": 600,
                    "userRank": 14,
                    "userRanking": 14
                },
                {
                    "leaderboardType": 0,
                    "userId": 15,
                    "userNickname": "User15",
                    "gainXp": 500,
                    "userRank": 15,
                    "userRanking": 15
                },
                {
                    "leaderboardType": 0,
                    "userId": 16,
                    "userNickname": "User16",
                    "gainXp": 450,
                    "userRank": 16,
                    "userRanking": 16
                },
                {
                    "leaderboardType": 0,
                    "userId": 17,
                    "userNickname": "User17",
                    "gainXp": 400,
                    "userRank": 17,
                    "userRanking": 17
                },
                {
                    "leaderboardType": 0,
                    "userId": 18,
                    "userNickname": "User18",
                    "gainXp": 350,
                    "userRank": 18,
                    "userRanking": 18
                },
                {
                    "leaderboardType": 0,
                    "userId": 19,
                    "userNickname": "User19",
                    "gainXp": 300,
                    "userRank": 19,
                    "userRanking": 19
                },
                {
                    "leaderboardType": 0,
                    "userId": 20,
                    "userNickname": "User20",
                    "gainXp": 250,
                    "userRank": 20,
                    "userRanking": 20
                },
                {
                    "leaderboardType": 0,
                    "userId": 21,
                    "userNickname": "User21",
                    "gainXp": 200,
                    "userRank": 21,
                    "userRanking": 21
                },
                {
                    "leaderboardType": 0,
                    "userId": 22,
                    "userNickname": "User22",
                    "gainXp": 150,
                    "userRank": 22,
                    "userRanking": 22
                },
                {
                    "leaderboardType": 0,
                    "userId": 23,
                    "userNickname": "User23",
                    "gainXp": 100,
                    "userRank": 23,
                    "userRanking": 23
                },
                {
                    "leaderboardType": 0,
                    "userId": 24,
                    "userNickname": "User24",
                    "gainXp": 50,
                    "userRank": 24,
                    "userRanking": 24
                },
                {
                    "leaderboardType": 0,
                    "userId": 25,
                    "userNickname": "User25",
                    "gainXp": 0,
                    "userRank": 25,
                    "userRanking": 25
                },
            ]
        },
        "lastWeek": {
            "myLeaderBoard": {
                "leaderboardType": 1,
                "userId": 11,
                "userNickname": "Myname",
                "gainXp": 777,
                "userRank": 11,
                "userRanking": 11
            },
            "lastWeekLeaderBoard": [
                {
                    "leaderboardType": 1,
                    "userId": 1,
                    "userNickname": "User1",
                    "gainXp": 10001,
                    "userRank": 1,
                    "userRanking": 1
                },
                {
                    "leaderboardType": 1,
                    "userId": 2,
                    "userNickname": "User2",
                    "gainXp": 9999,
                    "userRank": 2,
                    "userRanking": 2
                },
                {
                    "leaderboardType": 1,
                    "userId": 3,
                    "userNickname": "User3",
                    "gainXp": 8888,
                    "userRank": 3,
                    "userRanking": 3
                },
                {
                    "leaderboardType": 1,
                    "userId": 4,
                    "userNickname": "User4",
                    "gainXp": 7777,
                    "userRank": 4,
                    "userRanking": 4
                },
                {
                    "leaderboardType": 1,
                    "userId": 5,
                    "userNickname": "User5",
                    "gainXp": 6666,
                    "userRank": 5,
                    "userRanking": 5
                },
                {
                    "leaderboardType": 1,
                    "userId": 6,
                    "userNickname": "User6",
                    "gainXp": 5555,
                    "userRank": 6,
                    "userRanking": 6
                },
                {
                    "leaderboardType": 1,
                    "userId": 7,
                    "userNickname": "User7",
                    "gainXp": 4444,
                    "userRank": 7,
                    "userRanking": 7
                },
                {
                    "leaderboardType": 1,
                    "userId": 8,
                    "userNickname": "User8",
                    "gainXp": 3333,
                    "userRank": 8,
                    "userRanking": 8
                },
                {
                    "leaderboardType": 1,
                    "userId": 9,
                    "userNickname": "User9",
                    "gainXp": 2222,
                    "userRank": 9,
                    "userRanking": 9
                },
                {
                    "leaderboardType": 1,
                    "userId": 10,
                    "userNickname": "User10",
                    "gainXp": 1111,
                    "userRank": 10,
                    "userRanking": 10
                },
                {
                    "leaderboardType": 1,
                    "userId": 11,
                    "userNickname": "User11",
                    "gainXp": 777,
                    "userRank": 11,
                    "userRanking": 11
                }
            ]
        }
    },
    ],
    loading: false, // 로딩 상태
    error: null, // 에러 상태
};


const rankListSlice = createSlice({
    name: 'rankList',
    initialState,
    reducers: {
      setRankList: (state, action) => {
        state.rankList = action.payload; // rankList를 업데이트
      },
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchRankList.pending, (state) => {
            state.loading = true; // 로딩 시작
            state.error = null; // 에러 초기화
          })
          .addCase(fetchRankList.fulfilled, (state, action) => {
            state.loading = false; // 로딩 종료
            state.rankList = action.payload; // API에서 받은 데이터로 rankList 업데이트
          })
          .addCase(fetchRankList.rejected, (state, action) => {
            state.loading = false; // 로딩 종료
            state.error = action.error.message; // 에러 메시지 저장
          });
      },
});



export const { setRankList } = rankListSlice.actions; // 액션 생성자 export
export default rankListSlice.reducer; // reducer export