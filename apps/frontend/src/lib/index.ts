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

export const getEventData = selectorFamily<EventData, { eventId: number }>({
  key: 'getEventData',
  get:
    ({ eventId }) =>
    async () => {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query:
            'query getEventByID($id: Int!) { getEvent(id: $id) { id title thumbnail description start end } }',
          variables: { id: eventId },
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

export interface UserData {
  id: string;
  name: string;
  image: string;
  email: string;
}

export const getUserData = selectorFamily<UserData, { userId: number }>({
  key: 'getUserData',
  get:
    ({ userId }) =>
    async () => {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query:
            'query getUserByID($id: Int!) { getUser(id: $id) { id email image name } }',
          variables: { id: userId },
        }),
      });
      const data = await res.json();
      return data['data']['getUser'] as UserData;
    },
});
