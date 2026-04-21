package api

import (
	"bytes"
	"encoding/json"
	"net/http"
)

type CheckRequest struct {
	IP       string `json:"ip"`
	Username string `json:"username"`
	XUID     string `json:"xuid"`
}

type CheckResponse struct {
	Allowed bool   `json:"allowed"`
	Message string `json:"message"`
}

func (a API) Check(payload CheckRequest) (CheckResponse, error) {
	jsonData, err := json.Marshal(payload)

	if err != nil {
		return CheckResponse{}, err
	}

	response, err := http.Post(a.Config.APIEndpoint+"/checker", "application/json", bytes.NewBuffer(jsonData))

	if err != nil {
		return CheckResponse{}, err
	}

	defer response.Body.Close()

	var checkResponse CheckResponse
	err = json.NewDecoder(response.Body).Decode(&checkResponse)

	return checkResponse, err
}
