import { createBrowserRouter } from 'react-router-dom'
import RequireAuth from './components/requireAuth'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import OrdersPage from './pages/orders'
import ProductsPage from '@/pages/products'
import DeliveryPricingPage from './pages/deliveryPricing'
import LoginComponent from './pages/auth/sign-in-2'
import AppShell from './components/app-shell'
import CategoriesPage from './pages/categories'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginComponent />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        element: <OrdersPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'deliverypricing',
        element: <DeliveryPricingPage />,
      },
      {
        path: 'categories',
        element: <CategoriesPage />,
      },
    ],
  },

  // Error routes
  { path: '/500', element: <GeneralError /> },
  { path: '/404', element: <NotFoundError /> },
  { path: '/503', element: <MaintenanceError /> },

  // Fallback 404 route
  { path: '*', element: <NotFoundError /> },
])

export default router
