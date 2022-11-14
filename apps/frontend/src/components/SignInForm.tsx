import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Input,
  VStack,
  FormControl,
  FormLabel,
  Button,
  Divider,
  Heading,
} from '@chakra-ui/react';

import { signInWithSIOP } from '../lib';

export function SignInForm() {
  const [privateKey, setPrivateKey] = useState('');
  const [did, setDid] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signIn = async () => {
    setLoading(true);
    await signInWithSIOP(privateKey, did);
    setLoading(false);
  };

  return (
    <Box
      boxShadow="base"
      borderRadius="md"
      overflow="hidden"
      p={6}
      background="white"
    >
      <VStack spacing={6}>
        <Heading>Sign In</Heading>

        <Divider />

        <FormControl>
          <FormLabel>Private Key</FormLabel>
          <Input
            type="text"
            value={privateKey}
            onChange={(ev) => setPrivateKey(ev.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>DID</FormLabel>
          <Input
            type="text"
            value={did}
            onChange={(ev) => setDid(ev.target.value)}
          />
        </FormControl>

        <Divider />

        <Button colorScheme="blue" isLoading={loading} onClick={() => signIn()}>
          Sign In
        </Button>
      </VStack>
    </Box>
  );
}
