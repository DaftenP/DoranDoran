package util

import (
	"io"
	"net/http"
)

func ForwardRequest(w http.ResponseWriter, r *http.Request, method, targetURL string) {
	// http 요청을 새로 생성 (실제로 요청을 보내지는 않음)
	req, err := http.NewRequest(method, targetURL, r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// 요청 헤더 복사 (원래 받았던 요청 -> 새로 생성한 요청)
	copyHeaders(r.Header, req.Header)

	// http client 생성 (대충 http 요청을 보내는 놈)
	client := &http.Client{}

	// 앞서 생성한 요청을 보냄
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// 응답 헤더 복사 (새로 생성한 응답 -> 실제 되돌려 줄 응답)
	copyHeaders(resp.Header, w.Header())

	// 응답 코드 설정
	w.WriteHeader(resp.StatusCode)

	// 응답 본문 복사 (실제 되돌려 줄 응답 -> 실제 되돌려 줄 응답)
	io.Copy(w, resp.Body)
}
