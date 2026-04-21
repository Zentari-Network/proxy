package main

import (
	"fmt"
	"proxy/proxy"
	api "proxy/utils/API"
	"proxy/utils/config"
)

func main() {
	config, err := config.NewConfig()

	if err != nil {
		panic(err)
	} else {
		fmt.Println("Config loaded!")
	}

	api := api.NewAPI(config)

	if _, err := api.Status(); err != nil {
		panic(err)
	} else {
		fmt.Println("API online!")
	}

	proxy := proxy.NewProxy(config, api)

	proxy.Init()
}
