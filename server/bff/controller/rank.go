package controller

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	"com.doran.bff/model"
	"com.doran.bff/service"
	"com.doran.bff/util"
)

// GET /api/v1/bff/rank/league
func GetLeagueRank(w http.ResponseWriter, r *http.Request) {
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
	userId := parts[0]

	var leagueInfoResponseFromMSA model.LeagueInfoResponseFromMSA

	// forward request to rank service
	resp, err := service.GetLeagueRankService(userId)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Decode response
	if err := json.NewDecoder(resp.Body).Decode(&leagueInfoResponseFromMSA); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	var userIds []int
	for _, member := range leagueInfoResponseFromMSA.Data.LeagueMembers {
		userIds = append(userIds, member.UserId)
	}

	var userIDsFromMSA model.UserNamesFromMSA

	// forward request to user service
	resp, err = service.GetUserNameByUserIDService(userIds)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Decode response
	if err := json.NewDecoder(resp.Body).Decode(&userIDsFromMSA); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	var leagueInfoResponseToClient model.LeagueInfoResponseToClient
	leagueInfoResponseToClient.Data.LeagueInfo = leagueInfoResponseFromMSA.Data.LeagueInfo
	leagueInfoResponseToClient.Data.LeagueMembers = make([]model.LeagueMemberToClient, 0)

	for _, member := range leagueInfoResponseFromMSA.Data.LeagueMembers {
		leagueMember := model.LeagueMemberToClient{
			UserId:   member.UserId,
			UserName: userIDsFromMSA.Data[strconv.Itoa(member.UserId)],
			UserXP:   member.UserXP,
			Order:    member.Order,
		}
		leagueInfoResponseToClient.Data.LeagueMembers = append(leagueInfoResponseToClient.Data.LeagueMembers, leagueMember)
	}

	// Encode response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(leagueInfoResponseToClient); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// GET /api/v1/bff/rank/leaderboard
func GetLeaderBoard(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get token from cookie named 'refresh'
	cookie, err := r.Cookie("refresh")
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(cookie.Value, "%3A")
	userId := parts[0]

	// Variables to store responses
	var thisWeekData model.ThisWeekData
	var lastWeekData model.LastWeekData

	var leaderBoardResponseFromMSAThisWeek model.ThisWeekLeaderBoardResponseFromMSA
	var leaderBoardResponseFromMSALastWeek model.LastWeekLeaderBoardResponseFromMSA

	var wg sync.WaitGroup
	wg.Add(2) // We are launching 2 goroutines

	errCh := make(chan error, 2) // Error channel for capturing errors from goroutines

	// Goroutine to fetch this week's leaderboard
	go func() {
		defer wg.Done()
		// Forward request to rank service for this week
		resp, err := service.GetLeaderboardService(0, userId)
		if err != nil {
			errCh <- err
			return
		}
		defer resp.Body.Close()

		// Decode response
		if err := json.NewDecoder(resp.Body).Decode(&leaderBoardResponseFromMSAThisWeek); err != nil {
			errCh <- err
			return
		}

		// Get user IDs from the leaderboard
		var userIds []int
		for _, member := range leaderBoardResponseFromMSAThisWeek.Data.ThisWeekLeaderBoard {
			userIds = append(userIds, member.UserId)
		}

		// Forward request to user service
		resp, err = service.GetUserNameByUserIDService(userIds)
		if err != nil {
			errCh <- err
			return
		}
		defer resp.Body.Close()

		// Decode response for usernames
		var userIDsFromMSA model.UserNamesFromMSA
		if err := json.NewDecoder(resp.Body).Decode(&userIDsFromMSA); err != nil {
			errCh <- err
			return
		}

		// Populate thisWeekData
		thisWeekData = model.ThisWeekData{
			MyLeaderBoard: model.LeaderBoardDataToClient{
				LeaderBoardType: leaderBoardResponseFromMSAThisWeek.Data.MyLeaderBoard.LeaderBoardType,
				UserId:          leaderBoardResponseFromMSAThisWeek.Data.MyLeaderBoard.UserId,
				UserNickname:    userIDsFromMSA.Data[strconv.Itoa(leaderBoardResponseFromMSAThisWeek.Data.MyLeaderBoard.UserId)],
				GainXp:          leaderBoardResponseFromMSAThisWeek.Data.MyLeaderBoard.GainXp,
				UserRank:        leaderBoardResponseFromMSAThisWeek.Data.MyLeaderBoard.UserRank,
				Order:           leaderBoardResponseFromMSAThisWeek.Data.MyLeaderBoard.Order,
			},
			ThisWeekLeaderBoard: make([]model.LeaderBoardDataToClient, 0),
		}

		for _, member := range leaderBoardResponseFromMSAThisWeek.Data.ThisWeekLeaderBoard {
			leaderBoardData := model.LeaderBoardDataToClient{
				LeaderBoardType: member.LeaderBoardType,
				UserId:          member.UserId,
				UserNickname:    userIDsFromMSA.Data[strconv.Itoa(member.UserId)],
				GainXp:          member.GainXp,
				UserRank:        member.UserRank,
				Order:           member.Order,
			}
			thisWeekData.ThisWeekLeaderBoard = append(thisWeekData.ThisWeekLeaderBoard, leaderBoardData)
		}
		errCh <- nil
	}()

	// Goroutine to fetch last week's leaderboard
	go func() {
		defer wg.Done()
		// Forward request to rank service for last week
		resp, err := service.GetLeaderboardService(1, userId)
		if err != nil {
			errCh <- err
			return
		}
		defer resp.Body.Close()

		// Decode response
		if err := json.NewDecoder(resp.Body).Decode(&leaderBoardResponseFromMSALastWeek); err != nil {
			errCh <- err
			return
		}

		// Get user IDs from the leaderboard
		var userIds []int
		for _, member := range leaderBoardResponseFromMSALastWeek.Data.LastWeekLeaderBoard {
			userIds = append(userIds, member.UserId)
		}

		// Forward request to user service
		resp, err = service.GetUserNameByUserIDService(userIds)
		if err != nil {
			errCh <- err
			return
		}
		defer resp.Body.Close()

		// Decode response for usernames
		var userIDsFromMSA model.UserNamesFromMSA
		if err := json.NewDecoder(resp.Body).Decode(&userIDsFromMSA); err != nil {
			errCh <- err
			return
		}

		// Populate lastWeekData
		lastWeekData = model.LastWeekData{
			MyLeaderBoard: model.LeaderBoardDataToClient{
				LeaderBoardType: leaderBoardResponseFromMSALastWeek.Data.MyLeaderBoard.LeaderBoardType,
				UserId:          leaderBoardResponseFromMSALastWeek.Data.MyLeaderBoard.UserId,
				UserNickname:    userIDsFromMSA.Data[strconv.Itoa(leaderBoardResponseFromMSALastWeek.Data.MyLeaderBoard.UserId)],
				GainXp:          leaderBoardResponseFromMSALastWeek.Data.MyLeaderBoard.GainXp,
				UserRank:        leaderBoardResponseFromMSALastWeek.Data.MyLeaderBoard.UserRank,
				Order:           leaderBoardResponseFromMSALastWeek.Data.MyLeaderBoard.Order,
			},
			LastWeekLeaderBoard: make([]model.LeaderBoardDataToClient, 0),
		}

		for _, member := range leaderBoardResponseFromMSALastWeek.Data.LastWeekLeaderBoard {
			leaderBoardData := model.LeaderBoardDataToClient{
				LeaderBoardType: member.LeaderBoardType,
				UserId:          member.UserId,
				UserNickname:    userIDsFromMSA.Data[strconv.Itoa(member.UserId)],
				GainXp:          member.GainXp,
				UserRank:        member.UserRank,
				Order:           member.Order,
			}
			lastWeekData.LastWeekLeaderBoard = append(lastWeekData.LastWeekLeaderBoard, leaderBoardData)
		}
		errCh <- nil
	}()

	// Wait for both goroutines to finish
	wg.Wait()

	// Check if any error occurred
	close(errCh)
	for err := range errCh {
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			fmt.Println(err)
			return
		}
	}

	// Prepare the final response
	leaderBoardResponseToClient := model.LeaderBoardResponseToClient{
		Data: model.LeaderBoardResponseToClientData{
			ThisWeek: thisWeekData,
			LastWeek: lastWeekData,
		},
		Message:   "Success",
		TimeStamp: time.Now().Format("2006-01-02T15:04:05.9999999"),
	}

	// Encode response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(leaderBoardResponseToClient); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// PATCH /api/v1/bff/rank/xp_gem
func UpdateXpGem(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	cookie, err := r.Cookie("refresh")
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(cookie.Value, "%3A")
	userId := parts[0]

	var userIdInt int
	userIdInt, err = strconv.Atoi(userId)

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	var data map[string]interface{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Error parsing request body", http.StatusInternalServerError)
		return
	}

	xp, ok := data["xp"]
	if !ok {
		http.Error(w, "Invalid xp", http.StatusBadRequest)
		return
	}

	gem, ok := data["gem"]
	if !ok {
		http.Error(w, "Invalid gem", http.StatusBadRequest)
		return
	}

	xpInt, ok := xp.(float64)
	if !ok {
		http.Error(w, "Invalid xp", http.StatusBadRequest)
		return
	}

	gemInt, ok := gem.(float64)
	if !ok {
		http.Error(w, "Invalid gem", http.StatusBadRequest)
		return
	}

	jsonToRank := map[string]interface{}{
		"userId": userIdInt,
		"xp":     int(xpInt),
	}

	jsonToUser := map[string]interface{}{
		"userId": userIdInt,
		"gem":    int(gemInt),
		"xp":     int(xpInt),
	}

	jsonToRankStr, err := json.Marshal(jsonToRank)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	jsonToUserStr, err := json.Marshal(jsonToUser)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// publish kafka event
	util.PublishKafkaEventAsync("topic-rank-updateXP", string(jsonToRankStr))
	util.PublishKafkaEventAsync("topic-user-updateXP", string(jsonToUserStr))

	w.WriteHeader(http.StatusOK)
}
