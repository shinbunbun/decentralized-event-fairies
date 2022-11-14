import { useState } from 'react';
import {
  AspectRatio,
  Box,
  Heading,
  Text,
  Image,
  VStack,
  Button,
  Code,
} from '@chakra-ui/react';
import { format as formatDate } from 'date-fns';

import {
  EventData,
  issueVCs,
  issueVPs,
  useAuthValue,
  UserData,
  registerEvent,
} from '../lib';

export function EventOverviewCard(props: EventData) {
  const [loading, setLoading] = useState(false);
  const [vps, setVPs] = useState<string | null>(null);
  const auth = useAuthValue();
  const format = 'yyyy/MM/dd HH:mm';

  const register = async () => {
    if (!auth) {
      return;
    }

    setLoading(true);

    const eventID = await registerEvent(auth.did, props.id);
    console.log(eventID);

    setLoading(false);
  };

  return (
    <>
      <Box pb={6}>
        <Box
          boxShadow="base"
          borderRadius="md"
          overflow="hidden"
          background="white"
        >
          {props.thumbnail && (
            <AspectRatio ratio={3 / 1}>
              <Image src={props.thumbnail} alt="thumbnail" />
            </AspectRatio>
          )}
          <VStack p={6} spacing={4}>
            <Heading>{props.title}</Heading>
            <Text>
              {formatDate(props.start, format)} ~{' '}
              {formatDate(props.end, format)}
            </Text>
            <Button colorScheme="blue" onClick={register} isLoading={loading}>
              参加登録
            </Button>
          </VStack>
        </Box>
      </Box>

      {vps && (
        <Box pb={6}>
          <Box
            boxShadow="base"
            borderRadius="md"
            overflow="hidden"
            background="white"
          >
            <Code display="block" whiteSpace="pre" children={vps} />
          </Box>
        </Box>
      )}
    </>
  );
}
