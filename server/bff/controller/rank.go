package controller

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

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

	parts := strings.Split(cookie.Value, ":")
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

// GET /api/v1/bff/rank/total-rank
func GetTotalRank(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

}
