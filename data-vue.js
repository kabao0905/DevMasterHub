// ═══════════════════════════════════════════════════════════════
// DevMaster Hub — Vue.js Curriculum (Frontend)
// ═══════════════════════════════════════════════════════════════
const DATA_VUE = {
  id:'vue', name:'Vue.js', icon:'💚', color:'#42b883',
  gradient:'linear-gradient(135deg,#42b883,#35495e)',
  category:'frontend',
  description:'Progressive framework — reactive UI, Composition API, Nuxt',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Vue basics & template syntax',lessons:[
      {id:'intro',title:'Vue.js Overview & Setup',
       theory:'<p><b>Vue.js</b> là progressive JavaScript framework cho building UI. Dễ học, reactive data binding, component-based architecture.</p><p>Vue 3 dùng Composition API mạnh mẽ hơn Options API cũ.</p>',
       code:'<!-- CDN setup -->\n<div id="app">\n  <h1>{{ message }}</h1>\n  <button @click="count++">Count: {{ count }}</button>\n</div>\n\n<script>\nimport { createApp, ref } from \'vue\'\n\ncreateApp({\n  setup() {\n    const message = ref(\'Hello Vue 3!\')\n    const count = ref(0)\n    return { message, count }\n  }\n}).mount(\'#app\')\n</script>',
       lang:'markup',
       keyPoints:['Progressive framework','Reactive data binding','Template syntax {{ }}','@click directive = v-on:click'],
       exercise:'Tạo app Vue đơn giản với counter'},
      {id:'directives',title:'Directives & Reactivity',
       theory:'<p>Vue directives: <code>v-if, v-for, v-bind, v-model, v-show</code>. Reactivity system tự động update DOM khi data thay đổi.</p>',
       code:'<template>\n  <div>\n    <input v-model="name" placeholder="Nhập tên">\n    <p v-if="name">Xin chào, {{ name }}!</p>\n    <p v-else>Hãy nhập tên...</p>\n\n    <ul>\n      <li v-for="item in items" :key="item.id"\n          :class="{ done: item.completed }">\n        {{ item.text }}\n      </li>\n    </ul>\n  </div>\n</template>\n\n<script setup>\nimport { ref } from \'vue\'\nconst name = ref(\'\')\nconst items = ref([\n  { id: 1, text: \'Học Vue\', completed: true },\n  { id: 2, text: \'Build app\', completed: false }\n])\n</script>',
       lang:'markup',
       keyPoints:['v-model = two-way binding','v-if / v-else conditional','v-for iteration','v-bind (:) dynamic attributes'],
       exercise:'Tạo Todo List dùng v-model, v-for, v-if'},
      {id:'events',title:'Events & Methods',
       theory:'<p>Event handling với <code>@click, @submit, @input</code>. Methods xử lý logic, computed properties cho derived data.</p>',
       code:'<script setup>\nimport { ref, computed } from \'vue\'\n\nconst todos = ref([])\nconst newTodo = ref(\'\')\n\nconst remaining = computed(() =>\n  todos.value.filter(t => !t.done).length\n)\n\nfunction addTodo() {\n  if (!newTodo.value.trim()) return\n  todos.value.push({ text: newTodo.value, done: false })\n  newTodo.value = \'\'\n}\n\nfunction removeTodo(index) {\n  todos.value.splice(index, 1)\n}\n</script>',
       lang:'javascript',
       keyPoints:['@event handling','computed() reactive derived','ref() reactive state','Methods cho logic'],
       exercise:'Tạo shopping list với add/remove/filter'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Components & Composition API',lessons:[
      {id:'components',title:'Components & Props',
       theory:'<p>Components = building blocks. Props truyền data từ parent → child. Emit cho child → parent.</p>',
       code:'<!-- TodoItem.vue -->\n<template>\n  <div class="todo-item" :class="{ done: todo.done }">\n    <input type="checkbox" v-model="todo.done">\n    <span>{{ todo.text }}</span>\n    <button @click="$emit(\'delete\')">✕</button>\n  </div>\n</template>\n\n<script setup>\ndefineProps({ todo: Object })\ndefineEmits([\'delete\'])\n</script>\n\n<!-- Parent -->\n<template>\n  <TodoItem v-for="(todo, i) in todos" :key="i"\n    :todo="todo" @delete="removeTodo(i)" />\n</template>',
       lang:'markup',
       keyPoints:['defineProps() nhận data','defineEmits() gửi events','Single File Component (.vue)','Component reusability'],
       exercise:'Tạo Card component nhận props title, content, image'},
      {id:'composition',title:'Composition API & Composables',
       theory:'<p>Composition API tổ chức logic theo feature thay vì option. Composables = reusable logic functions.</p>',
       code:'// composables/useFetch.js\nimport { ref, watchEffect } from \'vue\'\n\nexport function useFetch(url) {\n  const data = ref(null)\n  const error = ref(null)\n  const loading = ref(true)\n\n  watchEffect(async () => {\n    loading.value = true\n    try {\n      const res = await fetch(url.value || url)\n      data.value = await res.json()\n    } catch (e) {\n      error.value = e\n    } finally {\n      loading.value = false\n    }\n  })\n\n  return { data, error, loading }\n}\n\n// Component usage\n<script setup>\nconst { data, loading } = useFetch(\'https://api.example.com/users\')\n</script>',
       lang:'javascript',
       keyPoints:['Composables = reusable logic','watchEffect auto-tracking','ref/reactive state','Separation of concerns'],
       exercise:'Tạo composable useLocalStorage cho persistent state'},
      {id:'lifecycle',title:'Lifecycle & Watchers',
       theory:'<p>Lifecycle hooks: <code>onMounted, onUpdated, onUnmounted</code>. Watchers theo dõi thay đổi cụ thể.</p>',
       code:'<script setup>\nimport { ref, onMounted, onUnmounted, watch } from \'vue\'\n\nconst count = ref(0)\nconst windowWidth = ref(0)\n\nonMounted(() => {\n  console.log(\'Component mounted!\')\n  windowWidth.value = window.innerWidth\n  window.addEventListener(\'resize\', onResize)\n})\n\nonUnmounted(() => {\n  window.removeEventListener(\'resize\', onResize)\n})\n\nfunction onResize() {\n  windowWidth.value = window.innerWidth\n}\n\n// Watch specific value\nwatch(count, (newVal, oldVal) => {\n  console.log(`Count changed: ${oldVal} → ${newVal}`)\n})\n</script>',
       lang:'javascript',
       keyPoints:['onMounted = componentDidMount','onUnmounted = cleanup','watch() specific values','watchEffect() auto-track'],
       exercise:'Tạo component đồng hồ realtime với cleanup'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Vue Router & Pinia',lessons:[
      {id:'router',title:'Vue Router',
       theory:'<p>Vue Router cho SPA navigation. Dynamic routes, nested routes, navigation guards.</p>',
       code:'// router/index.js\nimport { createRouter, createWebHistory } from \'vue-router\'\n\nconst routes = [\n  { path: \'/\', component: () => import(\'./views/Home.vue\') },\n  { path: \'/user/:id\', component: () => import(\'./views/User.vue\'),\n    props: true },\n  { path: \'/admin\', component: () => import(\'./views/Admin.vue\'),\n    beforeEnter: (to, from) => {\n      if (!isAdmin()) return \'/login\'\n    }\n  }\n]\n\nconst router = createRouter({\n  history: createWebHistory(),\n  routes\n})\n\nexport default router',
       lang:'javascript',
       keyPoints:['Dynamic routes :id','Lazy loading components','Navigation guards','Route props'],
       exercise:'Tạo app multi-page với Vue Router'},
      {id:'pinia',title:'Pinia State Management',
       theory:'<p>Pinia = official state management. Thay thế Vuex. Type-safe, modular, devtools support.</p>',
       code:'// stores/counter.js\nimport { defineStore } from \'pinia\'\n\nexport const useCounterStore = defineStore(\'counter\', {\n  state: () => ({\n    count: 0,\n    name: \'DevMaster\'\n  }),\n  getters: {\n    doubleCount: (state) => state.count * 2\n  },\n  actions: {\n    increment() { this.count++ },\n    async fetchData() {\n      const res = await fetch(\'/api/data\')\n      this.count = await res.json()\n    }\n  }\n})\n\n// Component\n<script setup>\nconst store = useCounterStore()\nstore.increment()\nconsole.log(store.doubleCount)\n</script>',
       lang:'javascript',
       keyPoints:['defineStore() = store definition','State, getters, actions','Modular stores','DevTools integration'],
       exercise:'Tạo Pinia store cho shopping cart'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Nuxt.js & SSR',lessons:[
      {id:'nuxt',title:'Nuxt.js Framework',
       theory:'<p>Nuxt = meta-framework cho Vue. SSR, SSG, auto-imports, file-based routing.</p>',
       code:'// pages/index.vue (auto-routed!)\n<template>\n  <div>\n    <h1>{{ data.title }}</h1>\n    <NuxtLink to="/about">About</NuxtLink>\n  </div>\n</template>\n\n<script setup>\n// Server-side data fetching\nconst { data } = await useFetch(\'/api/hello\')\n\n// SEO\nuseHead({\n  title: \'My Nuxt App\',\n  meta: [{ name: \'description\', content: \'Built with Nuxt\' }]\n})\n</script>\n\n// server/api/hello.ts\nexport default defineEventHandler(() => {\n  return { title: \'Hello from Nuxt API!\' }\n})',
       lang:'markup',
       keyPoints:['File-based routing','useFetch() SSR data','Auto-imports','Server routes /server/api/'],
       exercise:'Tạo Nuxt app với SSR data fetching'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Performance & Production',lessons:[
      {id:'advanced',title:'Advanced Patterns & Performance',
       theory:'<p>Vue production: virtual scroll, async components, tree-shaking, custom directives, render functions.</p>',
       code:'// Custom directive\nconst vFocus = {\n  mounted: (el) => el.focus()\n}\n\n// Async component with loading state\nconst AsyncModal = defineAsyncComponent({\n  loader: () => import(\'./Modal.vue\'),\n  loadingComponent: LoadingSpinner,\n  delay: 200,\n  timeout: 3000\n})\n\n// Render function (advanced)\nimport { h } from \'vue\'\nexport default {\n  render() {\n    return h(\'div\', { class: \'container\' }, [\n      h(\'h1\', this.title),\n      this.$slots.default()\n    ])\n  }\n}',
       lang:'javascript',
       keyPoints:['Custom directives','Async components','Render functions h()','Performance optimization'],
       exercise:'Tạo custom directive v-tooltip và async component'}
    ]}
  ]
};
