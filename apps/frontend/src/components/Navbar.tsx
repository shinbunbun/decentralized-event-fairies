import { Box, Button, HStack, Container, Spacer } from '@chakra-ui/react';

function SignIn() {
  return (
    <Button fontSize="sm" variant="link">
      Sign In
    </Button>
  );
}

function SignUp() {
  return (
    <Button fontSize="sm" colorScheme="blue">
      Sign Up
    </Button>
  );
}

export function Navbar() {
  return (
    <Box as="header" pb={6}>
      <Box as="nav" boxShadow="base" background="white">
        <Container maxW="container.md">
          <HStack py={2}>
            <Spacer />
            <HStack justify="flex-end" spacing={6}>
              <SignIn />
              <SignUp />
            </HStack>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
}
