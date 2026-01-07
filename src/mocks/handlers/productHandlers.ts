import { http, HttpResponse } from 'msw';
import { mockProducts } from '../data/productData';

let products = [...mockProducts];

export const productHandlers = [
  //조회
  http.get('/api/admin/productList', () => {
    return HttpResponse.json(products);
  }),

  // 삭제
  http.delete('/api/admin/productList/:id', ({ params }) => {
    const { id } = params;
    products = products.filter((p) => p.id !== Number(id));
    return new HttpResponse(null, { status: 204 });
  }),
];
