const { createApp, computed } = Vue;
const { createPinia, defineStore, storeToRefs } = Pinia;

const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    products: [
      { id: 'p1', name: 'Áo thun', price: 199000 },
      { id: 'p2', name: 'Quần jean', price: 459000 },
      { id: 'p3', name: 'Mũ lưỡi trai', price: 129000 },
    ],
  }),
  getters: {
    count: state => state.items.reduce((s, i) => s + i.qty, 0),
    total: state => state.items.reduce((s, i) => s + i.qty * i.price, 0),
  },
  actions: {
    add(product) {
      const found = this.items.find(i => i.id === product.id);
      if (found) found.qty++;
      else this.items.push({ ...product, qty: 1 });
    },
    remove(id) {
      this.items = this.items.filter(i => i.id !== id);
    },
  },
});

const vnd = n => n.toLocaleString('vi-VN') + ' ₫';

const CartBadge = {
  setup() {
    const { count } = storeToRefs(useCartStore());
    return { count };
  },
  template: `<span class="badge">Giỏ: {{ count }}</span>`
};

const app = createApp({
  components: { CartBadge },
  setup() {
    const cart = useCartStore();
    return { cart, vnd, total: computed(() => vnd(cart.total)) };
  },
  template: `
    <main class="stack">
      <header class="row top"><h2>Cửa hàng (Pinia)</h2><CartBadge /></header>
      <section class="panel stack">
        <div v-for="p in cart.products" :key="p.id" class="line">
          <span>{{ p.name }}</span><b>{{ vnd(p.price) }}</b>
          <button @click="cart.add(p)">Thêm</button>
        </div>
      </section>
      <section class="panel stack">
        <h3>Giỏ hàng</h3>
        <p v-if="!cart.items.length" class="muted">Chưa có gì. Hai component dùng chung một store.</p>
        <div v-for="i in cart.items" :key="i.id" class="line">
          <span>{{ i.name }} × {{ i.qty }}</span>
          <b>{{ vnd(i.qty * i.price) }}</b>
          <button class="ghost" @click="cart.remove(i.id)">Xoá</button>
        </div>
        <p><b>Tổng: {{ total }}</b></p>
      </section>
    </main>
  `
});

app.use(createPinia());
app.mount('#app');
