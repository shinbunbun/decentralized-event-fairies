import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { Layout } from './components/Layout';

const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'event/:eventId',
        element: <EventDetailPage />,
      },
      {
        path: 'user/:userId',
        element: <UserProfilePage />,
      },
    ],
  },
]);
