package model

type RandomItemResponseFromMSA struct {
	Data struct {
		Pool   []int `json:"pool"`
		Chosen int   `json:"chosen"`
	} `json:"data"`
	Message   string `json:"message"`
	Timestamp string `json:"timestamp"`
}

type RandomItemRequestFromClient struct {
	ItemType int `json:"itemType"`
}

type ItemInfoResponseFromMSA struct {
	Data struct {
		Id       int    `json:"id"`
		Price    int    `json:"price"`
		Name     string `json:"name"`
		ImageURL string `json:"imageURL"`
	} `json:"data"`
	Message   string `json:"message"`
	Timestamp string `json:"timestamp"`
}
