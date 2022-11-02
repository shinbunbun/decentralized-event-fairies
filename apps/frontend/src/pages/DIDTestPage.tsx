import * as identity from "@iota/identity-wasm/web";
import { useEffect, useState } from "react";
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

  return doc.id.toString()

}


function DIDTestPage() {
  // const [text, setText] = useState("");
  useEffect(() => {
    initIdentity();
  }, []);
  /* const onClick = async () => {
    const text = await createKeyPair();
    setText(text);
  } */

  return <div>
    <h1>Hello World</h1>
    {/* <button onClick={() => createDID()}>CreateDID</button> */}
    {/* <button onClick={() => onClick()}>createKeyPair</button>
    <p>{text}</p> */}
    <button onClick={() => createKeyPair()}>createKeyPair</button>
  </div>;
}

export default DIDTestPage;
