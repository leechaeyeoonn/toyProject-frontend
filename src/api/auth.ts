import { http } from './axios';

export type LoginBody = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  expiresIn: number;
  user: { id: number; name: string; email: string };
};

export async function login(body: LoginBody) {
  const res = await http.post<LoginResponse>('/auth/login', body);
  return res.data;
}

export type MeResponse = {
  user: { id: number; name: string; email: string };
};

export async function me() {
  const res = await http.get<MeResponse>('/auth/me');
  return res.data;
}
