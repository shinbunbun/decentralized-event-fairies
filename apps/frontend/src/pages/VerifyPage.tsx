import { useState } from 'react';
import {
  Box,
  Textarea,
  VStack,
  FormControl,
  FormLabel,
  Button,
} from '@chakra-ui/react';

import { verify } from '../lib';

function VerifyPage() {
  const [vps, setVPs] = useState('');
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    await verify(vps);
    setLoading(false);
  }

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
          <FormControl>
            <FormLabel>VPs</FormLabel>
            <Textarea
              value={vps}
              onChange={(ev) => setVPs(ev.target.value)}
            />
          </FormControl>

          <Button onClick={onClick} isLoading={loading}>検証</Button>
        </VStack>
      </Box>
    </Box>
  );
}

export default VerifyPage;
