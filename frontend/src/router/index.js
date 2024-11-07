import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import SignIn from '@/components/SignIn.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn,
  }
  /*{
    path: '/:pathMatch(.*)*', 
    name: 'NotFound',
    component: SignIn, 
  },*/
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken');

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (isAuthenticated) {
      next(); 
    } else {
      next({ name: 'SignIn' }); 
    }
  }
  
  else if (to.name === 'SignIn' && isAuthenticated) {
    next({ name: 'Home' });
  }
  else {
    next();
  }
});

export default router;
