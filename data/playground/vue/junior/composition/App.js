const { createApp, ref, watch, onMounted, onUnmounted } = Vue;

const boNhoTam = new Map();

function storage() {
  try {
    localStorage.setItem('__thu__', '1');
    localStorage.removeItem('__thu__');
    return { kieu: 'localStorage', get: k => localStorage.getItem(k), set: (k, v) => localStorage.setItem(k, v) };
  } catch {
    return { kieu: 'bộ nhớ tạm', get: k => boNhoTam.get(k) ?? null, set: (k, v) => boNhoTam.set(k, v) };
  }
}

function useLocalStorage(key, initialValue) {
  const store = storage();
  const saved = store.get(key);
  const value = ref(saved !== null ? JSON.parse(saved) : initialValue);
  watch(value, v => store.set(key, JSON.stringify(v)), { deep: true });
  return { value, kieu: store.kieu };
}

function useMouse() {
  const x = ref(0);
  const y = ref(0);
  const update = e => { x.value = e.clientX; y.value = e.clientY; };
  onMounted(() => window.addEventListener('mousemove', update));
  onUnmounted(() => window.removeEventListener('mousemove', update));
  return { x, y };
}

createApp({
  setup() {
    const { value: notes, kieu } = useLocalStorage('ghi-chu', ['Học composable']);
    const draft = ref('');
    const { x, y } = useMouse();
    const add = () => {
      if (!draft.value.trim()) return;
      notes.value.push(draft.value.trim());
      draft.value = '';
    };
    return { notes, kieu, draft, add, x, y };
  },
  template: `
    <main class="stack">
      <section class="panel stack">
        <h2>useLocalStorage</h2>
        <form class="row" @submit.prevent="add">
          <input v-model="draft" placeholder="Ghi chú mới" />
          <button>Lưu</button>
        </form>
        <ul><li v-for="(n, i) in notes" :key="i">{{ n }}</li></ul>
        <p class="muted">Đang lưu vào: {{ kieu }}. Khung xem trước chặn localStorage nên composable tự chuyển sang bộ nhớ tạm, trên web thật sẽ dùng localStorage.</p>
      </section>
      <section class="panel">
        <h2>useMouse</h2>
        <p class="muted">Rê chuột trong khung: x = {{ x }}, y = {{ y }}</p>
      </section>
    </main>
  `
}).mount('#app');
