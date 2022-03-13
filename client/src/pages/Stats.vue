<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-md">
      <div class="col-6">
        <q-card>
          <q-card-section class="title-section">
            <div v-if="!loading" class="text-h6">Ice Cream Flavor Distribution</div>
            <q-skeleton v-if="loading" width="300px" type="text" class="text-h6" />
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            <IcecreamFlavourChart v-if="!loading" :data="icecreamData" />
            <q-skeleton v-if="loading" height="400px" square />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6">
        <q-card class="text-h6">
          <q-card-section class="title-section">
            <div v-if="!loading" class="text-h6">Ice Cream Production</div>
            <q-skeleton v-if="loading" width="300px" type="text" class="text-h6" />
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            <TotalProductionChart v-if="!loading" />
            <q-skeleton v-if="loading" height="400px" square />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-5">
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

export default defineComponent({
  name: 'PageStats',
  data() {
    return {
      loading: true,
      icecreamData: '',
    };
  },
  mounted() {
    const self = this;
    this.$api
      .post('/flavours/getall', {}, {
        headers: {
          Authorization: `Bearer ${self.$store.state.token}`,
        },
      })
      .then((flavoursRes) => {
        console.log('received flavours response', flavoursRes);
        const entriesData = flavoursRes.data;
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
  },
  components: {
    IcecreamFlavourChart,
    TotalProductionChart,
    ProductionDataTable,
  },
});
</script>
