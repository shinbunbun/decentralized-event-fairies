import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { User } from 'firebase/auth';

import { useAuthState, signIn } from '../lib';

function SignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onClick = async () => {
    setLoading(true);
    const result = await signIn();
    navigate(`/user/${result.user.uid}`);
    setLoading(false);
  };

  return (
    <Button
      fontSize="sm"
      colorScheme="blue"
      isLoading={loading}
      onClick={onClick}
    >
      Sign In
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

function Account(props: User) {
  const displayName = props.displayName ? props.displayName : undefined;
  const photoURL = props.photoURL ? props.photoURL : undefined;

  return (
    <ChakraLink as={Link} to={`/user/${props.uid}`}>
      <Avatar size="md" name={displayName} src={photoURL} />
    </ChakraLink>
  );
}

export function Navbar() {
  const user = useAuthState();

  return (
    <Box as="header" pb={6}>
      <Box as="nav" boxShadow="base" background="white">
        <Container maxW="container.md">
          <HStack py={2} minH={16}>
            {user === null ? (
              <>
                <Spacer />
                <HStack justify="flex-end" spacing={6}>
                  <SignIn />
                </HStack>
              </>
            ) : (
              <>
                <Spacer />
                <HStack justify="flex-end" spacing={6}>
                  <CreateEvent />
                  <Account {...user} />
                </HStack>
              </>
            )}
          </HStack>
        </Container>
      </Box>
    </Box>
  );
}
