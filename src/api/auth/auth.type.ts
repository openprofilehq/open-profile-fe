export type LoginRequest = {
  email: string;
  password: string;
};

// TODO: Add the correct response type
export type LoginResponse = {
  token: string;
};

export type SignupRequest = {
  email: string;
  password: string;
  fullName: string;
};

// TODO: Add the correct response type
export type SignupResponse = {
  token: string;
};

// TODO: Add the correct response type
export type User = {
  id: string;
};
