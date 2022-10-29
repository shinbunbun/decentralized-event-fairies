import { Link } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Link as ChakraLink,
  Text,
  AspectRatio,
  Image,
  StackDivider,
} from '@chakra-ui/react';
import { format as formatDate } from 'date-fns';

import { EventData } from '../lib';

function EventListItem(props: EventData) {
  const format = 'MM/dd';

  return (
    <Box width="100%" px={4}>
      <HStack spacing={6}>
        <Text fontWeight="semibold">{formatDate(props.start, format)}</Text>
        <AspectRatio w="96px" ratio={3 / 2}>
          <Image src={props.thumbnail} alt="thumbnail" borderRadius="md" />
        </AspectRatio>
        <ChakraLink as={Link} to={`/event/${props.id}`}>
          <Text fontSize="lg" as="u" fontWeight="semibold">
            {props.title}
          </Text>
        </ChakraLink>
      </HStack>
    </Box>
  );
}

export interface EventListCardProps {
  events: EventData[];
}

export function EventListCard(props: EventListCardProps) {
  return (
    <Box pb={6}>
      <Box
        boxShadow="base"
        borderRadius="md"
        overflow="hidden"
        p={6}
        background="white"
      >
        <VStack spacing={4} divider={<StackDivider />}>
          {props.events.length === 0 ? (
            <p>表示するイベントがありません...</p>
          ) : (
            props.events.map((event) => (
              <EventListItem key={event.id} {...event} />
            ))
          )}
        </VStack>
      </Box>
    </Box>
  );
}
