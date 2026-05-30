/**
 * Link Hub - Routes Configuration
 * Define all application routes here
 */

import Home from '../pages/Home'
import AdminLogin from '../pages/AdminLogin'
import AdminDashboard from '../pages/AdminDashboard'

export const routes = [
  {
    path: '/',
    element: Home,
    title: 'Dashboard',
    description: 'User Dashboard'
  },
  {
    path: '/admin',
    element: AdminLogin,
    title: 'Admin Login',
    description: 'Admin Login Page',
    isAdmin: true
  },
  {
    path: '/admin/dashboard',
    element: AdminDashboard,
    title: 'Admin Dashboard',
    description: 'Admin Dashboard',
    isAdmin: true,
    requiresAuth: true
  }
]

export default routes
