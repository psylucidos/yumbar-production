<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-md">
      <div class="col-6">
        <q-card>
          <q-card-section class="title-section">
            <div v-if="!icecreamLoading" class="text-h6">Ice Cream Flavor Distribution</div>
            <q-skeleton v-if="icecreamLoading" width="300px" type="text" class="text-h6" />
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            <IcecreamFlavourChart v-if="!icecreamLoading" :data="icecreamData" />
            <q-skeleton v-if="icecreamLoading" height="400px" square />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6">
        <q-card class="text-h6">
          <q-card-section class="title-section">
            <div v-if="!productionLoading" class="text-h6">Ice Cream Production</div>
            <q-skeleton v-if="productionLoading" width="300px" type="text" class="text-h6" />
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            <TotalProductionChart
              :data="totalProductionData"
              :labels="totalProductionLabels"
              v-if="!productionLoading"
            />
            <q-skeleton v-if="productionLoading" height="400px" square />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-8">
        <q-card class="text-h6">
          <q-card-section class="title-section">
            <div v-if="!loading" class="text-h6">Production Data</div>
            <q-skeleton v-if="loading" width="300px" type="text" class="text-h6" />
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            <ProductionDataTable v-if="!loading" />
            <q-markup-table class="no-shadow" v-if="loading">
             <thead>
               <tr>
                 <th class="text-left" style="width: 150px">
                   <q-skeleton animation="blink" type="text" />
                 </th>
                 <th class="text-right">
                   <q-skeleton animation="blink" type="text" />
                 </th>
                 <th class="text-right">
                   <q-skeleton animation="blink" type="text" />
                 </th>
                 <th class="text-right">
                   <q-skeleton animation="blink" type="text" />
                 </th>
                 <th class="text-right">
                   <q-skeleton animation="blink" type="text" />
                 </th>
                 <th class="text-right">
                   <q-skeleton animation="blink" type="text" />
                 </th>
               </tr>
             </thead>

             <tbody>
               <tr v-for="n in 5" :key="n">
                 <td class="text-left">
                   <q-skeleton animation="blink" type="text" width="85px" />
                 </td>
                 <td class="text-right">
                   <q-skeleton animation="blink" type="text" width="50px" />
                 </td>
                 <td class="text-right">
                   <q-skeleton animation="blink" type="text" width="35px" />
                 </td>
                 <td class="text-right">
                   <q-skeleton animation="blink" type="text" width="65px" />
                 </td>
                 <td class="text-right">
                   <q-skeleton animation="blink" type="text" width="25px" />
                 </td>
                 <td class="text-right">
                   <q-skeleton animation="blink" type="text" width="85px" />
                 </td>
               </tr>
             </tbody>
           </q-markup-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss" media="screen">
.title-section {
  padding-bottom: 0;
}
</style>

<script>
import IcecreamFlavourChart from 'components/IcecreamFlavourChart.vue';
import TotalProductionChart from 'components/TotalProductionChart.vue';
import ProductionDataTable from 'components/ProductionDataTable.vue';
import { defineComponent } from 'vue';

function prettifyDate(targetDate) {
  const DD = targetDate.getDate() < 10 ? `0${targetDate.getDate()}` : targetDate.getDate();
  const M = targetDate.getMonth() + 1; // account for dates starting at 0
  const MM = M < 10 ? `0${M}` : M;
  const YYYY = targetDate.getFullYear();
  return `${DD}-${MM}-${YYYY}`;
}

export default defineComponent({
  name: 'PageStats',
  data() {
    return {
      loading: true,
      icecreamData: [],
      totalProductionData: [],
      totalProductionLabels: [],
      icecreamLoading: true,
      productionLoading: true,
    };
  },
  mounted() {
    const self = this;
    this.$api
      .post('/flavours/getallflavours', {}, {
        headers: {
          Authorization: `Bearer ${self.$store.state.token}`,
        },
      })
      .then((res) => {
        console.log('received flavours response', res);
        const entriesData = res.data;
        const newData = {
          Vanilla: 0,
          Chocolate: 0,
          Jaffa: 0,
          Hazelnut: 0,
          Mint: 0,
          Mango: 0,
          Strawberry: 0,
          Blueberry: 0,
          Raspberry: 0,
          Coffee: 0,
        };
        const keys = Object.keys(entriesData);
        for (let n = 0; n < keys.length; n += 1) {
          const target = entriesData[keys[n]];
          for (let i = 0; i < target.length; i += 1) {
            if (target[i].flavour) {
              newData[target[i].flavour] += 1;
            }
          }
        }
        console.log('created data', newData);
        self.icecreamData = newData;
        self.icecreamLoading = false;
        self.loading = false;
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            self.$router.push('/');
            throw err;
          } else {
            self.$q.notify({
              message: `Unexpected Error (${err.response.status})! Please Reload Page!`,
              icon: 'warning',
              color: 'red',
            });
            throw err;
          }
        } else {
          self.$q.notify({
            message: 'Unexpected Error! Server May be Down!',
            icon: 'warning',
            color: 'red',
          });
          throw err;
        }
      });

    const dateRanges = [];
    const targetDate = new Date();
    for (let i = 0; i < 12; i += 1) {
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
      .post('/flavours/getboxesinrange', dateRanges, {
        headers: {
          Authorization: `Bearer ${self.$store.state.token}`,
        },
      })
      .then((res) => {
        console.log('received boxes response', res);
        const { data } = res;

        const labels = [];
        const totalProductionData = [];
        for (let i = 0; i < data.length; i += 1) {
          const [d, m, y] = data[i].start.split('-');
          const monthString = new Date(`${y}/${m}/${d}`).toLocaleString('default', { month: 'long' });
          labels.push(monthString);
          totalProductionData.push(data[i].boxes);
        }
        console.log('DAT ___ ');
        console.log(totalProductionData, labels);
        self.totalProductionData = totalProductionData.reverse();
        self.totalProductionLabels = labels.reverse();
        self.productionLoading = false;
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            self.$router.push('/');
            throw err;
          } else {
            self.$q.notify({
              message: `Unexpected Error (${err.response.status})! Please Reload Page!`,
              icon: 'warning',
              color: 'red',
            });
            throw err;
          }
        } else {
          self.$q.notify({
            message: 'Unexpected Error! Server May be Down!',
            icon: 'warning',
            color: 'red',
          });
          throw err;
        }
      });
  },
  components: {
    IcecreamFlavourChart,
    TotalProductionChart,
    ProductionDataTable,
  },
});
</script>
