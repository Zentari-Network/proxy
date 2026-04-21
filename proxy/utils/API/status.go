package api

import (
	"encoding/json"
	"net/http"
)

func (a API) Status() (MessageResponse, error) {

	res, err := http.Get(a.Config.APIEndpoint + "/status")

	if err != nil || res.StatusCode != http.StatusOK {
		return MessageResponse{}, err
	}

	defer res.Body.Close()

	var messageResponse MessageResponse
	err = json.NewDecoder(res.Body).Decode(&messageResponse)

	return messageResponse, err
}
