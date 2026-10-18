const { createApp, ref, onMounted } = Vue;

const PAGES = {
  '/': { file: 'pages/index.vue', title: 'Trang chủ', api: '/api/hello' },
  '/about': { file: 'pages/about.vue', title: 'Giới thiệu', api: '/api/about' },
  '/blog/nuxt-4': { file: 'pages/blog/[slug].vue', title: 'Bài viết: nuxt-4', api: '/api/blog/nuxt-4' },
};

const API = {
  '/api/hello': { message: 'Xin chào từ Nuxt server!' },
  '/api/about': { message: 'Nuxt = Vue + SSR + file-based routing.' },
  '/api/blog/nuxt-4': { message: 'Nuxt 4 dùng thư mục app/ và cải thiện useFetch.' },
};

function useFetch(url) {
  const data = ref(null);
  const pending = ref(true);
  setTimeout(() => {
    data.value = API[url];
    pending.value = false;
  }, 500);
  return { data, pending };
}

const Page = {
  props: ['path'],
  setup(props) {
    const page = PAGES[props.path];
    const { data, pending } = useFetch(page.api);
    return { page, data, pending };
  },
  template: `
    <div class="stack">
      <code class="file">{{ page.file }}</code>
      <h2>{{ page.title }}</h2>
      <p v-if="pending" class="muted">useFetch('{{ page.api }}') đang chạy...</p>
      <p v-else>{{ data.message }}</p>
    </div>
  `
};

createApp({
  components: { Page },
  setup() {
    const path = ref('/');
    return { path, paths: Object.keys(PAGES) };
  },
  template: `
    <main class="stack">
      <p class="note">Nuxt cần server Node nên không chạy được trong khung này. Bản mô phỏng cho thấy file-based routing: mỗi file trong pages/ là một route, dữ liệu tải bằng useFetch.</p>
      <nav class="row">
        <button v-for="p in paths" :key="p" :class="{ ghost: path !== p }" @click="path = p">{{ p }}</button>
      </nav>
      <section class="panel"><Page :key="path" :path="path" /></section>
    </main>
  `
}).mount('#app');
