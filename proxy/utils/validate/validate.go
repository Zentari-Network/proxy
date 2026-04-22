package validate

import (
	"bytes"
	"fmt"
	"proxy/utils/validate/packets"

	"github.com/sandertv/gophertunnel/minecraft"
	"github.com/sandertv/gophertunnel/minecraft/protocol"
	pks "github.com/sandertv/gophertunnel/minecraft/protocol/packet"
)

func ValidateClientPacket(conn *minecraft.Conn, pk pks.Packet) (bool, string) {
	if !ValidateSize(pk) {
		fmt.Println(pk.ID())
		return false, "Invalid Packet (Check 1)"
	}

	switch p := pk.(type) {
	case *pks.Text:
		return packets.Text(conn, *p)
	}

	return true, ""
}

func ValidateSize(packet pks.Packet) bool {
	var buffer bytes.Buffer

	writer := protocol.NewWriter(&buffer, 0)

	packet.Marshal(writer)

	if buffer.Len() > 4096 {
		return false
	}

	return true
}
