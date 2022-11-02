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

const createDID = async (key_json: String) => {
  const client = new identity.Client();

  const key = identity.KeyPair.fromJSON(key_json);

  const doc = new identity.Document(key);

  doc.signSelf(key, "#sign-0");

  await client.publishDocument(doc);

  return doc.id().toString();
}


function DIDTestPage() {
  // const [text, setText] = useState("");
  const [key_json, setKeyJson] = useState("");
  const [did, setDid] = useState("");

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

  const handleCreateDID = async () => {
    const did = await createDID(key_json);
    setDid(did);
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
    <input type="file" accept="application/json" onChange={handleKeyJsonChange} />
    <br />
    <p>{JSON.stringify(key_json)}</p>
    <br />
    <p>{did}</p>

  </div>;
}

export default DIDTestPage;
