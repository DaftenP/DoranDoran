package service

import (
	"fmt"
	"io"
	"net/http"
	"strings"
)

var (
	UserUrl = "http://user.ns-user.svc.cluster.local:8080"
)

// GET userUrl/api/v1/user/duplication?email="example@naver.com"
func DuplicationService(email string) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodGet, UserUrl+"/api/v1/user/duplication?email="+email, nil)
	if err != nil {
		return nil, err
	}

	return http.DefaultClient.Do(req)
}

// GET /api/v1/user/my-page/user/{userId}
func GetUserService(userId string) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodGet, UserUrl+"/api/v1/user/my-page/user/"+userId, nil)
	if err != nil {
		return nil, err
	}

	return http.DefaultClient.Do(req)
}

// GET /api/v1/user/find
func GetUserNameByUserIDService(userIds []int) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodGet, UserUrl+"/api/v1/user/find", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	requestBody := fmt.Sprintf("[%s]", strings.Trim(strings.Replace(fmt.Sprint(userIds), " ", ",", -1), "[]"))
	req.Body = io.NopCloser(strings.NewReader(requestBody))

	return http.DefaultClient.Do(req)
}
