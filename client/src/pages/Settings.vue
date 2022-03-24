<template>
  <q-page class="q-pa-md">
    <div class="row full-width justify-center">
      <q-card class="settings-card q-pa-md col-6">
        <q-card-section class="row">
          <div class="text-h4">
            Staff Names
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section
          class="bg-grey-2 row staff-names-container"
          v-if="!loading"
        >
          <q-card
            v-for="(staffMember, index) in staffNames"
            v-bind:key="staffMember.id"
            class="row full-width q-gutter-md items-center no-wrap staff-name-card"
          >
            <div class="col">
              <div class="text-h6">{{ staffMember.name }}</div>
            </div>

            <div class="col col-auto">
              <q-btn
                flat
                round
                icon="delete"
                @click="deleteStaffName(index)"
              />
            </div>
          </q-card>

          <q-btn
            icon="add"
            id="add-staff-btn"
            label="Add Staff Member"
            class="full-width"
            color="primary"
            @click="showAddStaffPrompt"
          />
        </q-card-section>

        <q-card-section class="row">
          <div class="text-h4">
            Flavour Names
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section
          class="bg-grey-2 row flavour-names-container"
          v-if="!loading"
        >
          <q-card
            v-for="(flavour, index) in flavourNames"
            v-bind:key="flavour.id"
            class="row full-width items-center no-wrap q-gutter-md flavour-name-card"
          >
            <div class="col pad-right">
              <div class="text-h6">{{ flavour.name }}</div>
            </div>

            <div class="col col-auto">
              <q-btn
                flat
                round
                icon="delete"
                @click="deleteFlavourName(index)"
              />
            </div>
          </q-card>

          <q-btn
            icon="add"
            id="add-flavour-btn"
            label="Add Flavour"
            class="full-width"
            color="primary"
            @click="showAddFlavourPrompt"
          />
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

export default defineComponent({
  name: 'PageSettings',
  data() {
    return {
      loading: true,
      staffNames: [{
        id: 0,
        name: 'Bob',
      }],
      flavourNames: [{
        id: 0,
        name: 'caramel',
      }],
    };
  },
  created() {
    this.$api
      .get('/settings/get/flavours', {
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
        },
      })
      .then((res) => {
        const { data } = res;
        console.log('received settings res', data);
        this.flavourNames = data;
        this.loading = false;
      })
      .catch(this.handlePostErr);

    this.$api
      .get('/settings/get/staff', {
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
        },
      })
      .then((res) => {
        const { data } = res;
        this.staffNames = data;
      })
      .catch(this.handlePostErr);
  },
  methods: {
    showAddStaffPrompt() {
      this.$q.dialog({
        title: 'Add Staff Member',
        prompt: {
          type: 'text',
          placeholder: 'Name of New Staff Member',
        },
        cancel: true,
        persistent: true,
      }).onOk((data) => {
        this.addStaffName(data);
      });
    },
    addStaffName(name) {
      this.$api
        .post('/settings/add/staff', {
          name,
        }, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        })
        .then((res) => {
          const { data } = res;
          this.staffNames.push(data);
        })
        .catch(this.handlePostErr);
    },
    showAddFlavourPrompt() {
      this.$q.dialog({
        title: 'Add New Flavour',
        prompt: {
          type: 'text',
          placeholder: 'Name of New Flavour',
        },
        cancel: true,
        persistent: true,
      }).onOk((data) => {
        this.addFlavourName(data);
      });
    },
    addFlavourName(name) {
      this.$api
        .post('/settings/add/flavour', {
          name,
        }, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        })
        .then((res) => {
          const { data } = res;
          this.flavourNames.push(data);
        })
        .catch(this.handlePostErr);
    },
    deleteStaffName(index) {
      this.$api
        .post('/settings/delete/staff', {
          id: String(this.staffNames[index].id),
        }, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        })
        .then(() => {
          this.staffNames.splice(index, 1);
        })
        .catch(this.handlePostErr);
    },
    deleteFlavourName(index) {
      this.$api
        .post('/settings/delete/flavour', {
          id: String(this.flavourNames[index].id),
        }, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        })
        .then(() => {
          this.flavourNames.splice(index, 1);
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
