import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import MainLayout from '@/layouts/MainLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

import Login from '@/pages/Login.vue';
import Dashboard from '@/pages/Dashboard.vue';
import Candidate from '@/pages/Candidate.vue';
import Vote from '@/pages/Vote.vue';
import Result from '@/pages/Result.vue';
import Registration from '@/pages/Registration.vue';
import Student from '@/pages/Student.vue';
import Users from '@/pages/Users.vue';
import Profile from '@/pages/Profile.vue';

const routes = [
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: '',
        redirect: '/login',
      },
      {
        path: 'login',
        name: 'Login',
        component: Login,
        meta: { guestOnly: true },
      },
    ],
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'candidate',
        name: 'Candidate',
        component: Candidate,
      },
      {
        path: 'vote',
        name: 'Vote',
        component: Vote,
        meta: { roles: ['siswa', 'calon_ketua', 'calon_anggota'] },
      },
      {
        path: 'result',
        name: 'Result',
        component: Result,
      },
      {
        path: 'registration',
        name: 'Registration',
        component: Registration,
      },
      {
        path: 'student',
        name: 'Student',
        component: Student,
        meta: { roles: ['admin', 'superadmin', 'pembina', 'kepala_sekolah'] },
      },
      {
        path: 'users',
        name: 'Users',
        component: Users,
        meta: { roles: ['admin', 'superadmin'] },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login');
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next('/dashboard');
  }

  if (to.meta.roles && !to.meta.roles.includes(authStore.role)) {
    return next('/dashboard');
  }

  next();
});

export default router;
