use jsonwebtoken::{encode, Algorithm, EncodingKey, Header};
use serde::{Deserialize, Serialize};
use serde_json::json;

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

#[cfg(test)]
mod test {
    use super::Claims;

    #[test]
    fn test_create_jwt() {
        let unix_time = chrono::Utc::now().timestamp() as usize;
        let claims = Claims {
            aud: "aud".to_string(),
            exp: unix_time + 3600,
            iat: unix_time,
            iss: "iss".to_string(),
            sub: "sub".to_string(),
        };
        let prv_key = include_bytes!("../test_key/ec_private.pem");

        let jwt = super::create_jwt(claims, prv_key).unwrap();

        println!("{}", jwt);
    }
}
