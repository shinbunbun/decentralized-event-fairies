import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { Layout } from './components/Layout';

const EventCreatePage = lazy(() => import('./pages/EventCreatePage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const EventUpdatePage = lazy(() => import('./pages/EventUpdatePage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const VerifyPage = lazy(() => import('./pages/VerifyPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'event/create',
        element: <EventCreatePage />,
      },
      {
        path: 'event/:eventId',
        element: <EventDetailPage />,
      },
      {
        path: 'event/:eventId/update',
        element: <EventUpdatePage />,
      },
      {
        path: 'user/:userId',
        element: <UserProfilePage />,
      },
      {
        path: 'verify',
        element: <VerifyPage />,
      },
    ],
  },
]);
