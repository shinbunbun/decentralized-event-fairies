use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

use crate::error::Error;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    aud: String,
    exp: usize,
    iat: usize,
    iss: String,
    sub: String,
}

pub fn create_jwt(claims: Claims, prv_key: &[u8]) -> Result<String, Error> {
    Ok(encode(
        &Header::new(Algorithm::ES256),
        &claims,
        &EncodingKey::from_ec_pem(prv_key)?,
    )?)
}

pub fn verify_jwt(token: &str, pub_key: &[u8]) -> Result<Claims, Error> {
    Ok(decode::<Claims>(
        token,
        &DecodingKey::from_ec_pem(pub_key)?,
        &Validation::new(Algorithm::ES256),
    )?
    .claims)
}

#[cfg(test)]
mod test {
    use super::Claims;

    #[test]
    fn test_jwt() {
        let unix_time = chrono::Utc::now().timestamp() as usize;
        let claims = Claims {
            aud: "aud".to_string(),
            exp: unix_time + 3600,
            iat: unix_time,
            iss: "iss".to_string(),
            sub: "sub".to_string(),
        };
        let prv_key = include_bytes!("../test_key/ec_private.pem");
        let pub_key = include_bytes!("../test_key/ec_public.pem");

        let jwt = super::create_jwt(claims, prv_key).unwrap();

        println!("{}", jwt);

        let claims = super::verify_jwt(&jwt, pub_key).unwrap();

        println!("{:?}", claims);
    }
}
