package proxy

import (
	"errors"
	"fmt"
	api "proxy/utils/API"
	"proxy/utils/config"
	"strings"
	"sync"

	"github.com/google/uuid"
	"github.com/sandertv/gophertunnel/minecraft"
	"github.com/sandertv/gophertunnel/minecraft/protocol/login"
)

func NewProxy(config config.Config, api api.API) Proxy {
	return Proxy{
		Config: config,
		API:    api,
	}
}

func (p *Proxy) Init() {
	if err := p.SetupListener(); err != nil {
		panic(err)
	} else {
		fmt.Println("Listener online!")
	}

	go p.DownloadResourcePacks()
	p.Start()
}
func (p *Proxy) Start() {
	fmt.Println("Listening for connections...")

	for {
		conn, err := p.Listener.Accept()

		if err != nil {
			continue
		}

		go p.HandleConnection(conn.(*minecraft.Conn))
	}
}
func (p *Proxy) HandleConnection(conn *minecraft.Conn) {
	fmt.Printf("Incoming connection: %v\n", conn.IdentityData().DisplayName)

	if !p.PacksDownloaded {
		fmt.Printf("%v was disconnected: RPs are still being downloaded.\n", conn.IdentityData().DisplayName)

		p.Listener.Disconnect(conn, "Proxy is still downloading resource packs! Try joining again soon.")
		return
	}

	check, err := p.API.Check(api.CheckRequest{
		IP:       strings.Split(conn.RemoteAddr().String(), ":")[0],
		Username: conn.IdentityData().DisplayName,
		XUID:     conn.IdentityData().XUID,
	})

	if err != nil {
		fmt.Println(fmt.Sprintf("Failed to check %v:", conn.IdentityData().DisplayName), err)

		p.Listener.Disconnect(conn, "API failed to check you!")
		return
	}
	if !check.Allowed {
		fmt.Printf("%v was disconnected: %v\n", conn.IdentityData().DisplayName, check.Message)

		p.Listener.Disconnect(conn, check.Message)
		return
	} else {
		fmt.Printf("%v passed checks!\n", conn.IdentityData().DisplayName)
	}

	identityData := conn.IdentityData()
	clientData := conn.ClientData()

	clientData.SelfSignedID = identityData.XUID

	serverConn, err := minecraft.Dialer{
		IdentityData: identityData,
		ClientData:   clientData,
		DownloadResourcePack: func(id uuid.UUID, version string, current, total int) bool {
			return false
		},
	}.Dial("raknet", p.Config.ExternalHost)

	if err != nil {
		fmt.Printf("%v was disconnected: %v\n", conn.IdentityData().DisplayName, err)

		p.Listener.Disconnect(conn, "Failed to connect to server!")
		return
	}

	defer serverConn.Close()
	defer p.Listener.Disconnect(conn, "Internal Error!")

	group := sync.WaitGroup{}
	passed := true

	group.Add(2)

	go func() {
		if err := conn.StartGame(serverConn.GameData()); err != nil {
			passed = false
		}

		group.Done()
	}()
	go func() {
		err := serverConn.DoSpawn()

		if err != nil {
			passed = false
		}

		group.Done()
	}()

	group.Wait()

	if !passed {
		return
	}

	go func() {
		for {
			pk, err := conn.ReadPacket()

			if err != nil {
				return
			}
			if err := serverConn.WritePacket(pk); err != nil {
				var disc minecraft.DisconnectError

				if ok := errors.As(err, &disc); ok {
					_ = p.Listener.Disconnect(conn, disc.Error())
				}

				return
			}
		}
	}()

	for {
		pk, err := serverConn.ReadPacket()

		if err != nil {
			var disc minecraft.DisconnectError

			if ok := errors.As(err, &disc); ok {
				fmt.Printf("%v was disconnected: %v\n", conn.IdentityData().DisplayName, disc.Error())

				_ = p.Listener.Disconnect(conn, disc.Error())
			}

			return
		}
		if err := conn.WritePacket(pk); err != nil {
			return
		}
	}
}
func (p *Proxy) DownloadResourcePacks() {
	fmt.Println("Downloading resource packs...")

	clientData := login.ClientData{
		ThirdPartyName: "RP Downloader",
		SelfSignedID:   "RP Downloader",
	}
	identityData := login.IdentityData{
		DisplayName: "RP Downloader",
	}
	conn, err := minecraft.Dialer{
		ClientData:   clientData,
		IdentityData: identityData,
		DownloadResourcePack: func(id uuid.UUID, version string, current, total int) bool {
			return true
		},
	}.Dial("raknet", p.Config.ExternalHost)

	if err != nil {
		panic(err)
	}

	defer conn.Close()

	conn.DoSpawn()

	for _, pack := range conn.ResourcePacks() {
		p.Listener.AddResourcePack(pack)

		fmt.Printf("Added resource pack: %v\n", pack.Name())
	}

	p.PacksDownloaded = true

	fmt.Println("Resource packs downloaded!")
}
func (p *Proxy) SetupListener() error {
	var err error

	p.Listener, err = minecraft.ListenConfig{
		AllowUnknownPackets:  true,
		AllowInvalidPackets:  true,
		TexturePacksRequired: true,
	}.Listen("raknet", p.Config.InternalHost)

	return err
}
