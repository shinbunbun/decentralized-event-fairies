/* use identity_iota::{
    core::{Duration, FromJson, Timestamp, Url},
    credential::{Credential, Presentation, PresentationBuilder},
};

use crate::{error::Error, utils::random};

pub struct VerifierRequest {
    pub challenge: String,
    pub expires: i64,
}

pub struct HolderRequest {
    pub credential_json: String,
    pub did: String,
}

pub fn create_vp(
    verifier_request: &VerifierRequest,
    holder_request: &HolderRequest,
) -> Result<(), Error> {
    let challenge = random::gen();

    let expires = Timestamp::from_unix(verifier_request.expires).map_err(Error::Core)?;

    let credential: Credential =
        Credential::from_json(&holder_request.credential_json).map_err(Error::Core)?;

    let mut presentation: Presentation = PresentationBuilder::default()
        .holder(Url::parse(&holder_request.did).map_err(Error::Core)?)
        .credential(credential)
        .build()
        .map_err(Error::Credential)?;

    Ok(())
}
 */
