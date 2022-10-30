import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp(functions.config().firebase);

const createUser = `
mutation createUser($id: String!, $email: String!, $name: String!, $image: String) {
  createUser(object: {id: $id, email: $email, name: $name, image: $image})
}
`;

export const signUp = functions.auth.user().onCreate(async (user) => {
  await admin.auth().setCustomUserClaims(user.uid, {
    'https://hasura.io/jwt/claims': {
      'x-hasura-default-role': 'user',
      'x-hasura-allowed-roles': ['user'],
      'x-hasura-user-id': user.uid,
    },
  });

  const res = await axios.post(
    'http://localhost:8080/v1/graphql',
    {
      query: createUser,
      variables: {
        id: user.uid,
        email: user.email,
        name: user.displayName || 'Anonymous',
        image: user.photoURL,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  console.log(JSON.stringify(res));
});
