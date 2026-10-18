interface Product {
  id: number;
  title: string;
  price: number;
  tags?: string[];
  readonly createdAt: Date;
}

interface CartItem {
  product: Product;
  quantity: number;
}

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';

interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
}

const products: Product[] = [
  { id: 1, title: 'Bàn phím cơ', price: 1290000, tags: ['gaming'], createdAt: new Date() },
  { id: 2, title: 'Chuột không dây', price: 490000, createdAt: new Date() },
];

function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

function describe(order: Order): string {
  const count = order.items.reduce((s, i) => s + i.quantity, 0);
  return `Đơn ${order.id}: ${count} sản phẩm, ${cartTotal(order.items).toLocaleString('vi-VN')}₫ (${order.status})`;
}

const order: Order = {
  id: 'DH001',
  items: [
    { product: products[0], quantity: 1 },
    { product: products[1], quantity: 2 },
  ],
  status: 'paid',
};

console.log(describe(order));
console.log('Sản phẩm có tag:', products.filter(p => p.tags?.length).map(p => p.title));

// Bỏ dấu // ở dòng dưới để xem TypeScript báo lỗi: 'delivered' không thuộc OrderStatus
// order.status = 'delivered';
