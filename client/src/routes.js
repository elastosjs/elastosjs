import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const DatabaseView = React.lazy(() => import('./views/Database'));
const AccountView = React.lazy(() => import('./views/Account'));

const routes = [
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/databases', name: 'Databases', component: DatabaseView },
  { path: '/account', name: 'Account', component: AccountView }
  /*
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
  */
];

export default routes;
