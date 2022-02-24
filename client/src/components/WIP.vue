<template>
  <div class="wip-message">
    <q-icon name="warning" class="text-primary fixed-center" style="font-size: 8rem;" />
    <h4>Work in Progress...</h4>
  </div>
</template>

<style media="screen" lang="scss" scoped>
  h4 {
    margin-top: 15vh;
  }
</style>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'WIP',
});
</script>
