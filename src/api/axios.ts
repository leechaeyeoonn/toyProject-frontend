// src/api/axios.ts
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

const API_BASE_URL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL ?? '/api');

/**
 * 프론트에서 공통으로 쓰는 표준 에러 형태
 */
export type ApiError = {
  status: number;
  message: string;
  data?: unknown;
};

/**
 * ✅ 토큰 저장/사용 방식은 백엔드 정책에 따라 달라짐
 * - httpOnly cookie(세션/JWT 쿠키)면 프론트가 토큰을 못 읽음 → Authorization 안 붙이고 withCredentials만 켜서 쿠키 자동 전송
 * - localStorage 토큰 방식이면 아래처럼 Authorization 헤더에 붙임
 */
function getAccessToken(): string | null {
  return window.sessionStorage.getItem('accessToken');
}

/**
 * axios 에러/기타 에러를 ApiError로 표준화
 */
function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const e = error as AxiosError<unknown>;
    const status = e.response?.status ?? 0;

    // 서버 에러 메시지 키가 프로젝트마다 달라서 여러 케이스를 흡수
    const dataAny = e.response?.data as any;

    const message =
      dataAny?.message ||
      dataAny?.resultMessage ||
      dataAny?.error?.message ||
      e.message ||
      '요청 중 오류가 발생했습니다.';

    return { status, message, data: e.response?.data };
  }

  return {
    status: 0,
    message: '알 수 없는 오류가 발생했습니다.',
    data: error,
  };
}

/**
 * 프로젝트 전용 axios 인스턴스
 * - baseURL: 공통 prefix
 * - timeout: 기본 타임아웃
 * - withCredentials: 쿠키 인증 확정되면 true로 변경(기본은 false 권장)
 */
export const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20_000,
  withCredentials: false, // ✅ 쿠키 기반 인증이면 true로
  headers: {
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor
 * - 토큰(Authorization) 자동 부착
 * - JSON Content-Type 기본값 처리(단, FormData/GET는 제외)
 */
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1) Authorization 토큰 방식이면 사용
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2) Content-Type: JSON 기본값
    // - GET은 Content-Type 굳이 안 넣음
    // - FormData는 axios가 boundary 포함해서 자동 세팅하도록 건드리지 않음
    const isFormData = config.data instanceof FormData;
    const method = (config.method ?? 'get').toLowerCase();

    if (!isFormData && method !== 'get' && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json; charset=utf-8';
    }

    return config;
  },
  (error) => Promise.reject(toApiError(error)),
);

/**
 * Response Interceptor
 * - 성공: res.data만 반환해서 api 함수/컴포넌트 코드를 단순화
 * - 실패: ApiError로 표준화해서 reject
 */
http.interceptors.response.use(
  (res: AxiosResponse) => res.data,
  async (error: unknown) => {
    const apiError = toApiError(error);

    // ✅ 공통 처리 최소 예시
    // - 401이면 로그아웃 처리 / 로그인 이동 등은 프로젝트 정책 정해지면 여기서 처리
    if (apiError.status === 401) {
    }

    return Promise.reject(apiError);
  },
);
