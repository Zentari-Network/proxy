export interface Profile {
  xuid: string;
  username: string;
  ip: string;
  whitelisted: boolean;
  created_at: string;
}

export interface CheckRequest {
  ip: string;
  username: string;
  xuid: string;
}

export interface CheckResponse {
  allowed: boolean;
  message: string;
}
