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
  private_key: Uint8Array,
  subject_json: string,
  issuer_did: string
) => {
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
    private_key,
    '#sign-0',
    identity.ProofOptions.default()
  );

  return signedVC;
};

export const createVP = async (
  private_key: Uint8Array,
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

  const unsignedVP = new identity.Presentation({
    holder: doc.id(),
    verifiableCredential: vc,
  });

  const signedVP = doc.signPresentation(
    unsignedVP,
    private_key,
    '#sign-0',
    new identity.ProofOptions({ challenge })
  );

  return signedVP;
};
