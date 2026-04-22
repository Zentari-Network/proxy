package packets

import (
	"github.com/sandertv/gophertunnel/minecraft"
	"github.com/sandertv/gophertunnel/minecraft/protocol/packet"
)

func Text(conn *minecraft.Conn, pk packet.Text) (bool, string) {
	switch {
	case pk.TextType != 1:
		return false, "Invalid Message (Check 1)"
	case pk.SourceName != conn.IdentityData().DisplayName:
		return false, "Invalid Message (Check 2)"
	case len(pk.Message) > 512 || len(pk.Message) < 1:
		return false, "Invalid Message (Check 3)"
	case pk.XUID != conn.IdentityData().XUID:
		return false, "Invalid Message (Check 4)"
	default:
		return true, ""
	}
}
