package service

import "net/http"

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
