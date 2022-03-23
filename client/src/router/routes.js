const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'data', component: () => import('pages/Data.vue') },
      { path: 'stats', component: () => import('pages/Stats.vue') },
      { path: 'timesheet', component: () => import('pages/Timesheet.vue') },
      { path: 'settings', component: () => import('pages/Settings.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
