<template>
  <q-card class="auth-card">
    <div class="text-h5 text-center">
      Login
    </div>
    <div class="">
      <q-form
        @submit="onSubmit"
        class="q-pa-md"
      >
        <q-input
          v-model="username"
          label="Username"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-input
          v-model="password"
          type="password"
          label="Password"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-btn label="Submit" class="full-width" type="submit" color="primary"/>
      </q-form>
    </div>
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
    };
  },
  methods: {
    onSubmit() {
      console.log(this.username, this.password); //eslint-disable-line
      this.$router.push('/data');
    },
  },
});
</script>
