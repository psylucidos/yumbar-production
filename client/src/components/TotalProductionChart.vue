<template>
  <LineChart :chartData="testData" />
</template>

<script>
import { defineComponent } from 'vue';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default defineComponent({
  name: 'TotalProductionChart',
  components: { LineChart },
  setup() {
    const testData = {
      labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'Number of Vanilla Boxes',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        borderColor: 'rgb(218, 165, 32)',
        backgroundColor: 'rgb(218, 165, 32, 0.1)',
        tension: 0.1,
      }, {
        label: 'Number of Chocolate Boxes',
        data: [15, 32, 56, 55, 43, 22, 15],
        fill: true,
        borderColor: 'rgb(139, 69, 19)',
        backgroundColor: 'rgb(139, 69, 19, 0.1)',
        tension: 0.1,
      }],
    };

    return { testData };
  },
});
</script>
