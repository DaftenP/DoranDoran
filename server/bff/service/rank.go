package service

import (
	"net/http"
	"strconv"
)

var (
	RankUrl = "http://rank.ns-rank.svc.cluster.local:8080"
)

// GET /api/v1/rank/info/{userId}
func GetRankInfoService(userId string) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodGet, RankUrl+"/api/v1/rank/info/"+userId, nil)
	if err != nil {
		return nil, err
	}

	return http.DefaultClient.Do(req)
}

// GET /api/v1/rank/league/{userId}
func GetLeagueRankService(userId string) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodGet, RankUrl+"/api/v1/rank/league/"+userId, nil)
	if err != nil {
		return nil, err
	}

	return http.DefaultClient.Do(req)
}

// GET /api/v1/rank/leaderboard (type int, userId string)
func GetLeaderboardService(typ int, userId string) (*http.Response, error) {
	typeStr := strconv.Itoa(typ)
	req, err := http.NewRequest(http.MethodGet, RankUrl+"/api/v1/leaderboard?type="+string(typeStr)+"&userId="+userId, nil)
	if err != nil {
		return nil, err
	}

	return http.DefaultClient.Do(req)
}

// GET /api/v1/rank/league/settlement/{userId}
func GetLeagueSettlementService(userId string) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodGet, RankUrl+"/api/v1/rank/league/settlement/"+userId, nil)
	if err != nil {
		return nil, err
	}

	return http.DefaultClient.Do(req)
}
