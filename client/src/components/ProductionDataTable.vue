<template lang="html">
  <q-card class="text-h6">
    <q-card-section class="title-section row">
      <div
        class="col text-h6"
        v-if="!loading"
      >
        Production Data Table
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
      <div class="col-2">
        <q-select
          dense
          label="Months"
          v-if="!loading"
          v-model="timePeriod"
          :options="timePeriodOptions"
          @update:model-value="renderData"
        />
      </div>
    </q-card-section>

    <q-separator inset />

    <q-card-section>
      <q-markup-table class="no-shadow" v-if="!loading">
        <thead>
          <tr v-if="productionType === 'Packing Day'">
            <th class="text-left">Production Date</th>
            <th class="text-right">Batch #</th>
            <th class="text-right">Slab Amount</th>
            <th class="text-right">Box Amount</th>
            <th class="text-right">Leftover Bar Amount</th>
          </tr>

          <tr v-if="productionType === 'Cutting Day'">
            <th class="text-left">Production Date</th>
            <th class="text-right">Slab Batch #</th>
            <th class="text-right">Base Batch #</th>
            <th class="text-right">Slab Amount</th>
          </tr>

          <tr v-if="productionType === 'Base Day'">
            <th class="text-left">Production Date</th>
            <th class="text-right">Batch #</th>
            <th class="text-right">Blender Amount</th>
            <th class="text-right">Small Base Amount</th>
            <th class="text-right">Large Base Amount</th>
            <th class="text-right">Small Cake Amount</th>
            <th class="text-right">Medium Cake Amount</th>
            <th class="text-right">Large Cake Amount</th>
          </tr>

          <tr v-if="productionType === 'Ice Cream Day'">
            <th class="text-left">Production Date</th>
            <th class="text-right">Batch #</th>
            <th class="text-right">Jugs Amount</th>
            <th class="text-right">Trays Amount</th>
            <th class="text-right">Unsaleable Weight (g)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(date, i) in tableData" to="" v-bind:key="i">
              <td
                v-for="(value, i) in Object.values(date)"
                v-bind:key="i"
                :class="i === 0 ? 'text-left' : 'text-right'"
              >
                <router-link class="table-link" v-if="i === 0" :to="`/data/${date.productiondate}`">
                  <span>{{ value }}</span>
                </router-link>
                <span v-if="i !== 0">{{ value }}</span>
              </td>
          </tr>
          <tr class="bg-grey-1">
            <td
              v-for="(value, i) in tableTotals"
              v-bind:key="i"
              :class="i === 0 ? 'text-left' : 'text-right'"
            >{{ value }}</td>
          </tr>
        </tbody>
      </q-markup-table>

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
</template>

<style scoped lang="scss" media="screen">
.title-section {
  padding-bottom: 0;
}

.table-link {
  color: $primary;
  text-decoration: none;
}
</style>

<script>
import { defineComponent } from 'vue';

function prettifyDate(targetDate) {
  const DD = targetDate.getDate() < 10 ? `0${targetDate.getDate()}` : targetDate.getDate();
  const M = targetDate.getMonth() + 1; // account for dates starting at 0
  const MM = M < 10 ? `0${M}` : M;
  const YYYY = targetDate.getFullYear();
  return `${DD}-${MM}-${YYYY}`;
}

export default defineComponent({
  name: 'ProductionDataTable',
  data() {
    return {
      loading: true,
      productionType: 'Packing Day',
      options: ['Packing Day', 'Cutting Day', 'Base Day', 'Ice Cream Day'],
      timePeriod: 1,
      timePeriodOptions: [1, 2, 3, 6, 12, 24],
      tableData: [],
      tableTotals: [],
    };
  },
  created() {
    this.renderData();
  },
  methods: {
    renderData() {
      this.loading = true;
      // get last of current month
      const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      // go back time period months
      const intermediateDate = new Date(endDate);
      intermediateDate.setMonth(intermediateDate.getMonth() - this.timePeriod);
      // get first day of intermediateDate
      const startDate = new Date(intermediateDate.getFullYear(), intermediateDate.getMonth(), 1);

      console.log('start date & end date', startDate, endDate);

      this.$api
        .post('/flavours/getinrange', {
          startDate: prettifyDate(startDate),
          endDate: prettifyDate(endDate),
          productionType: this.productionType,
        }, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        })
        .then((res) => {
          console.log('data table res', res);
          const { data } = res;

          this.tableTotals = [];
          for (let i = 0; i < data.length; i += 1) {
            if (data[i].productiondate) {
              data[i].productiondate = prettifyDate(new Date(data[i].productiondate));
            }
            if (data[i].batchnumber) {
              data[i].batchnumber = Math.floor(data[i].batchnumber);
            }
            if (data[i].slabbatch) {
              data[i].slabbatch = Math.floor(data[i].slabbatch);
            }
            if (data[i].basebatch) {
              data[i].basebatch = Math.floor(data[i].basebatch);
            }
            const values = Object.values(data[i]);
            const keys = Object.keys(data[i]);
            console.log('values', values);
            for (let n = 0; n < values.length; n += 1) {
              if (Number.isNaN(Number(values[n]))) {
                this.tableTotals[n] = '-';
              } else if (keys[n].indexOf('batch') > -1) {
                this.tableTotals[n] = '-';
              } else if (this.tableTotals[n] === undefined) {
                this.tableTotals[n] = Number(values[n]);
              } else {
                this.tableTotals[n] += Number(values[n]);
              }
            }
          }
          this.tableTotals[0] = 'Totals:';
          this.tableData = res.data.reverse();
          this.loading = false;
        })
        .catch(this.handlePostErr);
    },
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
