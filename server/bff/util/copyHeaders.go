package util

import "net/http"

func copyHeaders(src, dst http.Header) {
	// src와 dst는 모두 http header
	// src의 모든 헤더를 dst로 복사하는 함수
	for k, vv := range src {
		for _, v := range vv {
			dst.Add(k, v)
		}
	}
}
