import { Spinner, Center } from '@chakra-ui/react';

export function Loading() {
  return (
    <Center>
      <Spinner size="xl" />
    </Center>
  );
}
