import { createBrowserRouter, Navigate } from 'react-router-dom';

import ContentLayout from '@/layouts/ContentLayout';
import ResourcesPage from '@/pages/ResourcesPage';
import MyReservationsPage from '@/pages/admin/AdminOrderPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminOrderPage from '@/pages/admin/AdminOrderPage';

import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';

// 로그인 여부 체크 (지금은 mock)
const isAuthed = () => !!sessionStorage.getItem('accessToken');

export const router = createBrowserRouter([
  // ✅ 1. 최초 진입(/) → 로그인 여부에 따라 분기
  {
    path: '/',
    element: isAuthed() ? <Navigate to="/resources" replace /> : <Navigate to="/login" replace />,
  },

  // ✅ 2. 로그인 / 회원가입 (로그인 전 영역)
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },

  // ✅ 3. 로그인 후 영역 (기존 ContentLayout 그대로 사용)
  {
    element: <ContentLayout />,
    children: [
      {
        path: '/resources',
        element: <ResourcesPage />,
      },
      {
        path: '/my-reservations',
        element: <MyReservationsPage />,
      },
      {
        path: '/admin',
        element: <AdminDashboardPage />,
      },
      {
        path: '/admin/products',
        element: <AdminProductsPage />,
      },
      {
        path: '/admin/order',
        element: <AdminOrderPage />,
      },
    ],
  },

  // ✅ 4. 없는 경로 → 로그인으로
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
