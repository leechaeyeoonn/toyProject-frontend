import { http, HttpResponse } from 'msw';
// dashboardData 대신 실제 export 된 변수 이름들을 중괄호 { } 안에 써주세요.
import * as dashboardData from './data/dashboardData';

type LoginRequest = {
  email: string;
  password: string;
};

const ACCESS_TOKEN = 'mock.jwt.access.token';
const TEST_USER = {
  id: 1,
  name: 'Test User',
  email: 'test@nflux.com',
};

function getBearerToken(authHeader: string | null) {
  if (!authHeader) return null;
  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) return null;
  return token;
}

export const handlers = [
  // 로그인
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequest;

    if (body.email === 'test@nflux.com' && body.password === '1234') {
      return HttpResponse.json(
        {
          accessToken: ACCESS_TOKEN,
          expiresIn: 3600,
          user: TEST_USER,
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      { message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
      { status: 401 },
    );
  }),

  // 내 정보 (토큰 있으면 OK, 없으면 401)
  http.get('/api/auth/me', ({ request }) => {
    const token = getBearerToken(request.headers.get('authorization'));
    if (token !== ACCESS_TOKEN) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json({ user: TEST_USER }, { status: 200 });
  }),

  // 이제 dashboardData.mockSummary 처럼 접근할 수 있습니다.
  http.get('/api/admin/dashboard', () => {
    return HttpResponse.json({
      summary: dashboardData.mockSummary,
      salesChart: dashboardData.mockSalesChart,
      categoryData: dashboardData.mockCategoryData,
    });
  }),
];
