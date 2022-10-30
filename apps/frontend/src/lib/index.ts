import { selectorFamily } from 'recoil';

const API_URL = 'http://localhost:8080/v1/graphql';

export interface EventData {
  id: string;
  title: string;
  thumbnail?: string;
  description: string;
  start: Date;
  end: Date;
}

const getEventDataQuery = `
query getEventByID($id: Int!) {
  getEvent(id: $id) {
    id title thumbnail description start end
  }
}
`;

export const getEventData = selectorFamily<
  EventData | null,
  { eventId: string | undefined }
>({
  key: 'getEventData',
  get:
    ({ eventId }) =>
    async () => {
      if (eventId === undefined) {
        return null;
      }
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: getEventDataQuery,
          variables: { id: Number(eventId) },
        }),
      });
      const data = await res.json();
      const event = data['data']['getEvent'];
      return {
        id: event['id'],
        title: event['title'],
        thumbnail: event['thumbnail'],
        description: event['description'],
        start: new Date(event['start']),
        end: new Date(event['end']),
      };
    },
});

const createEventDataQuery = `
mutation createEvent(
  $title: String!, $thumbnail: String, $description: String!, $start: date!, $end: date!
) {
  createEvent(object: {
    title: $title,
    thumbnail: $thumbnail,
    description: $description,
    start: $start,
    end: $end
  }) {
    id
  }
}
`;

export const createEventData = async (
  variables: Omit<EventData, 'id'>
): Promise<number> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: createEventDataQuery,
      variables: variables,
    }),
  });
  const data = await res.json();
  return data['data']['createEvent']['id'];
};

export interface UserData {
  id: string;
  name: string;
  image: string;
  email: string;
}

const getUserDataQuery = `
query getUserByID($id: Int!) {
  getUser(id: $id) {
    id name image email
  }
}
`;

export const getUserData = selectorFamily<
  UserData | null,
  { userId: string | undefined }
>({
  key: 'getUserData',
  get:
    ({ userId }) =>
    async () => {
      if (userId === undefined) {
        return null;
      }
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: getUserDataQuery,
          variables: { id: Number(userId) },
        }),
      });
      const data = await res.json();
      return data['data']['getUser'] as UserData;
    },
});
