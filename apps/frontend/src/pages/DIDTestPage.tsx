import * as identity from "@iota/identity-wasm/web";
import { ChangeEventHandler, useEffect, useState } from "react";
import fileDownload from "js-file-download";

/* export class MemoryStorage implements identity.Storage {

} */

const initIdentity = async () => {
  await identity.init();
}

const createKeyPair = () => {
  const key = new identity.KeyPair(identity.KeyType.Ed25519);
  return key.toJSON();
}

const saveKey = (keyJson: string) => {
  const blob = new Blob([keyJson], { type: "application/json" });
  fileDownload(blob, "key.json");
}

const createDID = async (key_json: string) => {
  const client = new identity.Client();

  const key = identity.KeyPair.fromJSON(key_json);

  const doc = new identity.Document(key);

  doc.signSelf(key, "#sign-0");

  await client.publishDocument(doc);

  return doc;
}

const createVP = async (key_json: string, vc_json: string, challenge: string) => {
  const client = new identity.Client();

  const vc = identity.Credential.fromJSON(vc_json);
  const did = vc.credentialSubject()[0].id;
  if (!did) {
    throw new Error("No DID found in credential");
  }
  const doc = identity.Document.fromJSON(await client.resolve(did));
  const key = identity.KeyPair.fromJSON(key_json);

  const unsignedVP = new identity.Presentation({
    holder: doc.id(),
    verifiableCredential: vc
  })

  const signedVP = doc.signPresentation(unsignedVP, key.private(), "#sign-0", new identity.ProofOptions({ challenge }));

  return signedVP;

}

const verify = async (vp_json: string, challenge: string) => {
  const vp = identity.Presentation.fromJSON(vp_json);

  const presentationVerifierOptions = new identity.VerifierOptions({
    challenge,
  })

  const subjectHolderRelationship = identity.SubjectHolderRelationship.AlwaysSubject;

  const presentationValidationOptions = new identity.PresentationValidationOptions({
    presentationVerifierOptions: presentationVerifierOptions,
    subjectHolderRelationship: subjectHolderRelationship,
  })

  const resolver = new identity.Resolver()

  try{
    await resolver.verifyPresentation(
      vp,
      presentationValidationOptions,
      identity.FailFast.FirstError
    )
    return true;
  } catch(e) {
    console.log(e);
    return false;
  }
}


function DIDTestPage() {
  // const [text, setText] = useState("");
  const [keyJson, setKeyJson] = useState("");
  const [vcJson, setVCJson] = useState("");
  const [doc, setDoc] = useState<identity.Document>();
  const [vpJson, setVPJson] = useState("");
  const [isVerify, setIsVerify] = useState(false);

  useEffect(() => {
    initIdentity();
  }, []);

  const handleCreateKeyPair = () => {
    const key = createKeyPair();
    setKeyJson(key);
  }

  const handleKeyJsonChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = await event.target.files?.item(0)?.text();
    if (!file) {
      return;
    }
    setKeyJson(JSON.parse(file));
  };

  const handleVerifiableCredential: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = await event.target.files?.item(0)?.text();
    if (!file) {
      return;
    }
    setVCJson(JSON.parse(file));
  };

  const handleCreateDID = async () => {
    const doc = await createDID(keyJson);
    setDoc(doc);
  }

  const handleCreateVP = async () => {
    const vp = await createVP(keyJson, vcJson, "challenge");
    setVPJson(vp.toJSON());
  }

  const handleVerify = async () => {
    const isVerify = await verify(vpJson, "challenge");
    setIsVerify(isVerify);
  }

  return <div>
    <p>1. 鍵を生成します</p>
    <button onClick={() => handleCreateKeyPair()}>鍵を生成</button>
    <br />
    <button onClick={() => saveKey(keyJson)}>鍵をローカルに保存</button>
    <br />
    <br />

    <p>or 1. 生成した鍵を読み込みます</p>
    <input type="file" accept="application/json" onChange={handleKeyJsonChange} />
    <br />
    <br />

    <p>2. DIDを発行します</p>
    <button onClick={() => handleCreateDID()}>DIDを発行</button>
    <p>DID: {doc?.id().toString()}</p>
    <br />
    <br />

    <p>3. VCを発行します</p>
    <br />
    <br />
    
    <p>or 3. VCを読み込みます</p>
    <input type="file" accept="application/json" onChange={handleVerifiableCredential} />
    <br />
    <br />

    <p>4. VPを発行します</p>
    <button onClick={() => handleCreateVP()}>createVP</button>
    <p>VP: {JSON.stringify(vpJson)}</p>
    <br />
    <br />

    <p>5. VPを検証します</p>
    <button onClick={()=>handleVerify()}>verify</button>
    <p>検証ステータス: {isVerify.toString()}</p>
    <br />
    <br />

  </div>;
}

export default DIDTestPage;
