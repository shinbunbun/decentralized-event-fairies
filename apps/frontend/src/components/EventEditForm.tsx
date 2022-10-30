import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Input,
  VStack,
  FormControl,
  FormLabel,
  Textarea,
  Button,
  Divider,
  Heading,
} from '@chakra-ui/react';

import { createEventData } from '../lib';

export function EventEditForm() {
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createEvent = async () => {
    setLoading(true);
    const id = await createEventData({
      title,
      thumbnail,
      description,
      start: new Date(start),
      end: new Date(end),
    });
    navigate(`/event/${id}`);
    setLoading(false);
  };

  return (
    <Box
      boxShadow="base"
      borderRadius="md"
      overflow="hidden"
      p={6}
      background="white"
    >
      <VStack spacing={6}>
        <Heading>イベントを作成</Heading>

        <Divider />

        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Thumbnail</FormLabel>
          <Input
            type="text"
            value={thumbnail}
            onChange={(ev) => setThumbnail(ev.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Start Date</FormLabel>
          <Input
            type="datetime-local"
            value={start}
            onChange={(ev) => setStart(ev.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>End Date</FormLabel>
          <Input
            type="datetime-local"
            value={end}
            onChange={(ev) => setEnd(ev.target.value)}
          />
        </FormControl>

        <Divider />

        <Button
          colorScheme="blue"
          isLoading={loading}
          onClick={() => createEvent()}
        >
          作成
        </Button>
      </VStack>
    </Box>
  );
}
