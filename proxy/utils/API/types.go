package api

import "proxy/utils/config"

type API struct {
	Config config.Config
}

type MessageResponse struct {
	Message string `json:"message"`
}
