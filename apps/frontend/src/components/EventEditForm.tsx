import {
  Box,
  Input,
  VStack,
  FormControl,
  FormLabel,
  Textarea,
  Button,
} from '@chakra-ui/react';

export function EventEditForm() {
  return (
    <Box
      boxShadow="base"
      borderRadius="md"
      overflow="hidden"
      p={6}
      background="white"
    >
      <VStack spacing={6}>
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input type="text" />
        </FormControl>

        <FormControl>
          <FormLabel>Thumbnail</FormLabel>
          <Input type="file" />
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea />
        </FormControl>

        <FormControl>
          <FormLabel>Start Date</FormLabel>
          <Input type="datetime-local" />
        </FormControl>

        <FormControl>
          <FormLabel>End Date</FormLabel>
          <Input type="datetime-local" />
        </FormControl>

        <Button>作成</Button>
      </VStack>
    </Box>
  );
}
