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
  props: [
    'data',
  ],
  setup(props) {
    console.log('data prop', props.data);

    const dataArr = [];
    const keys = Object.keys(props.data);
    for (let i = 0; i < keys.length; i += 1) {
      dataArr.push(props.data[keys[i]]);
    }

    console.log('data arr', dataArr);

    const testData = {
      labels: [
        'Vanilla',
        'Chocolate',
        'Jaffa',
        'Hazelnut',
        'Mint',
        'Mango',
        'Strawberry',
        'Blueberry',
        'Raspberry',
        'Coffee',
      ],
      datasets: [
        {
          data: dataArr,
          backgroundColor: ['yellow', 'brown', 'maroon', 'beige', 'green', 'orange', 'pink', 'blue', 'red', 'grey'],
        },
      ],
    };

    return { testData };
  },
});
</script>
