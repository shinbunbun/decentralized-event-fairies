import {
  AspectRatio,
  Box,
  Heading,
  Text,
  Image,
  VStack,
  Button,
} from '@chakra-ui/react';
import { format as formatDate } from 'date-fns';

export interface EventOverviewCardProps {
  title: string;
  thumbnail: string;
  start: Date;
  end: Date;
}

export function EventOverviewCard(props: EventOverviewCardProps) {
  const format = 'yyyy/MM/dd HH:mm';

  return (
    <Box pb={6}>
      <Box
        boxShadow="base"
        borderRadius="md"
        overflow="hidden"
        background="white"
      >
        <AspectRatio ratio={3 / 1}>
          <Image src={props.thumbnail} alt="thumbnail" />
        </AspectRatio>
        <VStack p={6} spacing={4}>
          <Heading>{props.title}</Heading>
          <Text>
            {formatDate(props.start, format)} ~ {formatDate(props.end, format)}
          </Text>
          <Button colorScheme="blue">参加登録</Button>
        </VStack>
      </Box>
    </Box>
  );
}
