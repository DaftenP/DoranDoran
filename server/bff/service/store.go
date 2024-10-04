package service

import "net/http"

var (
	StoreUrl = "http://shop.ns-shop.svc.cluster.local:8080"
)

// GET /api/v1/shop/shop/{itemType}/random
func GetRandomItem(itemType string) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodGet, StoreUrl+"/api/v1/store/shop/"+itemType+"/random", nil)
	if err != nil {
		return nil, err
	}

	return http.DefaultClient.Do(req)
}
