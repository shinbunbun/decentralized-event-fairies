import * as identity from "@iota/identity-wasm/web";
import { ChangeEventHandler, useEffect, useState } from "react";
import fileDownload from "js-file-download";

/* export class MemoryStorage implements identity.Storage {

} */

const initIdentity = async () => {
  await identity.init();
}

const createKeyPair = async () => {
  const key = new identity.KeyPair(identity.KeyType.Ed25519);
  const json = JSON.stringify(key.toJSON());
  const blob = new Blob([json], { type: "application/json" });

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

const createVP = async (key_json: string, vc_json: string) => {
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

  const signedVP = doc.signPresentation(unsignedVP, key.private(), "#sign-0", identity.ProofOptions.default());

  console.log(signedVP.toJSON());

}


function DIDTestPage() {
  // const [text, setText] = useState("");
  const [key_json, setKeyJson] = useState("");
  const [vc_json, setVCJson] = useState("");
  const [doc, setDoc] = useState<identity.Document>();

  useEffect(() => {
    initIdentity();
  }, []);
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
    const doc = await createDID(key_json);
    setDoc(doc);
  }

  return <div>
    <h1>Hello World</h1>
    <br />
    <button onClick={() => handleCreateDID()}>CreateDID</button>
    <br />
    {/* <button onClick={() => onClick()}>createKeyPair</button>
    <p>{text}</p> */}
    <button onClick={() => createKeyPair()}>createKeyPair</button>
    <br />
    <button onClick={()=>createVP(key_json, vc_json)}>createVP</button>
    <br />
    <p>鍵: </p>
    <input type="file" accept="application/json" onChange={handleKeyJsonChange} />
    <p>Verifiable Credential: </p>
    <input type="file" accept="application/json" onChange={handleVerifiableCredential} />
    <br />
    <p>{JSON.stringify(key_json)}</p>
    <br />
    <p>{JSON.stringify(doc?.toJSON())}</p>

  </div>;
}

export default DIDTestPage;
