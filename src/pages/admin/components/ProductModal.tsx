// src/pages/admin/components/ProductModal.tsx
import React from 'react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  productData: any;
  setProductData: (data: any) => void;
}

const ProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  productData,
  setProductData,
}: ProductModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-auto max-w-lg shadow-xl overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* 상품명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상품명</label>
            <input
              type="text"
              required
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 카테고리 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
              <select
                className="w-full border rounded-lg p-2.5 outline-none"
                value={productData.category}
                onChange={(e) => setProductData({ ...productData, category: e.target.value })}
              >
                <option value="전자기기">전자기기</option>
                <option value="의류">의류</option>
                <option value="식품">식품</option>
                <option value="기타">기타</option>
              </select>
            </div>
            {/* 상태 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">판매 상태</label>
              <select
                className="w-full border rounded-lg p-2.5 outline-none"
                value={productData.status}
                onChange={(e) => setProductData({ ...productData, status: e.target.value })}
              >
                <option value="판매중">판매중</option>
                <option value="품절">품절</option>
                <option value="숨김">숨김</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 가격 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
              <input
                type="number"
                required
                className="w-full border rounded-lg p-2.5 outline-none"
                value={productData.price}
                onChange={(e) => setProductData({ ...productData, price: Number(e.target.value) })}
              />
            </div>
            {/* 재고 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">재고</label>
              <input
                type="number"
                required
                className="w-full border rounded-lg p-2.5 outline-none"
                value={productData.stock}
                onChange={(e) => setProductData({ ...productData, stock: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
