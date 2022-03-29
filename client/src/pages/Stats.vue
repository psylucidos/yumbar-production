<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-6">
        <IcecreamFlavourChart />
      </div>

      <div class="col-6">
        <PackingChart />
      </div>

      <div class="col-6">
        <IcecreamChart />
      </div>

      <div class="col-6">
        <BasesChart />
      </div>

      <div class="col-6">
        <SlabsChart />
      </div>

      <div class="col-6">
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

<script>
import IcecreamFlavourChart from 'components/IcecreamFlavourChart.vue';
import PackingChart from 'components/PackingChart.vue';
import ProductionDataTable from 'components/ProductionDataTable.vue';
import IcecreamChart from 'components/IcecreamChart.vue';
import BasesChart from 'components/BasesChart.vue';
import SlabsChart from 'components/SlabsChart.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageStats',
  data() {
    return {
      loading: true,
      icecreamData: [],
      icecreamLoading: true,
    };
  },
  components: {
    IcecreamFlavourChart,
    PackingChart,
    ProductionDataTable,
    IcecreamChart,
    BasesChart,
    SlabsChart,
  },
});
</script>
