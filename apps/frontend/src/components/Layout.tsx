import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from '@chakra-ui/react';

import { Navbar } from './Navbar';

export function Layout() {
  return (
    <>
      <Navbar />
      <Container maxW="container.md">
        <Suspense fallback={<p>Loading...</p>}>
          <Outlet />
        </Suspense>
      </Container>
    </>
  );
}
