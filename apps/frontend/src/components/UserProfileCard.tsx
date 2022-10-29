import { Avatar, Box, VStack, Heading } from '@chakra-ui/react';

export interface UserProfileCardProps {
  name: string;
  photo: string;
}

export function UserProfileCard(props: UserProfileCardProps) {
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
          <Avatar size="2xl" name={props.name} src={props.photo} />
          <Heading>{props.name}</Heading>
        </VStack>
      </Box>
    </Box>
  );
}
