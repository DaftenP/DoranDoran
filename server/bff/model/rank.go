package model

type LeagueInfoResponseToClient struct {
	Data LeagueInfoResponseToClientData `json:"data"`
	Msg  string                         `json:"msg"`
}

type LeagueInfoResponseToClientData struct {
	LeagueInfo    LeagueInfoToClient     `json:"leagueInfo"`
	LeagueMembers []LeagueMemberToClient `json:"leagueMembers"`
}

type LeagueInfoToClient struct {
	LeagueId   string `json:"leagueId"`
	CreatedAt  string `json:"createdAt"`
	LeagueRank int    `json:"leagueRank"`
	LeagueNum  int    `json:"leagueNum"`
}

type LeagueMemberToClient struct {
	UserId   int    `json:"userId"`
	UserName string `json:"userName"`
	UserXP   int    `json:"userXP"`
	Order    int    `json:"order"`
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
	UserId   string `json:"userId"`
	Rank     int    `json:"rank"`
	LeagueId string `json:"leagueId"`
}
