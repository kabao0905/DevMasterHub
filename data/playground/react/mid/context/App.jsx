const { createContext, useContext, useReducer } = React;

const PRODUCTS = [
  { id: 'p1', name: 'Bàn phím cơ', price: 1290000 },
  { id: 'p2', name: 'Chuột không dây', price: 490000 },
  { id: 'p3', name: 'Tai nghe', price: 890000 },
];

const formatVnd = n => n.toLocaleString('vi-VN') + ' ₫';

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const found = state.find(i => i.id === action.product.id);
      if (found) return state.map(i => (i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...state, { ...action.product, qty: 1 }];
    }
    case 'DECREASE':
      return state.map(i => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i)).filter(i => i.qty > 0);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

const CartContext = createContext(null);

function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  return <CartContext.Provider value={{ items, total, dispatch }}>{children}</CartContext.Provider>;
}

function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart phải nằm trong <CartProvider>');
  return ctx;
}

function ProductList() {
  const { dispatch } = useCart();
  return (
    <section className="panel stack">
      <h2>Sản phẩm</h2>
      {PRODUCTS.map(p => (
        <div key={p.id} className="line">
          <span>{p.name}</span>
          <b>{formatVnd(p.price)}</b>
          <button onClick={() => dispatch({ type: 'ADD', product: p })}>Thêm</button>
        </div>
      ))}
    </section>
  );
}

function CartBadge() {
  const { items } = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);
  return <span className="badge">Giỏ hàng: {count}</span>;
}

function Cart() {
  const { items, total, dispatch } = useCart();
  return (
    <section className="panel stack">
      <h2>Giỏ hàng</h2>
      {items.length === 0 && <p className="muted">Chưa có sản phẩm nào.</p>}
      {items.map(i => (
        <div key={i.id} className="line">
          <span>{i.name} × {i.qty}</span>
          <button className="ghost" onClick={() => dispatch({ type: 'DECREASE', id: i.id })}>−</button>
        </div>
      ))}
      <div className="line total"><span>Tổng</span><b>{formatVnd(total)}</b></div>
      {items.length > 0 && <button className="ghost" onClick={() => dispatch({ type: 'CLEAR' })}>Xoá giỏ</button>}
    </section>
  );
}

function App() {
  return (
    <CartProvider>
      <header className="row top"><h1>Shop</h1><CartBadge /></header>
      <div className="grid">
        <ProductList />
        <Cart />
      </div>
    </CartProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
