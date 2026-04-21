import type { Table } from "./types";

const DatabaseConstants = {
  Tables: [
    {
      name: "vpns",
      columns: [
        "ip VARCHAR(15) NOT NULL PRIMARY KEY",
        "vpn BOOLEAN NOT NULL",
        "asn VARCHAR(64) NOT NULL",
        "aso VARCHAR(64) NOT NULL",
        "city VARCHAR(64) NOT NULL",
        "region VARCHAR(64) NOT NULL",
        "whitelisted BOOLEAN DEFAULT false NOT NULL",
        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL",

        "INDEX idx_vpns_ip (ip)",
      ],
    },
    {
      name: "profiles",
      columns: [
        "xuid VARCHAR(32) NOT NULL PRIMARY KEY",
        "username VARCHAR(32) NOT NULL",
        "ip VARCHAR(15) NOT NULL",
        "whitelisted BOOLEAN DEFAULT false NOT NULL",
        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL",

        "INDEX idx_profiles_xuid (xuid)",
        "INDEX idx_profiles_ip (ip)",
      ],
    },
  ] as Table[],
  BannedASNs: [] as string[], // Use this is someone is just rotating they're IP to get around alt detection.
};

export default DatabaseConstants;
