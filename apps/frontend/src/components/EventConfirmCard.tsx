import { useState } from 'react';
import {
  Box,
  Input,
  VStack,
  FormControl,
  FormLabel,
  Button,
  Code,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { EventData, useAuthValue } from '../lib';
import * as identity from '@iota/identity-wasm/web';

const fromHexString = (hexString: string) => {
  const x = hexString.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16));
  return x ? new Uint8Array(x) : new Uint8Array();
};

const createVC = async (
  private_key: Uint8Array,
  subject_json: string,
  issuer_did: string
) => {
  const resolver = new identity.Resolver();
  const issuer_doc = (await resolver.resolve(issuer_did)).document();

  const unsignedVc = new identity.Credential({
    type: 'EventParticipationProofCredential',
    issuer: issuer_doc.id(),
    credentialSubject: JSON.parse(subject_json),
  });

  const signedVC = issuer_doc.signCredential(
    unsignedVc,
    private_key,
    '#sign-0',
    identity.ProofOptions.default()
  );

  return signedVC;
};

const createVP = async (
  private_key: Uint8Array,
  vc_json: string,
  challenge: string
) => {
  const client = new identity.Client();

  const vc = identity.Credential.fromJSON(vc_json);
  const did = vc.credentialSubject()[0].id;
  if (!did) {
    throw new Error('No DID found in credential');
  }
  const doc = identity.Document.fromJSON(await client.resolve(did));

  const unsignedVP = new identity.Presentation({
    holder: doc.id(),
    verifiableCredential: vc,
  });

  const signedVP = doc.signPresentation(
    unsignedVP,
    private_key,
    '#sign-0',
    new identity.ProofOptions({ challenge })
  );

  return signedVP;
};

export function EventConfirmCard(props: EventData) {
  const [myPrivateKey, setMyPrivateKey] = useState('');
  const [targetDID, setTargetDID] = useState('');
  const [vp, setVP] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuthValue();

  const confirm = async () => {
    if (auth) {
      setLoading(true);

      await identity.init();
      const privateKey = fromHexString(myPrivateKey);

      const vc = await createVC(
        privateKey,
        JSON.stringify({
          id: targetDID,
        }),
        auth.did
      );
      console.log(vc.toJSON());

      const vp = await createVP(privateKey, vc.toJSON(), 'challenge');
      console.log(vp.toJSON());

      setVP(JSON.stringify(vp.toJSON(), null, 2));

      setLoading(false);
    }
  };

  if (auth && props.admins.includes(auth.did)) {
    return (
      <Box pb={6}>
        <Box
          boxShadow="base"
          borderRadius="md"
          overflow="hidden"
          p={6}
          background="white"
        >
          <VStack spacing={6}>
            <Heading size="sm">参加証明の発行</Heading>

            <FormControl>
              <FormLabel>自分の秘密鍵</FormLabel>
              <Input
                type="text"
                value={myPrivateKey}
                onChange={(ev) => setMyPrivateKey(ev.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>参加者のDID</FormLabel>
              <Input
                type="text"
                value={targetDID}
                onChange={(ev) => setTargetDID(ev.target.value)}
              />
            </FormControl>

            <Button
              colorScheme="blue"
              isLoading={loading}
              onClick={() => confirm()}
            >
              発行
            </Button>

            {vp && (
              <Accordion defaultIndex={[0]} allowMultiple width="100%">
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        Verifiable Presentation
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Code
                      display="block"
                      whiteSpace="pre"
                      overflow="scroll"
                      padding={2}
                    >
                      {vp}
                    </Code>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            )}
          </VStack>
        </Box>
      </Box>
    );
  }

  return null;
}
