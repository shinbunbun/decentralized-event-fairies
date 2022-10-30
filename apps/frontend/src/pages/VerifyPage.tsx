import { useState } from 'react';
import {
  Box,
  Textarea,
  VStack,
  FormControl,
  FormLabel,
  Button,
  Heading,
  Divider,
  useToast,
} from '@chakra-ui/react';

import { verify } from '../lib';

function VerifyPage() {
  const toast = useToast();
  const [vps, setVPs] = useState('');
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    try {
      await verify(vps);
      toast({
        title: '検証成功!',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } catch {
      toast({
        title: '検証失敗!',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <Box pb={6}>
      <Box
        boxShadow="base"
        borderRadius="md"
        overflow="hidden"
        p={6}
        background="white"
      >
        <VStack spacing={4}>
          <Heading>Verifiable Credentialsの検証</Heading>
          <Divider />
          <FormControl>
            <FormLabel>Verifiable Presentation</FormLabel>
            <Textarea value={vps} onChange={(ev) => setVPs(ev.target.value)} />
          </FormControl>
          <Divider />
          <Button onClick={onClick} isLoading={loading}>
            検証
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

export default VerifyPage;
