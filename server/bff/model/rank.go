package model

type LeagueInfoResponseToClient struct {
	Data LeagueInfoResponseToClientData `json:"data"`
	Msg  string                         `json:"msg"`
}

type LeagueInfoResponseToClientData struct {
	LeagueInfo    LeagueInfo             `json:"leagueInfo"`
	LeagueMembers []LeagueMemberToClient `json:"leagueMembers"`
}

type LeagueMemberToClient struct {
	UserId   int    `json:"userId"`
	UserName string `json:"userName"`
	UserXP   int    `json:"userXP"`
	Order    int    `json:"order"`
}

type LeaderBoardResponseToClient struct {
	Data      LeaderBoardResponseToClientData `json:"data"`
	Message   string                          `json:"message"`
	TimeStamp string                          `json:"timestamp"`
}

type LeaderBoardResponseToClientData struct {
	ThisWeek WeekData `json:"thisWeek"`
	LastWeek WeekData `json:"lastWeek"`
}

type WeekData struct {
	MyLeaderBoard       LeaderBoardDataToClient   `json:"myLeaderBoard"`
	ThisWeekLeaderBoard []LeaderBoardDataToClient `json:"thisWeekLeaderBoard"`
}

type LeaderBoardDataToClient struct {
	LeaderBoardType int    `json:"leaderBoardType"`
	UserId          int    `json:"userId"`
	UserNickname    string `json:"userNickname"`
	GainXp          int    `json:"gainXp"`
	UserRank        int    `json:"userRank"`
	Order           int    `json:"order"`
}

////////////////////////////////////////

type LeagueInfoResponseFromMSA struct {
	Data LeagueInfoResponseFromMSAData `json:"data"`
	Msg  string                        `json:"msg"`
}

type LeagueInfoResponseFromMSAData struct {
	LeagueInfo    LeagueInfo     `json:"leagueInfo"`
	LeagueMembers []LeagueMember `json:"leagueMembers"`
}

type LeagueInfo struct {
	LeagueId   string `json:"leagueId"`
	CreatedAt  string `json:"createdAt"`
	LeagueRank int    `json:"leagueRank"`
	LeagueNum  int    `json:"leagueNum"`
}

type LeagueMember struct {
	UserId int `json:"userId"`
	UserXP int `json:"userXP"`
	Order  int `json:"order"`
}

type RankInfoResponseFromMSA struct {
	Data    RankInfoFromMSA `json:"data"`
	Message string          `json:"message"`
}

type RankInfoFromMSA struct {
	UserId   int `json:"userId"`
	Rank     int `json:"rank"`
	LeagueId int `json:"leagueId"`
}

type LeaderBoardResponseFromMSA struct {
	Data      LeaderBoardResponseFromMSAData `json:"data"`
	Message   string                         `json:"message"`
	TimeStamp string                         `json:"timestamp"`
}

type LeaderBoardResponseFromMSAData struct {
	MyLeaderBoard LeaderBoardDataFromMSA   `json:"myLeaderBoard"`
	LeaderBoard   []LeaderBoardDataFromMSA `json:"leaderBoard"`
}

type LeaderBoardDataFromMSA struct {
	LeaderBoardType int `json:"leaderBoardType"`
	UserId          int `json:"userId"`
	GainXp          int `json:"gainXp"`
	UserRank        int `json:"userRank"`
	Order           int `json:"order"`
}
