import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Button,
  Divider,
  Heading,
  Text,
} from '@chakra-ui/react';

import { createDID, createKeyPair, signInWithSIOP, useAuthState } from '../lib';

export function SignUpForm() {
  const [privateKey, setPrivateKey] = useState('');
  const [did, setDid] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [auth, setAuth] = useAuthState();

  const [isDisabledSignUp, setIsDisabledSignUp] = useState(true);

  const [isDisabledCreateAccount, setIsDisabledCreateAccount] = useState(false);

  const signUp = async () => {
    setLoading(true);
    const jwt = await signInWithSIOP(privateKey, did, true);
    setAuth(jwt);
    setLoading(false);
    navigate('/');
  };

  const createAccount = async () => {
    setIsDisabledCreateAccount(true);

    setLoading(true);

    const key = await createKeyPair();
    setPrivateKey(Buffer.from(key.private()).toString("hex"));

    const didDoc = await createDID(key);
    setDid(didDoc.id().toString());

    setIsDisabledSignUp(false);
    setIsDisabledCreateAccount(true);
    setLoading(false);
  }

  return (
    <Box
      boxShadow="base"
      borderRadius="md"
      overflow="hidden"
      p={6}
      background="white"
    >
      <VStack spacing={6}>
        <Heading>Create Account</Heading>

        <Button colorScheme="blue" isLoading={loading} onClick={() => createAccount()} disabled={isDisabledCreateAccount}>
          Create Account
        </Button>

        <Divider />

        <Heading size={"md"}>※以下の情報は大切に保管してください</Heading>

        <Heading size={"md"}>PrivateKey</Heading>
        <Text>{privateKey}</Text>

        <Heading size={"md"}>DID</Heading>
        <Text>{did}</Text>

        <Divider />

        <Button colorScheme="blue" isLoading={loading} onClick={() => signUp()} disabled={isDisabledSignUp}>
          Sign Up
        </Button>
      </VStack>
    </Box>
  );
}
