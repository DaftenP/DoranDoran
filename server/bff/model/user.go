package model

type UserRegistRequestFromClient struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Nickname string `json:"nickname"`
}

type UserRegistResponseFromMSA struct {
	Data      int    `json:"data"`
	Message   string `json:"message"`
	TimeStamp string `json:"timestamp"`
}

type UserInfoResponseToClient struct {
	Data      *UserInfoToClient `json:"data"`
	Message   string            `json:"message"`
	TimeStamp string            `json:"timestamp"`
}

type UserInfoToClient struct {
	Nickname    string `json:"nickname"`
	Email       string `json:"email"`
	Xp          int    `json:"xp"`
	Color       int    `json:"color"`
	Equipment   int    `json:"equipment"`
	Background  int    `json:"background"`
	Gem         int    `json:"gem"`
	DailyStatus int    `json:"dailyStatus"`
	Status      string `json:"status"`
	Birthday    string `json:"birthday"`
	Psize       int    `json:"psize"`
	Rank        int    `json:"rank"`
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
	Nickname    string `json:"nickname"`
	Email       string `json:"email"`
	Xp          int    `json:"xp"`
	Color       int    `json:"color"`
	Equipment   int    `json:"equipment"`
	Background  int    `json:"background"`
	Gem         int    `json:"gem"`
	DailyStatus int    `json:"dailyStatus"`
	Status      string `json:"status"`
	Birthday    string `json:"birthday"`
	Psize       int    `json:"psize"`
}

type UserNamesFromMSA struct {
	Data      map[string]string `json:"data"`
	Message   string            `json:"message"`
	TimeStamp string            `json:"timestamp"`
}

type DeleteResponseFromMSA struct {
	Data string `json:"data"`
	Msg  string `json:"msg"`
}
