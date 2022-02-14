<template>
  <q-page class="flex flex-center">
    <q-card class="data-card">
      <q-form
        @submit="onUpdate"
        class="q-pa-md"
      >
        <div class="text-h4">Data Entry</div>
        <q-select v-model="mode" :options="options" label="Production Type" />
        <q-input
          v-model="val2"
          type="password"
          label="Password"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-btn label="Submit" class="full-width" type="submit" color="primary"/>
      </q-form>
    </q-card>
  </q-page>
</template>

<style media="screen" lang="scss" scoped>
  .data-card {
    width: 60vw;
    min-height: calc(100vh - 50px);
  }

  @media only screen and (max-width: 600px) {
    .data-card {
      width: 100%;
    }
  }
</style>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageData',
  data() {
    return {
      val1: '',
      val2: '',
      mode: 'Packing',
      options: ['Packing', 'Cutting'],
    };
  },
  methods: {
    onUpdate() {
      console.log('Update data!'); // eslint-ignore-line
    },
  },
});
</script>
