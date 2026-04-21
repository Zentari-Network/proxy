import type { Table } from "./types";

const DatabaseConstants = {
  Tables: [
    {
      name: "vpns",
      columns: [
        "ip VARCHAR(15) NOT NULL PRIMARY KEY",
        "vpn BOOLEAN NOT NULL",
        "whitelisted BOOLEAN DEFAULT false NOT NULL",
        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL",

        "INDEX idx_vpns_ip (ip)",
      ],
    },
  ] as Table[],
};

export default DatabaseConstants;
