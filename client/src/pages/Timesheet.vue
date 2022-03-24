<template>
  <q-page class="q-pa-md">
    <div class="row full-width justify-center">
      <q-card class="settings-card q-pa-md col-6">
        <q-card-section class="row items-center no-wrap">
          <div class="text-h4 col">
            Timesheet
          </div>
          <div class="col-auto">
            Staff entries for this week.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="bg-grey-2">
          <q-markup-table
            class="no-shadow full-width"
            v-if="!loading"
          >
            <thead>
              <tr>
                <th class="text-left">Staff Name</th>
                <th class="text-right">Date</th>
                <th class="text-right">Start Time</th>
                <th class="text-right">End Time</th>
                <th class="text-right">Break</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(staffEntry) in staffEntries"
                v-bind:key="staffEntry.id"
              >
                <td class="text-left">{{ staffEntry.name }}</td>
                <td class="text-right">{{ formatDateString(staffEntry.productiondate) }}</td>
                <td class="text-right">{{ staffEntry.starttime }}</td>
                <td class="text-right">{{ staffEntry.endtime }}</td>
                <td class="text-right">{{ staffEntry.breaklength }}m</td>
              </tr>
            </tbody>
          </q-markup-table>

          <q-markup-table class="no-shadow full-width" v-if="loading">
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
  </q-page>
</template>

<style lang="scss" media="screen" scoped>
.settings-card {
  width: 80vw;
}

.staff-name-card, .flavour-name-card {
  margin-top: 0;
  margin-bottom: 16px;

  .col {
    margin-top: 0;
  }

  .text-h6 {
    font-weight: normal;
  }
}
</style>

<script>
import { defineComponent } from 'vue';

function getMonday(d = new Date()) {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function getFriday(d = new Date()) {
  const day = d.getDay();
  let diff = 0;
  if (day > 5) { // its the weekend!
    const daysPastFriday = day - 5;
    diff = d.getDate() - daysPastFriday;
  } else { // its a weekday ):
    const daysUntilFriday = 5 - day;
    diff = d.getDate() + daysUntilFriday;
  }
  return new Date(d.setDate(diff));
}

export default defineComponent({
  name: 'PageTimesheet',
  data() {
    return {
      loading: true,
      staffEntries: [{
        id: 0,
        name: 'Bob',
      }],
    };
  },
  created() {
    this.$api
      .post('/staff/getrange', {
        startDate: getMonday(),
        endDate: getFriday(),
      }, {
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
        },
      })
      .then((res) => {
        const { data } = res;
        console.log('received get entries in range res', data);
        this.staffEntries = data;
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
    formatDateString(date) {
      const currentDate = new Date(date);
      const DD = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate();
      const M = currentDate.getMonth() + 1; // account for dates starting at 0
      const MM = M < 10 ? `0${M}` : M;
      const YYYY = currentDate.getFullYear();
      return `${DD}-${MM}-${YYYY}`;
    },
  },
});
</script>
