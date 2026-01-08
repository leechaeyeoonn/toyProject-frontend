import React from 'react';
import { useCart, type CartItem } from '../../hooks/useCart';
import DataTable, { type Column } from '../../components/common/DataTable';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, addToCart, clearCart } = useCart();

  // 장바구니 전용 컬럼 설계
  const columns: Column<CartItem>[] = [
    { header: '상품명', key: 'name' },
    {
      header: '가격',
      key: 'price',
      render: (val) => `${val.toLocaleString()}원`,
    },
    {
      header: '수량',
      key: 'quantity',
      render: (val, item) => (
        <div className="flex items-center gap-2">
          {/* 수량 조절 버튼 (로직은 단순화를 위해 addToCart 재사용 가능) */}
          <span className="font-bold w-8 text-center">{val}개</span>
        </div>
      ),
    },
    {
      header: '소계',
      key: 'id', // 합계 계산용
      render: (_, item) => `${(item.price * item.quantity).toLocaleString()}원`,
    },
    {
      header: '삭제',
      key: 'actions',
      render: (_, item) => (
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
        >
          <Trash2 size={18} />
        </button>
      ),
    },
  ];

  // 총 결제 금액 계산
  const totalPrice = cartItems.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🛒 내 장바구니</h1>
        <button onClick={clearCart} className="text-sm text-gray-500 underline">
          전체 비우기
        </button>
      </div>

      <DataTable columns={columns} data={cartItems} />

      {cartItems.length > 0 && (
        <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200 text-right">
          <span className="text-gray-600 mr-4">총 결제 예상 금액</span>
          <span className="text-3xl font-bold text-indigo-600">
            {totalPrice.toLocaleString()}원
          </span>
          <button className="block w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">
            주문하기
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
