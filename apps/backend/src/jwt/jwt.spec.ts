import { createJwt, JwtPayload } from './jwt';

describe('jwt', () => {
  it('should create a jwt', async () => {
    await createJwt("ba944fbd34d27877ba0787856b2afc163d2b54d2c3ad0f152bae011ce3f91687", {
      aud: "http://localhost:3000/api/auth/callback/siop",
      exp: 1630000000,
      iat: 1630000000,
      sub: "did:iota:FpfVKCY42uuQed5N6mnMNS896psWnLbXrFKL4NUzt8Pc",
      iss: "did:iota:FPWiRYAG6F2xyHavCG5MRFsR76NQPb9RLz2GGjwEih88"
    })
  });
});
