import { Avatar, Box, VStack, Heading } from '@chakra-ui/react';
import { UserData } from '../lib';

export function UserProfileCard(props: UserData) {
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
          <Avatar size="2xl" name={props.name} src={props.image} />
          <Heading>{props.name}</Heading>
        </VStack>
      </Box>
    </Box>
  );
}
