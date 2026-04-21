export interface CheckRequest {
  ip: string;
}

export interface CheckResponse {
  allowed: boolean;
  message: string;
}
