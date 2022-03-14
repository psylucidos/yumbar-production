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
  props: [
    'data',
    'labels',
  ],
  setup(props) {
    console.log('incoming props', props);
    const testData = {
      labels: props.labels,
      datasets: [{
        label: 'Number of Boxes',
        data: props.data,
        fill: true,
        borderColor: 'rgb(218, 165, 32)',
        backgroundColor: 'rgb(218, 165, 32, 0.1)',
        tension: 0.3,
      }],
    };

    console.log('test data', testData);

    return { testData };
  },
});
</script>
