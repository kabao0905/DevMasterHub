const { createApp, ref } = Vue;

const CourseCard = {
  props: {
    title: { type: String, required: true },
    content: String,
    color: { type: String, default: '#42b883' },
    saved: Boolean
  },
  emits: ['toggle-save'],
  template: `
    <article class="card">
      <div class="cover" :style="{ background: color }"></div>
      <div class="body">
        <h3>{{ title }}</h3>
        <p class="muted">{{ content }}</p>
        <slot />
        <button :class="{ ghost: saved }" @click="$emit('toggle-save')">{{ saved ? 'Đã lưu' : 'Lưu' }}</button>
      </div>
    </article>
  `
};

createApp({
  components: { CourseCard },
  setup() {
    const courses = ref([
      { id: 1, title: 'Vue cơ bản', content: 'Template, directive, reactivity.', color: 'linear-gradient(135deg, #42b883, #35495e)', saved: false },
      { id: 2, title: 'Composition API', content: 'ref, computed, composable.', color: 'linear-gradient(135deg, #38bdf8, #6366f1)', saved: true },
      { id: 3, title: 'Pinia', content: 'Quản lý state toàn cục.', color: 'linear-gradient(135deg, #fbbf24, #f472b6)', saved: false },
    ]);
    const toggle = c => { c.saved = !c.saved; };
    return { courses, toggle };
  },
  template: `
    <main class="stack">
      <h2>Component cha truyền props, con emit sự kiện</h2>
      <div class="grid">
        <CourseCard
          v-for="c in courses"
          :key="c.id"
          :title="c.title"
          :content="c.content"
          :color="c.color"
          :saved="c.saved"
          @toggle-save="toggle(c)"
        >
          <small class="slot">Nội dung slot từ cha</small>
        </CourseCard>
      </div>
      <p class="muted">Đã lưu: {{ courses.filter(c => c.saved).map(c => c.title).join(', ') || 'chưa có' }}</p>
    </main>
  `
}).mount('#app');
