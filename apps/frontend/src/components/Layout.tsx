import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from '@chakra-ui/react';

import { Navbar } from './Navbar';
import { Loading } from './Loading';

export function Layout() {
  return (
    <>
      <Navbar />
      <Container maxW="container.md">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </Container>
    </>
  );
}
