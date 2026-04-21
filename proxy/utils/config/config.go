package config

import (
	"fmt"
	"os"
)

func NewConfig() (Config, error) {
	externalHost, internalHost, APIEndpoint := os.Getenv("EXTERNAL_HOST"), os.Getenv("INTERNAL_HOST"), os.Getenv("API_ENDPOINT")

	if externalHost == "" || internalHost == "" || APIEndpoint == "" {
		return Config{}, fmt.Errorf("environment variables are not set!")
	}

	return Config{
		ExternalHost: externalHost,
		InternalHost: internalHost,
		APIEndpoint:  APIEndpoint,
	}, nil
}
