import * as identity from "@iota/identity-wasm/web";


function DIDTestPage() {
  (async () => {
  
    await identity.init()
      
    // The creation step generates a keypair, builds an identity
    // and publishes it to the IOTA mainnet.
    let builder = new identity.AccountBuilder();
    let account = await builder.createIdentity();
  
    // Retrieve the DID of the newly created identity.
    const did = account.did();
  
    // Print the DID of the created Identity.
    console.log(did.toString())
  
    // Print the local state of the DID Document
    console.log(account.document());

    await identity.init("./static/identity_wasm_bg.wasm");
    
  })()

  return <div>
    <h1>Hello World</h1>
  </div>;
}

export default DIDTestPage;
