package proxy

import (
	api "proxy/utils/API"
	"proxy/utils/config"

	"github.com/sandertv/gophertunnel/minecraft"
)

type Proxy struct {
	Listener        *minecraft.Listener
	API             api.API
	Config          config.Config
	PacksDownloaded bool
}
