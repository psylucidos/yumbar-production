<template>
  <q-page class="flex flex-center">
    <q-card class="settings-card">
      <div class="text-h4">
        Settings
      </div>
    </q-card>
  </q-page>
</template>

<style lang="scss" media="screen" scoped>
.settings-card {
  width: 80vw;
  min-height: calc(100vh - 50px);
}
</style>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageSettings',
});
</script>
