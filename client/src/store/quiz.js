import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchStageList = createAsyncThunk(
  'stageList/fetchStageList', 
  async () => {
    const response = await axios.get('YOUR_API_ENDPOINT'); // 실제 API 엔드포인트로 변경하세요
    return response.data; // API에서 반환되는 데이터를 리턴
  }
);

export const fetchDailyQuizList = createAsyncThunk(
  'dailyQuizList/fetchDailyQuizList',
  async () => {
    const response = await axios.get('YOUR_MYGROUP_API_ENDPOINT');
    return response.data; // API에서 반환된 myGroup 데이터
  }
);


// Initial state
const initialState = {
  stageList:[
    {
      'stageId': 1,
      'order': 1,
      'quizList':[
        {
          'quizId': 1,
          'order': 1,
          "title": "단어 맞추기",
          'quizQuest': [
            {
              'image': 'Image5-1',
              'voice': 'Voice1-1',
            },
            {
              'image': 'Image1-2',
              'voice': 'Voice1-2',
            },
            {
              'image': 'Image1-3',
              'voice': 'Voice1-3',
            },
            {
              'image': 'Image1-4',
              'voice': 'Voice1-4',
            }
          ],
        },
        {
          'quizId': 2,
          'order': 2,
          "title": "문장 맞추기",
          'quizQuest': [
            {
              'image': 'Image2-1',
              'voice': 'Voice2-1',
            },
            {
              'image': 'Image2-2',
              'voice': 'Voice2-2',
            },
            {
              'image': 'Image2-3',
              'voice': 'Voice2-3',
            },
            {
              'image': 'Image2-4',
              'voice': 'Voice2-4',
            }
          ]
        }
      ],
    },
    {
      'stageId': 2,
      'order': 2,
      'quizList':[
        {
          'quizId': 1,
          'order': 1,
          "title": "단어 맞추기",
          'quizQuest': [
            {
              'image': 'Image6-1',
              'voice': 'Voice1-1',
            },
            {
              'image': 'Image1-2',
              'voice': 'Voice1-2',
            },
            {
              'image': 'Image1-3',
              'voice': 'Voice1-3',
            },
            {
              'image': 'Image1-4',
              'voice': 'Voice1-4',
            }
          ],
        },
        {
          'quizId': 2,
          'order': 2,
          "title": "문장 맞추기",
          'quizQuest': [
            {
              'image': 'Image2-1',
              'voice': 'Voice2-1',
            },
            {
              'image': 'Image2-2',
              'voice': 'Voice2-2',
            },
            {
              'image': 'Image2-3',
              'voice': 'Voice2-3',
            },
            {
              'image': 'Image2-4',
              'voice': 'Voice2-4',
            }
          ]
        }
      ]
    },
    {
      'stageId': 3,
      'order': 3,
      'quizList':[
        {
          'quizId': 1,
          'order': 1,
          "title": "단어 맞추기",
          'quizQuest': [
            {
              'image': 'Image7-1',
              'voice': 'Voice1-1',
            },
            {
              'image': 'Image1-2',
              'voice': 'Voice1-2',
            },
            {
              'image': 'Image1-3',
              'voice': 'Voice1-3',
            },
            {
              'image': 'Image1-4',
              'voice': 'Voice1-4',
            }
          ],
        },
        {
          'quizId': 2,
          'order': 2,
          "title": "문장 맞추기",
          'quizQuest': [
            {
              'image': 'Image2-1',
              'voice': 'Voice2-1',
            },
            {
              'image': 'Image2-2',
              'voice': 'Voice2-2',
            },
            {
              'image': 'Image2-3',
              'voice': 'Voice2-3',
            },
            {
              'image': 'Image2-4',
              'voice': 'Voice2-4',
            }
          ]
        }
      ]
    },
    {
      'stageId': 4,
      'order': 4,
      'quizList':[
        {
          'quizId': 1,
          'order': 1,
          "title": "단어 맞추기",
          'quizQuest': [
            {
              'image': 'Image8-1',
              'voice': 'Voice1-1',
            },
            {
              'image': 'Image1-2',
              'voice': 'Voice1-2',
            },
            {
              'image': 'Image1-3',
              'voice': 'Voice1-3',
            },
            {
              'image': 'Image1-4',
              'voice': 'Voice1-4',
            }
          ],
        },
        {
          'quizId': 2,
          'order': 2,
          "title": "문장 맞추기",
          'quizQuest': [
            {
              'image': 'Image2-1',
              'voice': 'Voice2-1',
            },
            {
              'image': 'Image2-2',
              'voice': 'Voice2-2',
            },
            {
              'image': 'Image2-3',
              'voice': 'Voice2-3',
            },
            {
              'image': 'Image2-4',
              'voice': 'Voice2-4',
            }
          ]
        }
      ]
    },
  ],
  'dailyQuizList':[
        {
          'quizId': 1,
          'order': 1,
          'title': "단어 맞추기",
          'quizQuest': [
            {
              'image': 'Image1-1',
              'voice': 'Voice1-1',
            },
            {
              'image': 'Image1-2',
              'voice': 'Voice1-2',
            },
            {
              'image': 'Image1-3',
              'voice': 'Voice1-3',
            },
            {
              'image': 'Image1-4',
              'voice': 'Voice1-4',
            }
          ],
        },
        {
          'quizId': 2,
          'order': 2,
          'title': "문장 맞추기",
          'quizQuest': [
            {
              'image': 'Image2-1',
              'voice': 'Voice2-1',
            },
            {
              'image': 'Image2-2',
              'voice': 'Voice2-2',
            },
            {
              'image': 'Image2-3',
              'voice': 'Voice2-3',
            },
            {
              'image': 'Image2-4',
              'voice': 'Voice2-4',
            }
          ]
        }
      ],
  loading: false, // 로딩 상태
  error: null, // 에러 상태
};

// Redux slice
const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setStageList: (state) => {
      state.stageList = action.payload;
    },
    deleteStage: (state) => {
      state.stageList.quizList.shift()
    },
    deleteQuiz: (state) => {
      state.dailyQuizList.shift()
    },
    backQuiz: (state) => {
      const firstQuiz = state.dailyQuizList.shift()
      state.dailyQuizList.push(firstQuiz)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStageList.pending, (state) => {
        state.loading = true; // 로딩 시작
        state.error = null; // 에러 초기화
      })
      .addCase(fetchStageList.fulfilled, (state, action) => {
        state.loading = false; // 로딩 종료
        state.stageList = action.payload; // API에서 받은 데이터로 rankList 업데이트
      })
      .addCase(fetchStageList.rejected, (state, action) => {
        state.loading = false; // 로딩 종료
        state.error = action.error.message; // 에러 메시지 저장
      });
      
    builder
      .addCase(fetchDailyQuizList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyQuizList.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyQuizList = action.payload; // API에서 받은 myGroup으로 업데이트
      })
      .addCase(fetchDailyQuizList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // 에러 처리
      });
  }
});

export const { setStageList, deleteStage, deleteQuiz, backQuiz } = quizSlice.actions;
export default quizSlice.reducer;
