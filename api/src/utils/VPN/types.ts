export interface VPN {
  ip: string;
  vpn: boolean;
  asn: string;
  aso: string;
  city: string;
  region: string;
  whitelisted: boolean;
  created_at: string;
}

export interface VPNAPISuccess {
  ip: string;
  security: {
    vpn: boolean;
    proxy: boolean;
    tor: boolean;
    relay: boolean;
  };
  location: {
    city: string;
    region: string;
    country: string;
    continent: string;
    region_code: string;
    country_code: string;
    continent_code: string;
    latitude: string;
    longitude: string;
    time_zone: string;
    locale_code: string;
    metro_code: string;
    is_in_european_union: boolean;
  };
  network: {
    network: string;
    autonomous_system_number: string;
    autonomous_system_organization: string;
  };
}
export interface VPNAPIError {
  message: string;
}

export type VPNAPIResponse = VPNAPISuccess | VPNAPIError;
