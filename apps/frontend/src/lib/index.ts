import { atom, selectorFamily, useRecoilValue } from 'recoil';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  User,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

// -----------------------------------------------------------------------------

const firebaseConfig = {
  apiKey: 'AIzaSyA8qTql_PW8gnODLdX4_BD55diERI7o92E',
  authDomain: 'decentralized-event-fairies.firebaseapp.com',
  projectId: 'decentralized-event-fairies',
  storageBucket: 'decentralized-event-fairies.appspot.com',
  messagingSenderId: '526917576582',
  appId: '1:526917576582:web:05587f9263faafc7ebee07',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

const authState = atom<User | null>({
  key: 'authState',
  default: null,
  effects: [
    ({ setSelf }) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setSelf(user);
      });
      return () => unsubscribe();
    },
  ],
});

export const useAuthState = () => useRecoilValue(authState);

export const signIn = () => signInWithPopup(auth, provider);

// -----------------------------------------------------------------------------

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
query getUserByID($id: String!) {
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
          variables: { id: userId },
        }),
      });
      const data = await res.json();
      return data['data']['getUser'] as UserData;
    },
});
