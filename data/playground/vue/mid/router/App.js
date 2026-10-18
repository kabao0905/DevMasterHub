const { createApp, ref } = Vue;
const { createRouter, createMemoryHistory, useRoute, useRouter } = VueRouter;

const isAdmin = ref(false);

const users = [
  { id: '1', name: 'Nguyễn An' },
  { id: '2', name: 'Trần Bình' },
];

const Home = { template: `<div><h2>Trang chủ</h2><p class="muted">Bấm các link phía trên để chuyển trang.</p></div>` };

const UserList = {
  setup: () => ({ users }),
  template: `
    <div>
      <h2>Người dùng</h2>
      <ul><li v-for="u in users" :key="u.id"><RouterLink :to="'/user/' + u.id">{{ u.name }}</RouterLink></li></ul>
    </div>
  `
};

const User = {
  props: ['id'],
  setup(props) {
    const router = useRouter();
    const user = users.find(u => u.id === props.id);
    return { user, back: () => router.back() };
  },
  template: `
    <div>
      <h2>{{ user ? user.name : 'Không tìm thấy' }}</h2>
      <p class="muted">Tham số :id = {{ id }} (truyền vào qua props: true)</p>
      <button class="ghost" @click="back">Quay lại</button>
    </div>
  `
};

const Admin = { template: `<div><h2>Trang quản trị</h2><p class="muted">Bạn đã qua được navigation guard.</p></div>` };

const Login = {
  setup() {
    const router = useRouter();
    return { login: () => { isAdmin.value = true; router.push('/admin'); } };
  },
  template: `<div><h2>Cần đăng nhập</h2><button @click="login">Đăng nhập admin</button></div>`
};

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/users', component: UserList },
    { path: '/user/:id', component: User, props: true },
    { path: '/admin', component: Admin, beforeEnter: () => (isAdmin.value ? true : '/login') },
    { path: '/login', component: Login },
  ],
});

const app = createApp({
  setup() {
    const route = useRoute();
    return { route, isAdmin };
  },
  template: `
    <main class="stack">
      <nav class="nav">
        <RouterLink to="/">Trang chủ</RouterLink>
        <RouterLink to="/users">Người dùng</RouterLink>
        <RouterLink to="/admin">Admin</RouterLink>
      </nav>
      <code class="url">URL: {{ route.fullPath }}</code>
      <section class="panel"><RouterView /></section>
    </main>
  `
});

app.use(router);
app.mount('#app');
