package model

type InitResponseToClient struct {
	Data InitToClient `json:"data"`
	Msg  string       `json:"msg"`
}

type InitToClient struct {
	WeekProgress  string `json:"weekProgress"`
	DailyProgress int    `json:"dailyProgress"`
	Gem           int    `json:"gem"`
	Rank          int    `json:"rank"`
	LeagueId      int    `json:"leagueId"`
}
