import * as didJWT from 'did-jwt';
import { generateKeyPairFromSeed, verify } from '@stablelib/ed25519'
import * as textEncoding from 'text-encoding';
import * as jose from 'jose';
import * as identity from "@iota/identity-wasm/node";
import * as multibase from 'multibase';

interface JwtPayload {
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

export const verifyJwt = async (jwt: string, issuer: string) => {
  const { payload, header, signature, data } = didJWT.decodeJWT(jwt);
  const { iss } = payload;
  console.log(payload);

  const resolver = new identity.Resolver()
  const didDoc = await resolver.resolve(iss);
  const { publicKeyMultibase } = didDoc.toJSON().doc.capabilityInvocation[0];
  const publicKey = Uint8Array.from(Buffer.from(multibase.decode(publicKeyMultibase)));

  const arraySignature = Uint8Array.from(Buffer.from(signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''), "base64"));

  const verified = verify(publicKey, Uint8Array.from(Buffer.from(data)), arraySignature);
  if (!verified) {
    throw new Error("Signature is not valid");
  }

  if (iss !== issuer) {
    throw new Error("Issuer is not valid");
  }

  const date = new Date();
  const time = Math.floor(date.getTime() / 1000);
  if (payload.exp < time) {
    throw new Error("Token is expired");
  }

  return true;
}
