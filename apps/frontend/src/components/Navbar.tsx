import { Link } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  HStack,
  Container,
  Spacer,
  IconButton,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

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

function CreateEvent() {
  return (
    <ChakraLink as={Link} to="/event/create">
      <IconButton icon={<AddIcon />} aria-label="Create event" variant="link" />
    </ChakraLink>
  );
}

function Account() {
  return (
    <ChakraLink as={Link} to="/user/me">
      <Avatar size="md" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
    </ChakraLink>
  );
}

export function Navbar() {
  const loggedIn = true;

  return (
    <Box as="header" pb={6}>
      <Box as="nav" boxShadow="base" background="white">
        <Container maxW="container.md">
          <HStack py={2} minH={16}>
            {loggedIn ? (
              <>
                <Spacer />
                <HStack justify="flex-end" spacing={6}>
                  <CreateEvent />
                  <Account />
                </HStack>
              </>
            ) : (
              <>
                <Spacer />
                <HStack justify="flex-end" spacing={6}>
                  <SignIn />
                  <SignUp />
                </HStack>
              </>
            )}
          </HStack>
        </Container>
      </Box>
    </Box>
  );
}
