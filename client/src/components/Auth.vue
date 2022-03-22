<template>
  <q-card class="auth-card">
    <div class="text-h5 text-center">
      Login
    </div>
    <div>
      <q-form
        @submit="onSubmit"
        class="q-pa-md"
      >
        <q-input
          v-model="username"
          label="Username"
          :disable="underMaintenance"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-input
          v-model="password"
          type="password"
          label="Password"
          :disable="underMaintenance"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-btn
          label="Submit"
          :disable="underMaintenance"
          class="full-width"
          type="submit"
          color="primary"
        />
      </q-form>
    </div>
    <q-item
      v-if="underMaintenance"
      class="bg-orange rounded-borders text-white"
    >
      <q-item-section avatar>
        <q-icon color="primary" name="warning" />
      </q-item-section>

      <q-item-section>Application currently under maintenance, please try again later.</q-item-section>
    </q-item>
  </q-card>
</template>

<style media="screen" lang="scss" scoped>
  .auth-card {
    padding: 2vh;
    width: 30vw;
  }

  @media only screen and (max-width: 600px) {
    .auth-card {
      width: 60vw;
    }
  }
</style>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Auth',
  data() {
    return {
      username: '',
      password: '',
      underMaintenance: false,
    };
  },
  methods: {
    onSubmit() {
      console.log(this.username, this.password); //eslint-disable-line
      const self = this;
      this.$api
        .post('/auth/login', {
          username: String(self.username),
          password: String(self.password),
        }, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.token) {
            this.$store.commit('setToken', res.data.token);
            this.$router.push('/data');
          } else {
            throw new Error('No token!');
          }
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              self.$q.notify({
                message: 'Incorrect Credentials!',
                icon: 'warning',
                color: 'red',
              });
            }
          }
          console.error(err);
        });
    },
  },
});
</script>
