const { createApp, ref, computed } = Vue;

createApp({
  setup() {
    const name = ref('');
    const newTodo = ref('');
    const showDone = ref(true);
    const todos = ref([
      { id: 1, text: 'Học Vue directives', done: true },
      { id: 2, text: 'Làm Todo List', done: false },
    ]);
    const visible = computed(() => (showDone.value ? todos.value : todos.value.filter(t => !t.done)));

    function add() {
      if (!newTodo.value.trim()) return;
      todos.value.push({ id: Date.now(), text: newTodo.value.trim(), done: false });
      newTodo.value = '';
    }

    return { name, newTodo, showDone, todos, visible, add };
  },
  template: `
    <main class="panel stack">
      <input v-model="name" placeholder="Nhập tên của bạn" />
      <p v-if="name">Xin chào, <b>{{ name }}</b>!</p>
      <p v-else class="muted">Hãy nhập tên (v-if / v-else)...</p>

      <form class="row" @submit.prevent="add">
        <input v-model="newTodo" placeholder="Việc cần làm" />
        <button>Thêm</button>
      </form>

      <label class="row"><input type="checkbox" v-model="showDone" /> Hiện việc đã xong</label>

      <ul class="todos">
        <li v-for="todo in visible" :key="todo.id" :class="{ done: todo.done }">
          <input type="checkbox" v-model="todo.done" />
          {{ todo.text }}
        </li>
      </ul>
      <p v-show="visible.length === 0" class="muted">Không còn việc nào.</p>
    </main>
  `
}).mount('#app');
