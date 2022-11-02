import * as identity from "@iota/identity-wasm/web";
import { useEffect } from "react";

/* export class MemoryStorage implements identity.Storage {

} */

const createDID = async (key_json: String) => {
  await identity.init()

  const client = new identity.Client();

  const key = identity.KeyPair.fromJSON(key_json);

  const doc = new identity.Document(key);

  doc.signSelf(key, "#sign-0");

  await client.publishDocument(doc);

  return doc.id.toString()

}


function DIDTestPage() {
  return <div>
    <h1>Hello World</h1>
    {/* <button onClick={() => createDID()}>CreateDID</button> */}
  </div>;
}

export default DIDTestPage;
