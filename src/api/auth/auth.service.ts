import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  User,
} from "@/api/auth/auth.type";
import { ApiOptions, callApi } from "@/api/base";

export function login(data: LoginRequest) {
  return callApi<LoginResponse>({
    url: "/auth/login",
    method: "POST",
    data,
  });
}

export function signup(data: SignupRequest) {
  return callApi<SignupResponse>({
    url: "/auth/signup",
    method: "POST",
    data,
  });
}

export function getCurrentUser({ signal }: ApiOptions) {
  return callApi<User>({
    url: "/auth/me",
    method: "GET",
    signal,
  });
}
