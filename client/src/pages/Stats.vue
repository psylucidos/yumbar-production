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

      <div class="col-12">
        <ProductionDataTable />
      </div>

      <div class="col-6">
        <SlabsChart />
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
