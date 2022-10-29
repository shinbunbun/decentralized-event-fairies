import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { Layout } from './components/Layout';

const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'event/:eventId',
        element: <EventDetailPage />,
      },
    ],
  },
]);
