import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchRankList = createAsyncThunk(
  'rankList/fetchRankList', 
  async (_, thunkAPI) => {

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/rank/leaderboard`
      const response = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }); 
      // console.log('leaderboard 호출 성공:',response.data)
      return response.data; // API에서 반환되는 데이터를 리턴
    
    } catch (error) {
      // console.log(error);
      return thunkAPI.rejectWithValue(error.response?.data || 'Server Error'); 
    }
  }
);

export const fetchMyLeague = createAsyncThunk(
  'myLeague/fetchMyLeague',
  async (_, thunkAPI) => {

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/rank/league`
      const response = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }); 
      return response.data; // API에서 반환되는 데이터를 리턴
    
    } catch (error) {
      // console.log(error);
      return thunkAPI.rejectWithValue(error.response?.data || 'Server Error'); 
    }
  }
);

// Initial state
const initialState = {
    rankList: {
        data: {
            "thisWeek": {
                "myLeaderBoard": {
                    "leaderboardType": 0,
                    "userId": 1,
                    "userNickname": "User1",
                    "gainXp": 5000,
                    "userRank": 1,
                    "order": 1
                },
                "thisWeekLeaderBoard": [
                    {
                        "leaderboardType": 0,
                        "userId": 1,
                        "userNickname": "User1",
                        "gainXp": 5000,
                        "userRank": 1,
                        "order": 1
                    },
                    {
                        "leaderboardType": 0,
                        "userId": 2,
                        "userNickname": "User2",
                        "gainXp": 4900,
                        "userRank": 2,
                        "order": 2
                    },
                    {
                        "leaderboardType": 0,
                        "userId": 3,
                        "userNickname": "User3",
                        "gainXp": 4800,
                        "userRank": 3,
                        "order": 3
                    },
                    {
                        "leaderboardType": 0,
                        "userId": 6,
                        "userNickname": "User6",
                        "gainXp": 4500,
                        "userRank": 6,
                        "order": 6
                    },
                    {
                        "leaderboardType": 0,
                        "userId": 8,
                        "userNickname": "User8",
                        "gainXp": 4300,
                        "userRank": 8,
                        "order": 8
                    },
                    {
                        "leaderboardType": 0,
                        "userId": 10,
                        "userNickname": "User10",
                        "gainXp": 4100,
                        "userRank": 10,
                        "order": 10
                    }
                ]
            },
            "lastWeek": {
                "myLeaderBoard": {
                    "leaderboardType": 1,
                    "userId": 1,
                    "userNickname": "User1",
                    "gainXp": 5000,
                    "userRank": 1,
                    "order": 1
                },
                "lastWeekLeaderBoard": [
                    {
                        "leaderboardType": 1,
                        "userId": 1,
                        "userNickname": "User1",
                        "gainXp": 5000,
                        "userRank": 1,
                        "order": 1
                    },
                    {
                        "leaderboardType": 1,
                        "userId": 2,
                        "userNickname": "User2",
                        "gainXp": 4900,
                        "userRank": 2,
                        "order": 2
                    },
                    {
                        "leaderboardType": 1,
                        "userId": 3,
                        "userNickname": "User3",
                        "gainXp": 4800,
                        "userRank": 3,
                        "order": 3
                    },
                    {
                        "leaderboardType": 1,
                        "userId": 6,
                        "userNickname": "User6",
                        "gainXp": 4500,
                        "userRank": 6,
                        "order": 6
                    },
                    {
                        "leaderboardType": 1,
                        "userId": 8,
                        "userNickname": "User8",
                        "gainXp": 4200,
                        "userRank": 8,
                        "order": 8
                    },
                    {
                        "leaderboardType": 1,
                        "userId": 10,
                        "userNickname": "User10",
                        "gainXp": 4100,
                        "userRank": 10,
                        "order": 10
                    }
                ]
            }
        },
        message: "정상적으로 요청이 완료되었습니다.",
        timestamp: "2024-09-25T12:26:42.3442773",
    },

    myLeague : {
		data : {
            "leagueInfo" : {
                "leagueId" : "2024-09-13-01",
                "createdAt" : "2024-09-02",
                "leagueRank" : 1000,
                "leagueNum" : 30,
            },
            "leagueMembers" : [
                {
                    "userId" : 1,
                    "userName" : "kim",
                    "userXP" : 200,
                    "order" : 1
                },
                {
                    "userId" : 2,
                    "userName" : "Lee",
                    "userXP" : 180,
                    "order" : 2 
                }
            ]
        },
        msg : "조회 성공"
    }
    // loading: false, // 로딩 상태
    // error: null, // 에러 상태
};


const rankingSlice = createSlice({
    name: 'rank',
    initialState,
    reducers: {
    //   setRankList: (state, action) => {
    //     state.rankList.data = action.payload.data; // rankList를 업데이트
    //   },
    //   setMyLeague(state, action) {
    //     state.myLeague.data = action.payload.data;
    //   },
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchRankList.pending, (state) => {
            state.rankList.loading = true; // 로딩 시작
            state.rankList.error = null; // 에러 초기화
          })
          .addCase(fetchRankList.fulfilled, (state, action) => {
            state.rankList.loading = false; // 로딩 종료
            state.rankList.data = action.payload.data; // API에서 받은 데이터로 rankList 업데이트
            state.rankList.message = action.payload.message;
            state.rankList.timestamp = action.payload.timestamp;
          })
          .addCase(fetchRankList.rejected, (state, action) => {
            state.rankList.loading = false;
            state.rankList.error = action.payload || 'Something went wrong';
          })

          .addCase(fetchMyLeague.pending, (state) => {
            state.myLeague.loading = true; // 로딩 시작
            state.myLeague.error = null; // 에러 초기화
          })
          .addCase(fetchMyLeague.fulfilled, (state, action) => {
            state.myLeague.loading = false; // 로딩 종료
            state.myLeague.data = action.payload.data; // API에서 받은 데이터로 rankList 업데이트
            state.myLeague.message = action.payload.message;
            state.myLeague.timestamp = action.payload.timestamp;
          })
          .addCase(fetchMyLeague.rejected, (state, action) => {
            state.myLeague.loading = false;
            state.myLeague.error = action.payload || 'Something went wrong';
          })
      },
});


// export const { setRankList, setMyLeague  } = rankingSlice.actions; // 액션 생성자 export
export const {   } = rankingSlice.actions; // 액션 생성자 export
export default rankingSlice.reducer; // reducer export