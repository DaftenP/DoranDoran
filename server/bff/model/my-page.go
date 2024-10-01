package model

type UserInfoResponseToClient struct {
	Data      *UserInfoToClient `json:"data"`
	Message   string            `json:"message"`
	TimeStamp string            `json:"timestamp"`
}

type UserInfoToClient struct {
	Nickname  string `json:"nickname"`
	Email     string `json:"email"`
	Xp        int    `json:"xp"`
	Character string `json:"character"`
	Avatar    string `json:"avatar"`
	Voice     string `json:"voice"`
	Gem       int    `json:"gem"`
	Rank      int    `json:"rank"`
}

type UserInfoResponseFromMSA struct {
	Data      *UserInfoFromMSA `json:"data"`
	Message   string           `json:"message"`
	TimeStamp string           `json:"timestamp"`
}

type UserInfoFromMSA struct {
	Nickname  string `json:"nickname"`
	Email     string `json:"email"`
	Xp        int    `json:"xp"`
	Character string `json:"character"`
	Avatar    string `json:"avatar"`
	Voice     string `json:"voice"`
	Gem       int    `json:"gem"`
}

type RankInfoResponseFromMSA struct {
	Data    *RankInfoFromMSA `json:"data"`
	Message string           `json:"message"`
}

type RankInfoFromMSA struct {
	UserId   string `json:"userId"`
	Rank     int    `json:"rank"`
	LeagueId string `json:"leagueId"`
}
