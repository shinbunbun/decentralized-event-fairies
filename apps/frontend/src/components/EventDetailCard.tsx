import { Box, Text } from '@chakra-ui/react';

export interface EventDetailCardProps {
  description: string;
}

export function EventDetailCard(props: EventDetailCardProps) {
  return (
    <Box pb={6}>
      <Box
        boxShadow="base"
        borderRadius="md"
        overflow="hidden"
        p={6}
        background="white"
      >
        <Text>{props.description}</Text>
      </Box>
    </Box>
  );
}
