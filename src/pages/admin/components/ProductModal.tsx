// src/pages/admin/components/ProductModal.tsx
import React from 'react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  productData: any;
  setProductData: any;
}

const ProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  productData,
  setProductData,
}: ProductModalProps) => {
  // 닫혀있으면 아예 렌더링 안 함
  if (!isOpen) return null;

  return (
    // 1. 전체 배경: 화면을 꽉 채우고 반투명 검정색으로 뒤를 덮음 (Dimmer)
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* 2. 바깥 어두운 영역 클릭 시 닫히게 하고 싶다면 이 div 추가 (선택) */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* 3. 모달 실제 박스: 흰색 배경 + 그림자 + 둥근 모서리 */}
      <div className="relative bg-white w-full max-w-md mx-4 p-8 rounded-2xl shadow-2xl transform transition-all">
        {/* 헤더 부분 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            &times;
          </button>
        </div>

        {/* 폼 부분 */}
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">상품명</label>
            <input
              type="text"
              placeholder="상품 이름을 입력하세요"
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">가격 (원)</label>
            <input
              type="number"
              placeholder="0"
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              value={productData.price}
              onChange={(e) => setProductData({ ...productData, price: Number(e.target.value) })}
              required
            />
          </div>

          {/* 하단 버튼 영역 */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-medium transition"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition"
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
