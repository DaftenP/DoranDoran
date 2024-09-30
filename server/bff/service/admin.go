package service

import (
	"crypto/md5"
	"encoding/base64"
	"errors"
	"fmt"
	"os"
	"strings"
	"time"
)

func QuizService(seed string, prompt string) (string, error) {
	securityKey := os.Getenv("BUNNY_SECRET_KEY")
	path := "/.ai/img/dalle-256/cozy/" + seed + "/" + prompt + ".jpg"
	baseUrl := "https://ssafy-tailored.b-cdn.net"

	if securityKey == "" {
		return "", errors.New("BUNNY_SECRET_KEY is not set")
	}

	expireTimestamp := time.Now().Unix() + 3600
	tokenContent := securityKey + path + fmt.Sprintf("%d", expireTimestamp)
	md5sum := md5.New()
	md5sum.Write([]byte(tokenContent))
	tokenDigest := md5sum.Sum(nil)
	tokenBase64 := base64.StdEncoding.EncodeToString(tokenDigest)
	tokenFormatted := strings.ReplaceAll(tokenBase64, "\n", "")
	tokenFormatted = strings.ReplaceAll(tokenFormatted, "+", "-")
	tokenFormatted = strings.ReplaceAll(tokenFormatted, "/", "_")
	tokenFormatted = strings.ReplaceAll(tokenFormatted, "=", "")

	url := baseUrl + path + "?token=" + tokenFormatted + "&expires=" + fmt.Sprintf("%d", expireTimestamp)

	return url, nil

}
