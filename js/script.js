//Я обрав Vue 3, оскільки він має більш низький поріг входження для новачків,
// а також синтаксис у нього для мене більш зрозумілий
const app = Vue.createApp({
  data() {
    return {
      routesData: [
        { name: "Веломаршрут 1", lengthKm: 32, difficulty: "легка" },
        { name: "Веломаршрут 2", lengthKm: 57, difficulty: "середня" },
        { name: "Веломаршрут 3", lengthKm: 86, difficulty: "складна" },
      ],
    };
  },
  methods: {
    deleteRoute(routeName) {
      this.routesData = this.routesData.filter(
        (route) => route.name !== routeName,
      );
    },
  },
});

app.component("route-card", {
  props: ["name", "lengthKm", "difficulty"],
  computed: {
    travelTime() {
      return Math.round((this.lengthKm / 15) * 60);
    },
  },
  template: `
    <article class="routes">
      <h3>{{ name }}</h3>
      <p>Довжина: <span class="distance-value">{{ lengthKm }} км</span></p>
      <p>Час у дорозі: <span class="time-value">{{ travelTime }} хв</span></p>  
      <p>Складність: <span :class="'badge ' + difficulty.toLowerCase()">{{ difficulty }}</span></p>
      <button @click="$emit('delete-route', name)" style="margin-top: 10px;">Видалити</button>
    </article>
  `,
});

app.mount("#app");
