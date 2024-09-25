package middleware

import (
	"net/http"
)

// JWT 검증 미들웨어
func JWTMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Access 헤더에서 토큰 추출
		// authHeader := r.Header.Get("Access")
		// if authHeader == "" {
		// 	http.Error(w, "Access header missing", http.StatusUnauthorized)
		// 	return
		// }

		// 토큰 검증
		// if !util.ValidateToken(authHeader) {
		// 	http.Error(w, "Invalid token", http.StatusUnauthorized)
		// 	return
		// }

		// 토큰 검증에 성공하면 다음 핸들러로 요청 전달
		next.ServeHTTP(w, r)
	})
}
