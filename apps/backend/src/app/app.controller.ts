import { Controller, Post, Body } from '@nestjs/common';
import { RP, SIOP } from '@sphereon/did-auth-siop';
import {
  Resolvable,
  DIDResolutionOptions,
  DIDResolutionResult,
  DIDDocument,
  DIDDocumentMetadata,
} from 'did-resolver';
import { Client } from '@iota/identity-wasm/node';

import { AppService } from './app.service';
import { createJwt } from '../jwt/jwt';

const RP_KEYS = {
  hexPrivateKey:
    '5fbed33a79c318bbead51117df0cea089be905588ba6762123a78abc658eb48c',
  did: 'did:iota:FpfVKCY42uuQed5N6mnMNS896psWnLbXrFKL4NUzt8Pc',
};

const redirect = 'http://localhost:3000/api/auth/callback/siop';

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
        contentType: 'application/did+json',
      },
      didDocument: doc as DIDDocument,
      didDocumentMetadata: meta as DIDDocumentMetadata,
    };
  }
  return { resolve };
}

const rp = RP.builder()
  .redirect(redirect)
  .requestBy(SIOP.PassBy.VALUE)
  .internalSignature(
    RP_KEYS.hexPrivateKey,
    RP_KEYS.did,
    RP_KEYS.did + '#controller'
  )
  .defaultResolver(getResolver())
  .registrationBy(SIOP.PassBy.VALUE)
  .build();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/auth/signin')
  async signIn() {
    const authReq = await rp.createAuthenticationRequest();
    return { authReq };
  }

  @Post('/auth/siop')
  async siop(@Body() body: { authRes: any }) {
    const verifiedRes = await rp.verifyAuthenticationResponseJwt(
      body.authRes.jwt,
      {
        audience: redirect,
      }
    );
    const payload = {
      aud: verifiedRes.signer.id,
      exp: Date.now(),
      iat: Date.now(),
      sub: verifiedRes.signer.id,
      iss: RP_KEYS.did,
    };
    const jwt = await createJwt(RP_KEYS.hexPrivateKey, payload);
    console.log(jwt);
    return { jwt };
  }
}
