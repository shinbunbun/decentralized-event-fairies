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
import { AddIcon, LinkIcon, AtSignIcon } from '@chakra-ui/icons';

import { useAuthValue, User } from '../lib';

function Home() {
  return (
    <ChakraLink as={Link} to="/">
      <IconButton icon={<AtSignIcon />} aria-label="Home" variant="link" />
    </ChakraLink>
  );
}

function SignIn() {
  const navigate = useNavigate();

  const onClickSignIn = async () => {
    navigate(`/signin`);
  };
  const onClickSignUp = async () => {
    navigate(`/signup`);
  };

  return (
    <Box>
      <Button fontSize="sm" colorScheme="blue" onClick={onClickSignIn}>
        Sign In
      </Button>
      <Button fontSize="sm" colorScheme="blackAlpha" onClick={onClickSignUp} style={{marginLeft: "5px"}}>
        Sign Up
      </Button>
    </Box>
  );
}

function Verify() {
  return (
    <ChakraLink as={Link} to="/verify">
      <IconButton icon={<LinkIcon />} aria-label="Verify" />
    </ChakraLink>
  );
}

function CreateEvent() {
  return (
    <ChakraLink as={Link} to="/event/create">
      <IconButton icon={<AddIcon />} aria-label="Create event" />
    </ChakraLink>
  );
}

function Account(props: User) {
  const displayName = props.displayName ? props.displayName : undefined;
  const photoURL = props.photoURL ? props.photoURL : undefined;

  // return (
  //   <ChakraLink as={Link} to={`/user/${props.uid}`}>
  //     <Avatar size="md" name={displayName} src={photoURL} />
  //   </ChakraLink>
  // );
  return <Avatar size="md" name={displayName} src={photoURL} />;
}

export function Navbar() {
  const user = useAuthValue();

  return (
    <Box as="header" pb={6}>
      <Box as="nav" boxShadow="base" background="white">
        <Container maxW="container.md">
          <HStack py={2} minH={16}>
            {user === null ? (
              <>
                <Home />
                <Spacer />
                <HStack justify="flex-end" spacing={6}>
                  <SignIn />
                </HStack>
              </>
            ) : (
              <>
                <Home />
                <Spacer />
                <HStack justify="flex-end" spacing={6}>
                  <Verify />
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
