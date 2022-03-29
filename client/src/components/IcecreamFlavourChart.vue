<template>
  <q-card>
    <q-card-section class="title-section row">
      <div
        class="col text-h6"
        v-if="!loading"
      >
        Ice Cream Flavor Distribution
      </div>
      <q-skeleton v-if="loading" width="300px" type="text" class="text-h6 col" />
      <div class="col-4">
        <q-select
          dense
          v-if="!loading"
          v-model="productionType"
          :options="options"
          @update:model-value="renderData"
        />
      </div>
    </q-card-section>

    <q-separator inset />

    <q-card-section>
      <DoughnutChart v-if="!loading" :chartData="chartData" />
      <q-skeleton v-if="loading" height="400px" square />
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss" media="screen">
.title-section {
  padding-bottom: 0;
}
</style>

<script>
import { defineComponent } from 'vue';
import { DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default defineComponent({
  name: 'IcecreamFlavourChart',
  components: { DoughnutChart },
  data() {
    return {
      chartData: null,
      loading: true,
      options: ['Packing Day (Boxes)', 'Cutting Day (Slabs)', 'Base Day (Bases)', 'Icecream Day (Trays)'],
      productionType: 'Packing Day (Boxes)',
    };
  },
  created() {
    this.renderData();
  },
  methods: {
    renderData() {
      this.loading = true;
      if (this.productionType === 'Packing Day (Boxes)') {
        this.$api
          .post('/flavours/getpackingboxes', {}, {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          })
          .then((res) => {
            console.log('received packing response', res);
            const { data } = res;

            const labels = [];
            const pieData = [];
            data.forEach((x) => {
              labels.push(x.flavour);
              pieData.push(x.sum);
            });

            this.chartData = {
              labels,
              datasets: [
                {
                  data: pieData,
                  backgroundColor: ['yellow', 'brown', 'maroon', 'beige', 'green', 'orange', 'pink', 'blue', 'red', 'grey'],
                },
              ],
            };
            console.log('this is the chartdata', this.chartData);
            this.loading = false;
          })
          .catch(this.handlePostErr);
      } else if (this.productionType === 'Cutting Day (Slabs)') {
        this.$api
          .post('/flavours/getcuttingslabs', {}, {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          })
          .then((res) => {
            console.log('received cutting response', res);
            const { data } = res;

            const labels = [];
            const pieData = [];
            data.forEach((x) => {
              labels.push(x.flavour);
              pieData.push(x.sum);
            });

            this.chartData = {
              labels,
              datasets: [
                {
                  data: pieData,
                  backgroundColor: ['yellow', 'brown', 'maroon', 'beige', 'green', 'orange', 'pink', 'blue', 'red', 'grey'],
                },
              ],
            };
            console.log('this is the chartdata', this.chartData);
            this.loading = false;
          })
          .catch(this.handlePostErr);
      } else if (this.productionType === 'Base Day (Bases)') {
        this.$api
          .post('/flavours/getbaseblenders', {}, {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          })
          .then((res) => {
            console.log('received cutting response', res);
            const { data } = res;

            const labels = [];
            const pieData = [];
            data.forEach((x) => {
              labels.push(x.flavour);
              pieData.push(x.sum);
            });

            this.chartData = {
              labels,
              datasets: [
                {
                  data: pieData,
                  backgroundColor: ['yellow', 'brown', 'maroon', 'beige', 'green', 'orange', 'pink', 'blue', 'red', 'grey'],
                },
              ],
            };
            console.log('this is the chartdata', this.chartData);
            this.loading = false;
          })
          .catch(this.handlePostErr);
      } else if (this.productionType === 'Icecream Day (Trays)') {
        this.$api
          .post('/flavours/geticecreamtrays', {}, {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          })
          .then((res) => {
            console.log('received cutting response', res);
            const { data } = res;

            const labels = [];
            const pieData = [];
            data.forEach((x) => {
              labels.push(x.flavour);
              pieData.push(x.sum);
            });

            this.chartData = {
              labels,
              datasets: [
                {
                  data: pieData,
                  backgroundColor: ['yellow', 'brown', 'maroon', 'beige', 'green', 'orange', 'pink', 'blue', 'red', 'grey'],
                },
              ],
            };
            console.log('this is the chartdata', this.chartData);
            this.loading = false;
          })
          .catch(this.handlePostErr);
      }
    },
  },
});
</script>
