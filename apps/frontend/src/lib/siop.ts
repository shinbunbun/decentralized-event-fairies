import { RP, OP, SIOP } from "@sphereon/did-auth-siop";
import { Resolvable, DIDResolutionOptions, DIDResolutionResult, DIDDocument, DIDDocumentMetadata } from 'did-resolver';
import { Client, init as initIOTA } from '@iota/identity-wasm/web';

function getResolver(): Resolvable {
  async function resolve(
    didUrl: string,
    options?: DIDResolutionOptions
  ): Promise<DIDResolutionResult> {
    const client = new Client();
    const resolved = await client.resolve(didUrl);
    const document = resolved.intoDocument().toJSON();
    const { doc, meta } = document;
    return {
      didResolutionMetadata: {
        contentType: "application/did+json",
      },
      didDocument: doc as DIDDocument,
      didDocumentMetadata: meta as DIDDocumentMetadata,
    }
  }
  return { resolve };
}

async function siop() {
  const redirect = "http://localhost:3000/api/auth/callback/siop";

  const rpKeys = {
    hexPrivateKey: "5fbed33a79c318bbead51117df0cea089be905588ba6762123a78abc658eb48c",
    did: "did:iota:FpfVKCY42uuQed5N6mnMNS896psWnLbXrFKL4NUzt8Pc",
  };
  const rp = RP.builder()
    .redirect(redirect)
    .requestBy(SIOP.PassBy.VALUE)
    .internalSignature(rpKeys.hexPrivateKey, rpKeys.did, rpKeys.did + "#controller")
    .defaultResolver(getResolver())
    .registrationBy(SIOP.PassBy.VALUE)
    .build();

  const opKeys = {
    hexPrivateKey: 'ba944fbd34d27877ba0787856b2afc163d2b54d2c3ad0f152bae011ce3f91687',
    did: 'did:iota:FPWiRYAG6F2xyHavCG5MRFsR76NQPb9RLz2GGjwEih88',
  }
  const op = OP.builder()
    .internalSignature(opKeys.hexPrivateKey, opKeys.did, opKeys.did + "#controller")
    .defaultResolver(getResolver())
    .registrationBy(SIOP.PassBy.VALUE)
    .build();

  const req = await rp.createAuthenticationRequest();
  console.log(req);

  const verifiedReq = await op.verifyAuthenticationRequest(req.encodedUri);
  console.log(verifiedReq);

  const res = await op.createAuthenticationResponse(verifiedReq)
  console.log(res);

  const verifiedRes = await rp.verifyAuthenticationResponseJwt(res.jwt, {
    audience: redirect,
});
  console.log(verifiedRes);
}

async function init() {
  await initIOTA();
  console.log("initialized");
}
