package util

import (
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

func ValidateToken(token string) bool {
	secretKey := os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		return false
	}

	token = strings.Replace(token, "Bearer ", "", 1)

	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(secretKey), nil
	})

	if err != nil || !parsedToken.Valid {
		return false
	}

	return true
}
