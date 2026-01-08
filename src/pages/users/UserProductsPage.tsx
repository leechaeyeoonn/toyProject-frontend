import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart'; // 장바구니 훅 임포트
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../../types/product';
import { useProducts } from '../../hooks/useProducts';
import { useNavigate } from 'react-router-dom'; // 1. useNavigate 가져오기
// 1. DataTable과 Column 타입을 가져옵니다.
import DataTable, { type Column } from '../../components/common/DataTable';

const ProductManagementPage = () => {
  const navigate = useNavigate(); // 🔥 이 줄이 반드시 있어야 합니다!
  const { products, isLoading } = useProducts();
  const { cartItems, addToCart } = useCart(); // 장바구니 담기 함수 가져오기

  // --- 추가된 부분: 테이블 컬럼 설계도 ---
  const columns: Column<Product>[] = [
    {
      header: '상품명',
      key: 'name',
      render: (val, item) => (
        <div>
          <div className="font-medium text-gray-900">{val}</div>
          <div className="text-xs text-gray-500">ID: {item.id}</div>
        </div>
      ),
    },
    { header: '카테고리', key: 'category' },
    {
      header: '가격',
      key: 'price',
      render: (val) => `${val.toLocaleString()}원`,
    },
    {
      header: '선택',
      key: 'actions',
      render: (_, product) => (
        <button
          onClick={() => {
            addToCart(product);
            alert('장바구니에 담겼습니다!');
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <ShoppingCart size={16} />
          담기
        </button>
      ),
    },
  ];

  if (isLoading) return <div className="p-10">상품 목록을 불러오는 중...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">상품 목록</h1>
        {/* --- 장바구니 수량 표시 영역 추가 --- */}
        <div
          onClick={() => navigate('/cart')}
          className="relative p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition"
        >
          <ShoppingCart size={24} className="text-gray-700" />

          {/* 장바구니에 아이템이 있을 때만 숫자를 보여줍니다 */}
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
              {cartItems.length}
            </span>
          )}
        </div>
        {/* ---------------------------------- */}
      </div>

      {/* 2. 기존의 복잡했던 table 태그를 DataTable 컴포넌트 하나로 교체합니다! */}
      <DataTable columns={columns} data={products} />
    </div>
  );
};

export default ProductManagementPage;
