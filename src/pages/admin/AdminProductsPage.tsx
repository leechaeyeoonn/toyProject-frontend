import React, { useState } from 'react';
import type { Product } from '../../types/product';
import { Trash2, Edit, Plus } from 'lucide-react';
import ProductModal from './components/ProductModal';
import { useProducts } from '../../hooks/useProducts';
// 1. DataTable과 Column 타입을 가져옵니다.
import DataTable, { type Column } from '../../components/common/DataTable';

const ProductManagementPage = () => {
  const { products, isLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const emptyProduct = {
    name: '',
    price: 0,
    category: '기타',
    stock: 0,
    status: '판매중',
  };

  const [currentProduct, setCurrentProduct] = useState<any>(emptyProduct);

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
    { header: '재고', key: 'stock', render: (val) => `${val}개` },
    {
      header: '상태',
      key: 'status',
      render: (val) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            val === '판매중'
              ? 'bg-green-100 text-green-700'
              : val === '품절'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      header: '관리',
      key: 'actions',
      render: (_, product) => (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => handleEditOpen(product)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="수정"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => deleteProduct(product.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="삭제"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  const handleCreateOpen = () => {
    setModalMode('create');
    setCurrentProduct(emptyProduct);
    setIsModalOpen(true);
  };

  const handleEditOpen = (product: Product) => {
    setModalMode('edit');
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await addProduct(currentProduct);
      } else {
        await updateProduct(currentProduct);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert('저장에 실패했습니다.');
    }
  };

  if (isLoading) return <div className="p-10">상품 목록을 불러오는 중...</div>;

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

      {/* 2. 기존의 복잡했던 table 태그를 DataTable 컴포넌트 하나로 교체합니다! */}
      <DataTable columns={columns} data={products} />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? '신규 상품 등록' : '상품 정보 수정'}
        productData={currentProduct}
        setProductData={setCurrentProduct}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ProductManagementPage;
