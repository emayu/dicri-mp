import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import ExpedientesPage from './pages/expedientes';
import ExpedienteDetallePage from './pages/expedienteDetalle';
import ExpedienteNuevoPage from './pages/expedienteNuevo';
import SignInPage from './pages/signIn';
import NotFoundPage from './pages//NotFoundPage';

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '/',
            Component: DashboardPage,
          },
          {
            path: '/expedientes',
            Component: ExpedientesPage,
          },
          {
            path: '/expedientes/nuevo',
            Component: ExpedienteNuevoPage,
          },
          {
            path: '/expedientes/:id',
            Component: ExpedienteDetallePage,
          },
        ],
      },
      {
        path: '/sign-in',
        Component: SignInPage,
      },
      {
        path: '*',
        Component: NotFoundPage,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
