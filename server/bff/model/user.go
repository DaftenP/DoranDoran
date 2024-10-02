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

type PatchResponseToClient struct {
	Data      string `json:"data"`
	Message   string `json:"message"`
	TimeStamp string `json:"timestamp"`
}

////////////////////////////////////////

type UserInfoResponseFromMSA struct {
	Data      UserInfoFromMSA `json:"data"`
	Message   string          `json:"message"`
	TimeStamp string          `json:"timestamp"`
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

type UserNamesFromMSA struct {
	Data      map[string]string `json:"data"`
	Message   string            `json:"message"`
	TimeStamp string            `json:"timestamp"`
}
