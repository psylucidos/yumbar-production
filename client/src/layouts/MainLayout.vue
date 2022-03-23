<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Yumbar Production
        </q-toolbar-title>

        <div>
          <q-tabs align="left">
            <q-route-tab to="/data" label="Data Entry" />
            <q-route-tab to="/stats" label="Stats" />
            <q-route-tab to="/timesheet" label="Timesheet" />
            <q-route-tab to="/settings" icon="settings" />
          </q-tabs>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',
});
</script>
