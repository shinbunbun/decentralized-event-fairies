import {
  atom,
  selectorFamily,
  useRecoilValue,
  useRecoilState,
  AtomEffect,
} from 'recoil';
import { OP, SIOP } from '@sphereon/did-auth-siop';
import {
  Resolvable,
  DIDResolutionOptions,
  DIDResolutionResult,
  DIDDocument,
  DIDDocumentMetadata,
} from 'did-resolver';
import { Client, init as initIOTA, KeyPair, KeyType, Document as IOTADocument } from '@iota/identity-wasm/web';
import { Buffer } from 'buffer';
import jwt_decode from 'jwt-decode';

window.Buffer = Buffer;

// -----------------------------------------------------------------------------

const HASURA_URL = 'http://localhost:8080/v1/graphql';
const BUNBUN_URL = 'http://localhost:8000';
const NESTJS_URL = 'http://localhost:3334/api';

export interface EventData {
  id: string;
  title: string;
  thumbnail?: string;
  description: string;
  start: Date;
  end: Date;
  admins: string[];
  participants: string[];
}

const getEventDataQuery = `
query getEventByID($id: Int!) {
  getEvent(id: $id) {
    id
    title
    thumbnail
    description
    start
    end
    event_admins {
      admin {
        id
      }
    }
    event_participants {
      participant {
        id
      }
    }
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
      const res = await fetch(HASURA_URL, {
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
        admins: event['event_admins'].map((admin: any) => admin['admin']['id']),
        participants: event['event_participants'].map(
          (v: any) => v['participant']['id']
        ),
      };
    },
});

const getAllEventsQuery = `
query getAllEvents {
  Events {
    id
    start
    thumbnail
    title
    end
    description
    event_admins {
      admin {
        id
      }
    }
    event_participants {
      participant {
        id
      }
    }
  }
}
`;

export const getAllEvents = selectorFamily<EventData[], any>({
  key: 'getEventData',
  get: () => async () => {
    const res = await fetch(HASURA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: getAllEventsQuery,
      }),
    });
    const data = await res.json();
    const events: Record<string, any>[] = data['data']['Events'];
    return events.map((event) => ({
      id: event['id'],
      title: event['title'],
      thumbnail: event['thumbnail'],
      description: event['description'],
      start: new Date(event['start']),
      end: new Date(event['end']),
      admins: event['event_admins'].map((admin: any) => admin['admin']['id']),
      participants: event['event_participants'].map(
        (v: any) => v['participant']['id']
      ),
    }));
  },
});

const createEventDataQuery = `
mutation createEvent(
  $title: String!, $thumbnail: String, $description: String!, $start: date!, $end: date!, $did: String!
) {
  createEvent(object: {
    title: $title,
    thumbnail: $thumbnail,
    description: $description,
    start: $start,
    end: $end,
    event_admins: {
      data: {
        user_id: $did
      }
    },
  }) {
    id
  }
}
`;

export const createEventData = async (
  variables: Omit<EventData, 'id' | 'participants' | 'admins'>,
  did: string
): Promise<number> => {
  const res = await fetch(HASURA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: createEventDataQuery,
      variables: { ...variables, did },
    }),
  });
  const data = await res.json();
  return data['data']['createEvent']['id'];
};

// -----------------------------------------------------------------------------

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
      const res = await fetch(HASURA_URL, {
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

// -----------------------------------------------------------------------------

export interface VerifiableCredentials {
  '@context': string;
  type: string[];
  credentialSubject: Record<string, unknown> & { id: string };
  issuer: string;
  issuanceDate: string;
  proof: {
    type: string;
    verificationMethod: string;
    signatureValue: string;
  };
}

export const issueVCs = async (
  user: UserData,
  event: EventData
): Promise<VerifiableCredentials> => {
  const payload = { ...user, ...event };
  const res = await fetch(BUNBUN_URL + `/issue/${user.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data as VerifiableCredentials;
};

export const issueVPs = async (
  user: UserData,
  vcs: VerifiableCredentials
): Promise<Record<string, unknown>> => {
  const payload = {
    credential_json: JSON.stringify(vcs),
    did: vcs.credentialSubject.id,
    challenge: 'challenge',
    expires: 4128501858,
  };
  const res = await fetch(BUNBUN_URL + `/presentation/${user.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data;
};

export const verify = async (vps: string) => {
  await fetch(BUNBUN_URL + `/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: vps,
  });
  return true;
};

export const registerEvent = async (userID: string, eventID: string) => {
  const res = await fetch(NESTJS_URL + '/hasura/event/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: { userID, eventID } }),
  });
  const { registeredEventID } = await res.json();
  return { eventId: registeredEventID };
};

// -----------------------------------------------------------------------------

function getResolver(): Resolvable {
  async function resolve(
    didUrl: string,
    options?: DIDResolutionOptions
  ): Promise<DIDResolutionResult> {
    const client = new Client();
    const resolved = await client.resolve(didUrl);
    const document = resolved.intoDocument().toJSON();
    const { doc, meta } = document;
    return {
      didResolutionMetadata: {
        contentType: 'application/did+json',
      },
      didDocument: doc as DIDDocument,
      didDocumentMetadata: meta as DIDDocumentMetadata,
    };
  }
  return { resolve };
}

export async function signInWithSIOP(
  privateKey: string,
  did: string,
  createUser: boolean
): Promise<User | null> {
  await initIOTA();

  const op = OP.builder()
    .internalSignature(privateKey, did, did + '#controller')
    .defaultResolver(getResolver())
    .registrationBy(SIOP.PassBy.VALUE)
    .build();

  const authReq = await fetch(NESTJS_URL + '/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const authReqData = await authReq.json();
  const encodedUri = authReqData.authReq.encodedUri;

  const verifiedReq = await op.verifyAuthenticationRequest(encodedUri);
  const authRes = await op.createAuthenticationResponse(verifiedReq);

  const session = await fetch(NESTJS_URL + '/auth/siop', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ authRes, createUser }),
  });
  const sessionData = await session.json();
  const payload = jwt_decode(sessionData.jwt) as any;
  console.log(payload);
  return 'aud' in payload ? { did: payload['aud'] } : null;
}

export interface User {
  did: string;
  displayName?: string;
  photoURL?: string;
  email?: string;
}

function localStorageEffect(key: string) {
  const eff: AtomEffect<User | null> = ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };
  return eff;
}

const authState = atom<User | null>({
  key: 'authState',
  default: null,
  effects: [localStorageEffect('current_user')],
});

export const useAuthState = () => useRecoilState(authState);
export const useAuthValue = () => useRecoilValue(authState);

export const createKeyPair = async () => {
  await initIOTA();
  const key = new KeyPair(KeyType.Ed25519);
  return key;
};

export const createDID = async (key: KeyPair) => {
  const client = new Client();

  const doc = new IOTADocument(key);

  doc.signSelf(key, '#sign-0');

  await client.publishDocument(doc);

  return doc;
};
