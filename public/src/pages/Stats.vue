<template>
  <q-page class="flex flex-center">
    <WIPComponent />
  </q-page>
</template>

<script>
import WIPComponent from 'components/WIP.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageStats',
  components: {
    WIPComponent,
  },
});
</script>
