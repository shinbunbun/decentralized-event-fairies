import * as identity from '@iota/identity-wasm/node';

export const createDID = async (key_json: string) => {
  const client = new identity.Client();

  const key = identity.KeyPair.fromJSON(key_json);

  const doc = new identity.Document(key);

  doc.signSelf(key, '#sign-0');

  await client.publishDocument(doc);

  return doc;
};

export const createVC = async (
  issuer_key_json: string,
  subject_json: string,
  issuer_did: string
) => {
  const issuer_key = identity.KeyPair.fromJSON(issuer_key_json);

  const resolver = new identity.Resolver();
  const issuer_doc = (await resolver.resolve(issuer_did)).document();

  const unsignedVc = new identity.Credential({
    type: 'EventParticipationProofCredential',
    credentialStatus: {
      id: issuer_doc.id().toString() + '#sign-0"',
      type: 'EventParticipationProof',
    },
    issuer: issuer_doc.id(),
    credentialSubject: JSON.parse(subject_json),
  });

  const signedVC = issuer_doc.signCredential(
    unsignedVc,
    issuer_key.private(),
    '#sign-0',
    identity.ProofOptions.default()
  );

  return signedVC;
};

export const createVP = async (
  key_json: string,
  vc_json: string,
  challenge: string
) => {
  const client = new identity.Client();

  const vc = identity.Credential.fromJSON(vc_json);
  const did = vc.credentialSubject()[0].id;
  if (!did) {
    throw new Error('No DID found in credential');
  }
  const doc = identity.Document.fromJSON(await client.resolve(did));
  const key = identity.KeyPair.fromJSON(key_json);

  const unsignedVP = new identity.Presentation({
    holder: doc.id(),
    verifiableCredential: vc,
  });

  const signedVP = doc.signPresentation(
    unsignedVP,
    key.private(),
    '#sign-0',
    new identity.ProofOptions({ challenge })
  );

  return signedVP;
};
