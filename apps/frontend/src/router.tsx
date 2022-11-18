import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { Layout } from './components/Layout';

const HomePage = lazy(() => import('./pages/HomePage'));
const EventCreatePage = lazy(() => import('./pages/EventCreatePage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const EventUpdatePage = lazy(() => import('./pages/EventUpdatePage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const VerifyPage = lazy(() => import('./pages/VerifyPage'));
const DIDTestPage = lazy(() => import('./pages/DIDTestPage'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
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
      {
        path: 'did-test',
        element: <DIDTestPage />,
      },
      {
        path: 'signin',
        element: <SignInPage />,
      },
      {
        path: 'signup',
        element: <SignUpPage />,
      },
    ],
  },
]);
