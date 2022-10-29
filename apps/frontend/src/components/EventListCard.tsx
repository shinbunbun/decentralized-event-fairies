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
    <Box width="100%">
      <HStack spacing={6}>
        <Text>{formatDate(props.start, format)}</Text>
        <AspectRatio w="64px" ratio={1 / 1}>
          <Image src={props.thumbnail} alt="thumbnail" borderRadius="md" />
        </AspectRatio>
        <ChakraLink as={Link} to={`/event/${props.id}`}>
          <Text fontSize="lg" as="u">
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
          {props.events.map((event) => (
            <EventListItem key={event.id} {...event} />
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
