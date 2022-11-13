import * as didJWT from 'did-jwt';
import { generateKeyPairFromSeed } from '@stablelib/ed25519'

export interface JwtPayload {
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  iss: string;
}

export const createJwt = async (hexPrivateKey: string, payload: JwtPayload) => {
  const signer = didJWT.EdDSASigner(generateKeyPairFromSeed(didJWT.hexToBytes(hexPrivateKey)).secretKey)

  let jwt = await didJWT.createJWT(
    payload,
    { issuer: payload.iss, signer },
    { alg: 'EdDSA' }
  )

  return jwt;
}
