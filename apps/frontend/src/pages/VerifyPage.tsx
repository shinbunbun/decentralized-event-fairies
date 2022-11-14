import { useState } from 'react';
import * as identity from '@iota/identity-wasm/web';
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

const verify = async (vp_json: string, challenge: string) => {
  const vp = identity.Presentation.fromJSON(JSON.parse(vp_json));

  const presentationVerifierOptions = new identity.VerifierOptions({
    challenge,
  });

  const subjectHolderRelationship =
    identity.SubjectHolderRelationship.AlwaysSubject;

  const presentationValidationOptions =
    new identity.PresentationValidationOptions({
      presentationVerifierOptions: presentationVerifierOptions,
      subjectHolderRelationship: subjectHolderRelationship,
    });

  const resolver = new identity.Resolver();

  try {
    await resolver.verifyPresentation(
      vp,
      presentationValidationOptions,
      identity.FailFast.FirstError
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

function VerifyPage() {
  const toast = useToast();
  const [vp, setVP] = useState('');
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    await identity.init();
    console.log(JSON.parse(vp));
    try {
      const result = await verify(vp, 'challenge');
      if (result) {
        toast({
          title: '検証成功!',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      } else {
        throw new Error('検証失敗');
      }
    } catch (err) {
      console.log(err);
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
          <Heading>参加証明の検証</Heading>
          <Divider />
          <FormControl>
            <FormLabel>Verifiable Presentation</FormLabel>
            <Textarea value={vp} onChange={(ev) => setVP(ev.target.value)} />
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
