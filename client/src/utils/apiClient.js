import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// 요청 인터셉터 설정
apiClient.interceptors.request.use(
  (config) => {
    // 로컬 스토리지나 상태 관리에서 accessToken을 가져와 헤더에 추가
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Access'] = accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 토큰 만료 시 처리 (401 Unauthorized)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 요청
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reissue`, {}, {
          withCredentials: true, // 쿠키에 있는 refreshToken을 자동으로 포함
        });

        // 새로운 accessToken 저장
        const newAccessToken = response.headers['access'];
        localStorage.setItem('accessToken', newAccessToken);

        // 갱신된 토큰으로 기존 요청 재전송
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (reissueError) {
        // 토큰 갱신 실패 시 로그아웃 처리 또는 에러 핸들링
        // console.log('Token reissue failed:', reissueError);
        return Promise.reject(reissueError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;