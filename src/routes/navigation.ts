export type NavMenuItem = {
  label: string;
  to: string;
};

export type NavSection = {
  title: string;
  items: NavMenuItem[];
};

export const navigation: NavSection[] = [
  {
    title: '관리자',
    items: [
      { label: '관리자 대시보드', to: '/admin' },
      { label: '상품 관리', to: '/admin/products' },
      { label: '거래 내역 관리', to: '/admin/order' },
    ],
  },
];
