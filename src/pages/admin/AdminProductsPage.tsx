import React, { useEffect, useState } from 'react';
import type { Product } from '../../types/product';
import { Trash2, Edit, Plus } from 'lucide-react'; // 아이콘 라이브러리
import axios from 'axios';
import ProductModal from './components/ProductModal';

const ProductManagementPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentProduct, setCurrentProduct] = useState({ name: '', price: 0 });

  useEffect(() => {
    axios
      .get('/api/admin/productList')
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('데이터 호출 실패:', err);
      });
  }, []);

  if (isLoading) return <div className="p-10">상품 목록을 불러오는 중...</div>;

  const handleDelete = async (id: number) => {
    // 사용자에게 한 번 더 물어보는 센스!
    if (!window.confirm('정말 이 상품을 삭제하시겠습니까?')) return;

    try {
      // 1. 서버(MSW)에 삭제 요청 보내기
      const response = await fetch(`/api/admin/productList/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 2. 서버 삭제 성공 시, 내 화면(State)에서도 삭제된 항목 제외하기
        // filter를 사용해 클릭한 id가 아닌 것들만 남깁니다.
        setProducts((prev) => prev.filter((product) => product.id !== id));
        alert('삭제되었습니다.');
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
    }
  };

  const handleCreateOpen = () => {
    setModalMode('create');
    setCurrentProduct({ name: '', price: 0 }); // 초기화
    setIsModalOpen(true);
  };
  const handleEditOpen = (product: any) => {
    setModalMode('edit');
    setCurrentProduct(product); // 기존 데이터 채우기
    setIsModalOpen(true);
  };

  // 저장 로직 (등록/수정 공통)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'create') {
      // axios.post 로직 실행
    } else {
      // axios.patch 로직 실행
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <button
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          onClick={() => handleCreateOpen()}
        >
          <Plus size={20} />
          상품 등록
        </button>
      </div>

      {/* 2. 상품 그리드(테이블) 영역 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">상품명</th>
              <th className="px-6 py-4 font-semibold text-gray-700">카테고리</th>
              <th className="px-6 py-4 font-semibold text-gray-700">가격</th>
              <th className="px-6 py-4 font-semibold text-gray-700">재고</th>
              <th className="px-6 py-4 font-semibold text-gray-700">상태</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-xs text-gray-500">ID: {product.id}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                <td className="px-6 py-4 text-gray-900">{product.price.toLocaleString()}원</td>
                <td className="px-6 py-4 text-gray-600">{product.stock}개</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === '판매중'
                        ? 'bg-green-100 text-green-700'
                        : product.status === '품절'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleEditOpen(product.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="수정"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="삭제"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalMode === 'create' ? '신규 상품 등록' : '상품 정보 수정'}
          productData={currentProduct}
          setProductData={setCurrentProduct}
          onSubmit={handleSubmit}
        />

        {products.length === 0 && (
          <div className="p-20 text-center text-gray-500">등록된 상품이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default ProductManagementPage;
