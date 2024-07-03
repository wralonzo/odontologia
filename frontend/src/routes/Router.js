import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ProtectedRoute from './ProtectedRoute';

/* ****Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));
/* ****** */

/* ****Pages**** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')))
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
/* ****** */

/* ****Usuarios y Pacientes**** */
const UserList = Loadable(lazy(() => import('../views/management/user/UserList')));
const ModificationCreationUser = Loadable(lazy(() => import('../views/management/user/ModificationCreationUser')));
/* ****** */

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/auth/login" /> },
      {
        path: '/dashboard',
        exact: true,
        element: (<ProtectedRoute> <Dashboard /> </ProtectedRoute>)
      },
      {
        path: '/users',
        exact: true,
        element: (<ProtectedRoute> <UserList /> </ProtectedRoute>)
      },
      {
        path: '/ui/create-user',
        exact: true,
        element: (<ProtectedRoute> <ModificationCreationUser /> </ProtectedRoute>)
      },
      {
        path: '/ui/update-user/:id',
        exact: true,
        element: (<ProtectedRoute> <ModificationCreationUser /> </ProtectedRoute>)
      },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '/auth/login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;