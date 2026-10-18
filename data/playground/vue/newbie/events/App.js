const { createApp, ref, computed } = Vue;

createApp({
  setup() {
    const items = ref([
      { id: 1, name: 'Sữa tươi', bought: false },
      { id: 2, name: 'Bánh mì', bought: true },
    ]);
    const newItem = ref('');
    const filter = ref('all');

    const remaining = computed(() => items.value.filter(i => !i.bought).length);
    const filtered = computed(() => {
      if (filter.value === 'todo') return items.value.filter(i => !i.bought);
      if (filter.value === 'bought') return items.value.filter(i => i.bought);
      return items.value;
    });

    function addItem() {
      const name = newItem.value.trim();
      if (!name) return;
      items.value.push({ id: Date.now(), name, bought: false });
      newItem.value = '';
    }

    function removeItem(id) {
      items.value = items.value.filter(i => i.id !== id);
    }

    return { items, newItem, filter, remaining, filtered, addItem, removeItem };
  },
  template: `
    <main class="panel stack">
      <h2>Danh sách đi chợ</h2>
      <form class="row" @submit.prevent="addItem">
        <input v-model="newItem" placeholder="Thêm món (Enter)" @keyup.esc="newItem = ''" />
        <button>Thêm</button>
      </form>
      <div class="row filters">
        <button v-for="f in ['all', 'todo', 'bought']" :key="f" :class="{ ghost: filter !== f }" @click="filter = f">
          {{ { all: 'Tất cả', todo: 'Chưa mua', bought: 'Đã mua' }[f] }}
        </button>
      </div>
      <ul class="list">
        <li v-for="item in filtered" :key="item.id" :class="{ bought: item.bought }" @click="item.bought = !item.bought">
          <span>{{ item.name }}</span>
          <button class="ghost" @click.stop="removeItem(item.id)">Xoá</button>
        </li>
      </ul>
      <p class="muted">Còn {{ remaining }} món chưa mua. Bấm vào món để đánh dấu.</p>
    </main>
  `
}).mount('#app');
