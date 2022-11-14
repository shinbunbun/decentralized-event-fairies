import * as identity from '@iota/identity-wasm/web';
import { ChangeEventHandler, useEffect, useState } from 'react';
import fileDownload from 'js-file-download';
import axios from 'axios';
import { Button, Input } from '@chakra-ui/react';

/* export class MemoryStorage implements identity.Storage {

} */

const RUST_SERVER_URL = 'http://localhost:8000';

const initIdentity = async () => {
  await identity.init();
};

const createKeyPair = () => {
  const key = new identity.KeyPair(identity.KeyType.Ed25519);
  return key.toJSON();
};

const saveKey = (keyJson: string) => {
  const blob = new Blob([JSON.stringify(keyJson)], {
    type: 'application/json',
  });
  fileDownload(blob, 'key.json');
};

const createDID = async (key_json: string) => {
  const client = new identity.Client();

  const key = identity.KeyPair.fromJSON(key_json);

  const doc = new identity.Document(key);

  doc.signSelf(key, '#sign-0');

  await client.publishDocument(doc);

  return doc;
};

const createVCOnServer = async (subject_json: string) => {
  try {
    const res = await axios.post(`${RUST_SERVER_URL}/issue`, subject_json);
    return res.data;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to create VC');
  }
};

const createVC = async (
  issuer_key_json: string,
  subject_json: string,
  issuer_doc_json: string
) => {
  const issuer_key = identity.KeyPair.fromJSON(issuer_key_json);
  const issuer_doc = identity.Document.fromJSON(issuer_doc_json);

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

const createVP = async (
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

const verify = async (vp_json: string, challenge: string) => {
  const vp = identity.Presentation.fromJSON(vp_json);

  const presentationVerifierOptions = new identity.VerifierOptions({
    challenge,
  });

  const subjectHolderRelationship =
    identity.SubjectHolderRelationship.AlwaysSubject;

  const presentationValidationOptions =
    new identity.PresentationValidationOptions({
      presentationVerifierOptions: presentationVerifierOptions,
      subjectHolderRelationship: subjectHolderRelationship,
    });

  const resolver = new identity.Resolver();

  try {
    await resolver.verifyPresentation(
      vp,
      presentationValidationOptions,
      identity.FailFast.FirstError
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

function DIDTestPage() {
  // const [text, setText] = useState("");
  const [keyJson, setKeyJson] = useState('');
  const [vcJson, setVCJson] = useState('');
  const [doc, setDoc] = useState<identity.Document>();
  const [vpJson, setVPJson] = useState('');
  const [isVerify, setIsVerify] = useState(false);

  useEffect(() => {
    initIdentity();
  }, []);

  const handleCreateKeyPair = () => {
    const key = createKeyPair();
    setKeyJson(key);
  };

  const handleKeyJsonChange: ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    const file = await event.target.files?.item(0)?.text();
    if (!file) {
      return;
    }
    setKeyJson(JSON.parse(file));
  };

  const handleVerifiableCredential: ChangeEventHandler<
    HTMLInputElement
  > = async (event) => {
    const file = await event.target.files?.item(0)?.text();
    if (!file) {
      return;
    }
    setVCJson(JSON.parse(file));
  };

  const handleCreateDID = async () => {
    const doc = await createDID(keyJson);
    setDoc(doc);
  };

  const handleCreateVC = async () => {
    const subject = JSON.stringify({
      id: doc?.id(),
      name: 'John Doe',
    });
    const vc = await createVCOnServer(subject);
    setVCJson(vc);
  };

  const handleCreateVP = async () => {
    const vp = await createVP(keyJson, vcJson, 'challenge');
    setVPJson(vp.toJSON());
  };

  const handleVerify = async () => {
    const isVerify = await verify(vpJson, 'challenge');
    setIsVerify(isVerify);
  };

  return (
    <div>
      <p>1. 鍵を生成します</p>
      <Button colorScheme="blue" onClick={() => handleCreateKeyPair()}>
        鍵を生成
      </Button>
      <br />
      <Button colorScheme="blue" onClick={() => saveKey(keyJson)}>
        鍵をローカルに保存
      </Button>
      <br />
      <br />

      <p>or 1. 生成した鍵を読み込みます</p>
      <Input
        type="file"
        accept="application/json"
        onChange={handleKeyJsonChange}
      />
      <br />
      <br />

      <p>2. DIDを発行します</p>
      <Button colorScheme="blue" onClick={() => handleCreateDID()}>
        DIDを発行
      </Button>
      <p>DID: {doc?.id().toString()}</p>
      <br />
      <br />

      <p>3. VCを発行します</p>
      <Button colorScheme="blue" onClick={() => handleCreateVC()}>
        VCを発行
      </Button>
      <br />
      <br />

      <p>or 3. VCを読み込みます</p>
      <Input
        type="file"
        accept="application/json"
        onChange={handleVerifiableCredential}
      />
      <p>VC: {JSON.stringify(vcJson)}</p>
      <br />
      <br />

      <p>4. VPを発行します</p>
      <Button colorScheme="blue" onClick={() => handleCreateVP()}>
        createVP
      </Button>
      <p>VP: {JSON.stringify(vpJson)}</p>
      <br />
      <br />

      <p>5. VPを検証します</p>
      <Button colorScheme="blue" onClick={() => handleVerify()}>
        verify
      </Button>
      <p>検証ステータス: {isVerify.toString()}</p>
      <br />
      <br />
    </div>
  );
}

export default DIDTestPage;
