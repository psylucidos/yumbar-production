<template>
  <q-card>
    <q-card-section class="title-section">
      <div v-if="!loading" class="text-h6">Icecream Trays Poured</div>
      <q-skeleton v-if="loading" width="300px" type="text" class="text-h6" />
    </q-card-section>

    <q-separator inset />

    <q-card-section>
      <LineChart v-if="!loading" :chartData="chartData" />
      <q-skeleton v-if="loading" height="400px" square />
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss" media="screen">
.title-section {
  padding-bottom: 8px;
}
</style>

<script>
import { defineComponent } from 'vue';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function prettifyDate(targetDate) {
  const DD = targetDate.getDate() < 10 ? `0${targetDate.getDate()}` : targetDate.getDate();
  const M = targetDate.getMonth() + 1; // account for dates starting at 0
  const MM = M < 10 ? `0${M}` : M;
  const YYYY = targetDate.getFullYear();
  return `${DD}-${MM}-${YYYY}`;
}

export default defineComponent({
  name: 'IcecreamChart',
  components: { LineChart },
  data() {
    return {
      chartData: null,
      loading: true,
    };
  },
  created() {
    const dateRanges = [];
    const targetDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    for (let i = 0; i < 13; i += 1) {
      const firstDayInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
      const lastDayInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

      dateRanges.push({
        start: prettifyDate(firstDayInMonth),
        end: prettifyDate(lastDayInMonth),
      });
      targetDate.setMonth(targetDate.getMonth() - 1);
    }

    console.log('created date ranges', dateRanges);

    this.$api
      .post('/flavours/gettraysinrange', dateRanges, {
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
        },
      })
      .then((res) => {
        console.log('received trays response', res);
        const { data } = res;

        const labels = [];
        const traysByMonth = [];
        for (let i = 0; i < data.length; i += 1) {
          const [d, m, y] = data[i].start.split('-');
          const monthString = new Date(`${y}/${m}/${d}`).toLocaleString('default', { month: 'long' });
          labels.push(monthString);
          traysByMonth.push(data[i].trays);
        }

        this.chartData = {
          labels: labels.reverse(),
          datasets: [{
            label: 'Number of Trays',
            data: traysByMonth.reverse(),
            fill: true,
            borderColor: 'rgb(231,86,127)',
            backgroundColor: 'rgb(231,86,127, 0.3)',
            tension: 0.3,
          }],
        };
        this.loading = false;
      })
      .catch(this.handlePostErr);
  },
  methods: {
    handlePostErr(err) {
      if (err.response) {
        if (err.response.status === 401) {
          this.$router.push('/');
        } else {
          this.$q.notify({
            message: `Unexpected Error (${err.response.status})! Please Reload Page!`,
            icon: 'warning',
            color: 'red',
          });
        }
      } else {
        this.$q.notify({
          message: 'Unexpected Error! Server May be Down! Check your internet connection!',
          icon: 'warning',
          color: 'red',
        });
      }

      throw err;
    },
  },
});
</script>
