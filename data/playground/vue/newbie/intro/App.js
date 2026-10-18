const { createApp, ref, computed } = Vue;

createApp({
  setup() {
    const message = ref('Xin chào Vue 3!');
    const count = ref(0);
    const doubled = computed(() => count.value * 2);
    return { message, count, doubled };
  },
  template: `
    <main class="panel stack hero">
      <h1>{{ message }}</h1>
      <input v-model="message" placeholder="Sửa câu chào..." />
      <div class="row">
        <button @click="count++">Đã bấm {{ count }} lần</button>
        <button class="ghost" @click="count = 0">Đặt lại</button>
      </div>
      <p class="muted">Gấp đôi (computed): {{ doubled }}</p>
    </main>
  `
}).mount('#app');
