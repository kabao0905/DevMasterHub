const { createApp, ref, computed, watch, onMounted, onUnmounted } = Vue;

const LiveClock = {
  setup() {
    const now = ref(new Date());
    let timer;
    onMounted(() => {
      console.log('LiveClock: onMounted, bắt đầu đếm');
      timer = setInterval(() => { now.value = new Date(); }, 1000);
    });
    onUnmounted(() => {
      clearInterval(timer);
      console.log('LiveClock: onUnmounted, đã dọn setInterval');
    });
    const time = computed(() => now.value.toLocaleTimeString('vi-VN'));
    return { time };
  },
  template: `<p class="clock">{{ time }}</p>`
};

createApp({
  components: { LiveClock },
  setup() {
    const showClock = ref(true);
    const width = ref(window.innerWidth);
    const onResize = () => { width.value = window.innerWidth; };
    onMounted(() => window.addEventListener('resize', onResize));
    onUnmounted(() => window.removeEventListener('resize', onResize));

    const count = ref(0);
    watch(count, (moi, cu) => console.log(`watch: count đổi ${cu} → ${moi}`));

    return { showClock, width, count };
  },
  template: `
    <main class="stack">
      <section class="panel stack">
        <h2>Đồng hồ realtime</h2>
        <LiveClock v-if="showClock" />
        <button class="ghost" @click="showClock = !showClock">{{ showClock ? 'Gỡ đồng hồ (unmount)' : 'Gắn lại đồng hồ (mount)' }}</button>
        <p class="muted">Bấm nút rồi xem Console: onUnmounted dọn setInterval.</p>
      </section>
      <section class="panel stack">
        <h2>watch</h2>
        <button @click="count++">count = {{ count }}</button>
        <p class="muted">Chiều rộng khung: {{ width }}px (đổi qua nút Desktop/Tablet/Mobile)</p>
      </section>
    </main>
  `
}).mount('#app');
