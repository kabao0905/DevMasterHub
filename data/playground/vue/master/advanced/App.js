const { createApp, ref, h, defineAsyncComponent } = Vue;

const vFocus = {
  mounted: el => el.focus()
};

const vTooltip = {
  mounted(el, binding) {
    const tip = document.createElement('span');
    tip.className = 'tooltip';
    tip.textContent = binding.value;
    el.style.position = 'relative';
    el.append(tip);
    el.addEventListener('mouseenter', () => tip.classList.add('show'));
    el.addEventListener('mouseleave', () => tip.classList.remove('show'));
  },
  updated(el, binding) {
    el.querySelector('.tooltip').textContent = binding.value;
  }
};

const LoadingSpinner = { template: `<p class="muted">Đang tải component...</p>` };

const AsyncChart = defineAsyncComponent({
  loader: () => new Promise(resolve => setTimeout(() => resolve({
    props: ['values'],
    template: `
      <div class="chart">
        <div v-for="(v, i) in values" :key="i" class="bar" :style="{ height: v + '%' }">{{ v }}</div>
      </div>
    `
  }), 1200)),
  loadingComponent: LoadingSpinner,
  delay: 200,
  timeout: 5000
});

const Heading = {
  props: { level: { type: Number, default: 2 } },
  setup(props, { slots }) {
    return () => h('h' + props.level, { class: 'heading' }, slots.default());
  }
};

createApp({
  components: { AsyncChart, Heading },
  directives: { focus: vFocus, tooltip: vTooltip },
  setup() {
    const showChart = ref(false);
    const level = ref(2);
    return { showChart, level };
  },
  template: `
    <main class="stack">
      <section class="panel stack">
        <Heading :level="3">Custom directive</Heading>
        <input v-focus placeholder="v-focus: ô này tự được focus" />
        <button v-tooltip="'Tooltip do directive v-tooltip tạo ra'">Rê chuột vào đây</button>
      </section>
      <section class="panel stack">
        <Heading :level="3">defineAsyncComponent</Heading>
        <button @click="showChart = true" :disabled="showChart">Tải biểu đồ</button>
        <AsyncChart v-if="showChart" :values="[40, 75, 55, 90, 65]" />
      </section>
      <section class="panel stack">
        <Heading :level="level">Render function h() tạo thẻ h{{ level }}</Heading>
        <input type="range" min="1" max="4" v-model.number="level" />
      </section>
    </main>
  `
}).mount('#app');
