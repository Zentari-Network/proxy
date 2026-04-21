package api

import "proxy/utils/config"

func NewAPI(config config.Config) API {
	return API{
		Config: config,
	}
}
