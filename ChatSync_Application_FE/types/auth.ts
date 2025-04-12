export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ResetPasswordCredentials {
  email: string;
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  accessToken: string;
}
