<template>
  <DoughnutChart :chartData="testData" />
</template>

<script>
import { defineComponent } from 'vue';
import { DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default defineComponent({
  name: 'IcecreamFlavourChart',
  components: { DoughnutChart },
  setup() {
    const testData = {
      labels: ['Vanilla', 'Chocolate', 'Hazelnut', 'Jaffa'],
      datasets: [
        {
          data: [50, 30, 15, 5],
          backgroundColor: ['yellow', 'brown', 'beige', 'orange'],
        },
      ],
    };

    return { testData };
  },
});
</script>
