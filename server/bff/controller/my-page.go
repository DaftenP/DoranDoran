package controller

import (
	"encoding/json"
	"net/http"
	"strings"
	"sync"

	"com.doran.bff/model"
	"com.doran.bff/service"
	"com.doran.bff/util"
)

// DELETE /api/v1/bff/my-page/user
func DeleteUserController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// get token from cookie named 'refresh'
	cookie, err := r.Cookie("refresh")
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(cookie.Value, ":")
	userIdFromCookie := parts[0]

	// trim the leading space
	userIdFromCookie = strings.TrimSpace(userIdFromCookie)

	// forward request to user service
	util.ForwardRequest(w, r, http.MethodDelete, service.UserUrl+"/api/v1/user/delete/"+userIdFromCookie)
}

// GET /api/v1/bff/my-page/user
func GetUserController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// get token from cookie named 'refresh'
	cookie, err := r.Cookie("refresh")
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(cookie.Value, ":")
	userIdFromCookie := parts[0]

	// trim the leading space
	userIdFromCookie = strings.TrimSpace(userIdFromCookie)

	var userInfoResponseFromMSA model.UserInfoResponseFromMSA
	var rankInfoResponseFromMSA model.RankInfoResponseFromMSA

	var wg sync.WaitGroup
	var userServiceErr, rankServiceErr error

	// 비동기로 유저 정보를 가져오는 고루틴
	wg.Add(1)
	go func() {
		defer wg.Done()
		// Get user info from user service
		resp, err := service.GetUserService(userIdFromCookie)
		if err != nil {
			userServiceErr = err
			return
		}
		defer resp.Body.Close()

		// Parse response body json to struct
		err = json.NewDecoder(resp.Body).Decode(&userInfoResponseFromMSA)
		if err != nil {
			userServiceErr = err
			return
		}
	}()

	// 비동기로 랭크 정보를 가져오는 고루틴
	wg.Add(1)
	go func() {
		defer wg.Done()
		// Get rank info from rank service
		resp, err := service.GetRankInfoService(userIdFromCookie)
		if err != nil {
			rankServiceErr = err
			return
		}
		defer resp.Body.Close()

		// Parse response body json to struct
		err = json.NewDecoder(resp.Body).Decode(&rankInfoResponseFromMSA)
		if err != nil {
			rankServiceErr = err
			return
		}
	}()

	// 두 요청이 모두 끝날 때까지 기다림
	wg.Wait()

	// 에러 처리
	if userServiceErr != nil {
		http.Error(w, userServiceErr.Error(), http.StatusInternalServerError)
		return
	}
	if rankServiceErr != nil {
		http.Error(w, rankServiceErr.Error(), http.StatusInternalServerError)
		return
	}

	// Create response struct to client
	userInfoResponseToClient := model.UserInfoResponseToClient{
		Data: &model.UserInfoToClient{
			Nickname:  userInfoResponseFromMSA.Data.Nickname,
			Email:     userInfoResponseFromMSA.Data.Email,
			Xp:        userInfoResponseFromMSA.Data.Xp,
			Character: userInfoResponseFromMSA.Data.Character,
			Avatar:    userInfoResponseFromMSA.Data.Avatar,
			Voice:     userInfoResponseFromMSA.Data.Voice,
			Gem:       userInfoResponseFromMSA.Data.Gem,
			Rank:      rankInfoResponseFromMSA.Data.Rank,
		},
		Message:   userInfoResponseFromMSA.Message,
		TimeStamp: userInfoResponseFromMSA.TimeStamp,
	}

	// Response to client
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(userInfoResponseToClient); err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)

}
