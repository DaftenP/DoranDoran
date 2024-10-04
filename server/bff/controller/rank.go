package controller

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	"com.doran.bff/model"
	"com.doran.bff/service"
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
	var thisWeekData model.WeekData
	var lastWeekData model.WeekData

	var leaderBoardResponseFromMSAThisWeek model.LeaderBoardResponseFromMSA
	var leaderBoardResponseFromMSALastWeek model.LeaderBoardResponseFromMSA

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
		for _, member := range leaderBoardResponseFromMSAThisWeek.Data.LeaderBoard {
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
		thisWeekData = model.WeekData{
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

		for _, member := range leaderBoardResponseFromMSAThisWeek.Data.LeaderBoard {
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
		for _, member := range leaderBoardResponseFromMSALastWeek.Data.LeaderBoard {
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
		lastWeekData = model.WeekData{
			MyLeaderBoard: model.LeaderBoardDataToClient{
				LeaderBoardType: leaderBoardResponseFromMSALastWeek.Data.MyLeaderBoard.LeaderBoardType,
				UserId:          leaderBoardResponseFromMSALastWeek.Data.MyLeaderBoard.UserId,
				UserNickname:    userIDsFromMSA.Data[strconv.Itoa(leaderBoardResponseFromMSALastWeek.Data.MyLeaderBoard.UserId)],
				GainXp:          leaderBoardResponseFromMSALastWeek.Data.MyLeaderBoard.GainXp,
				UserRank:        leaderBoardResponseFromMSALastWeek.Data.MyLeaderBoard.UserRank,
				Order:           leaderBoardResponseFromMSALastWeek.Data.MyLeaderBoard.Order,
			},
			ThisWeekLeaderBoard: make([]model.LeaderBoardDataToClient, 0),
		}

		for _, member := range leaderBoardResponseFromMSALastWeek.Data.LeaderBoard {
			leaderBoardData := model.LeaderBoardDataToClient{
				LeaderBoardType: member.LeaderBoardType,
				UserId:          member.UserId,
				UserNickname:    userIDsFromMSA.Data[strconv.Itoa(member.UserId)],
				GainXp:          member.GainXp,
				UserRank:        member.UserRank,
				Order:           member.Order,
			}
			lastWeekData.ThisWeekLeaderBoard = append(lastWeekData.ThisWeekLeaderBoard, leaderBoardData)
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
		return
	}

	w.WriteHeader(http.StatusOK)
}