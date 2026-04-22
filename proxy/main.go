package main

import (
	"fmt"
	"os"
	"os/signal"
	"proxy/proxy"
	api "proxy/utils/API"
	"proxy/utils/config"
	"syscall"
	"time"
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

	go proxy.Init()

	c := make(chan os.Signal, 1)
	signal.Notify(c, syscall.SIGTERM, os.Interrupt)

	<-c

	fmt.Println("Shutting down...")

	for _, conn := range proxy.Players {
		proxy.Listener.Disconnect(conn, "Proxy is shutting down!")
	}

	time.Sleep(time.Second)

	os.Exit(0)
}
