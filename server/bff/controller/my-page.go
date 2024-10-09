package controller

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"strings"
	"sync"

	"com.doran.bff/model"
	"com.doran.bff/service"
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

	parts := strings.Split(cookie.Value, "%3A")
	userIdFromCookie := parts[0]

	// trim the leading space
	userIdFromCookie = strings.TrimSpace(userIdFromCookie)

	// forward request to user service
	resp, err := service.DeleteUserService(userIdFromCookie)
	if err != nil {
		http.Error(w, "Error calling DeleteUserService", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Response to client
	var deleteResponse model.DeleteResponseFromMSA
	if err := json.NewDecoder(resp.Body).Decode(&deleteResponse); err != nil {
		http.Error(w, "Error parsing response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(deleteResponse); err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
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

	parts := strings.Split(cookie.Value, "%3A")
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
			Nickname:    userInfoResponseFromMSA.Data.Nickname,
			Email:       userInfoResponseFromMSA.Data.Email,
			Xp:          userInfoResponseFromMSA.Data.Xp,
			Color:       userInfoResponseFromMSA.Data.Color,
			Equipment:   userInfoResponseFromMSA.Data.Equipment,
			Background:  userInfoResponseFromMSA.Data.Background,
			Gem:         userInfoResponseFromMSA.Data.Gem,
			DailyStatus: userInfoResponseFromMSA.Data.DailyStatus,
			Status:      userInfoResponseFromMSA.Data.Status,
			Birthday:    userInfoResponseFromMSA.Data.Birthday,
			Psize:       userInfoResponseFromMSA.Data.Psize,
			Rank:        rankInfoResponseFromMSA.Data.Rank,
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

// PATCH /api/v1/bff/my-page/birthday
func UpdateBirthdayController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// get token from cookie named 'refresh'
	cookie, err := r.Cookie("refresh")
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(cookie.Value, "%3A")
	userIdFromCookie := parts[0]

	// trim the leading space
	userIdFromCookie = strings.TrimSpace(userIdFromCookie)

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	var data map[string]interface{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Error parsing request body", http.StatusInternalServerError)
		return
	}

	birthday, ok := data["birthday"]
	if !ok {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	resp, err := service.UpdateBirthdayService(userIdFromCookie, birthday.(string))
	if err != nil {
		http.Error(w, "Error calling UpdateBirthdayService", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Response to client
	var updateBirthdayResponse model.PatchResponseToClient
	if err := json.NewDecoder(resp.Body).Decode(&updateBirthdayResponse); err != nil {
		http.Error(w, "Error parsing response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(updateBirthdayResponse); err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// PATCH /api/v1/bff/my-page/nickname
func UpdateNicknameController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// get token from cookie named 'refresh'
	cookie, err := r.Cookie("refresh")
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(cookie.Value, "%3A")
	userIdFromCookie := parts[0]

	// trim the leading space
	userIdFromCookie = strings.TrimSpace(userIdFromCookie)

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	var data map[string]interface{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Error parsing request body", http.StatusInternalServerError)
		return
	}

	nickname, ok := data["nickname"]
	if !ok {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	resp, err := service.UpdateNicknameService(userIdFromCookie, nickname.(string))
	if err != nil {
		http.Error(w, "Error calling UpdateNicknameService", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Response to client
	var updateNicknameResponse model.PatchResponseToClient
	if err := json.NewDecoder(resp.Body).Decode(&updateNicknameResponse); err != nil {
		http.Error(w, "Error parsing response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(updateNicknameResponse); err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// PATCH /api/v1/bff/my-page/password
func UpdatePasswordController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// get token from cookie named 'refresh'
	cookie, err := r.Cookie("refresh")
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(cookie.Value, "%3A")
	userIdFromCookie := parts[0]

	// trim the leading space
	userIdFromCookie = strings.TrimSpace(userIdFromCookie)

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	var data map[string]interface{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Error parsing request body", http.StatusInternalServerError)
		return
	}

	prevPassword, ok := data["prevPassword"]
	if !ok {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	modPassword, ok := data["modPassword"]
	if !ok {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	resp, err := service.UpdatePasswordService(userIdFromCookie, prevPassword.(string), modPassword.(string))
	if err != nil {
		http.Error(w, "Error calling UpdatePasswordService", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Response to client
	var updatePasswordResponse model.PatchResponseToClient
	if err := json.NewDecoder(resp.Body).Decode(&updatePasswordResponse); err != nil {
		http.Error(w, "Error parsing response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(updatePasswordResponse); err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// GET /api/v1/bff/my-page/solve
func GetSolveController(w http.ResponseWriter, r *http.Request) {
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

	parts := strings.Split(cookie.Value, "%3A")
	userIdFromCookie := parts[0]

	// trim the leading space
	userIdFromCookie = strings.TrimSpace(userIdFromCookie)

	resp, err := service.GetPlayLogService(userIdFromCookie)
	if err != nil {
		http.Error(w, "Error calling GetSolveService", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Response to client
	_, err = io.Copy(w, resp.Body)
	if err != nil {
		http.Error(w, "Error copying response body", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// POST /api/v1/bff/my-page/daily
func PostDailyController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// get token from cookie named 'refresh'
	cookie, err := r.Cookie("refresh")
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(cookie.Value, "%3A")
	userId := parts[0]

	// trim the leading space
	userId = strings.TrimSpace(userId)

	userIdInt, err := strconv.Atoi(userId)
	if err != nil {
		http.Error(w, "Invalid userId", http.StatusBadRequest)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	var data map[string]interface{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Error parsing request body", http.StatusInternalServerError)
		return
	}

	quizId, ok := data["quizId"]
	if !ok {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	quizIdFloat, ok := quizId.(float64)
	if !ok {
		http.Error(w, "Invalid quizId", http.StatusBadRequest)
		return
	}

	resp, err := service.PostDailyService(userIdInt, int(quizIdFloat))
	if err != nil {
		http.Error(w, "Error calling PostDailyService", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Response to client
	_, err = io.Copy(w, resp.Body)
	if err != nil {
		http.Error(w, "Error copying response body", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
