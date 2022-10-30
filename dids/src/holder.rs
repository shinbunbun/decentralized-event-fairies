use std::str::FromStr;

use identity_iota::{
    account::{Account, MethodContent},
    core::{FromJson, Timestamp, Url},
    credential::{Credential, Presentation, PresentationBuilder},
    crypto::ProofOptions,
    iota_core::IotaDID,
};

use crate::{error::Error, issuer::create_stronghold};

pub struct VerifierRequest {
    pub challenge: String,
    pub expires: i64,
}

pub struct HolderRequest {
    pub credential_json: String,
    pub user_id: String,
    pub did: String,
}

pub async fn create_vp(
    verifier_request: &VerifierRequest,
    holder_request: &HolderRequest,
) -> Result<Presentation, Error> {
    let challenge = &verifier_request.challenge;

    let expires = Timestamp::from_unix(verifier_request.expires).map_err(Error::Core)?;

    let credential: Credential =
        Credential::from_json(&holder_request.credential_json).map_err(Error::Core)?;

    let mut presentation: Presentation = PresentationBuilder::default()
        .holder(Url::parse(&holder_request.did).map_err(Error::Core)?)
        .credential(credential)
        .build()
        .map_err(Error::Credential)?;

    let stronghold =
        create_stronghold(&("./hodl/".to_string() + &holder_request.user_id + ".hodl"))
            .await
            .map_err(Error::AccountStorage)?;

    let mut holder: Account = Account::builder()
        .storage(stronghold)
        .load_identity(IotaDID::from_str(&holder_request.did).unwrap())
        .await
        .map_err(Error::Account)?;

    holder
        .update_identity()
        .create_method()
        .content(MethodContent::GenerateEd25519)
        .fragment("key")
        .apply()
        .await
        .map_err(Error::Account)?;

    holder
        .sign(
            "#key",
            &mut presentation,
            ProofOptions::new()
                .challenge(challenge.to_string())
                .expires(expires),
        )
        .await
        .map_err(Error::Account)?;

    Ok(presentation)
}

#[cfg(test)]
mod tests {

    use super::{HolderRequest, VerifierRequest};

    #[tokio::test]
    async fn create_vp_test() {
        let verifier_request = VerifierRequest {
            challenge: "challenge".to_string(),
            expires: 4128501858,
        };

        let holder_request = HolderRequest {
            credential_json: "{\"@context\":\"https://www.w3.org/2018/credentials/v1\",\"type\":[\"VerifiableCredential\",\"EventJoinProofCredential\"],\"credentialSubject\":{\"id\":\"did:iota:3jGTAQDx1Kc2tc9Z43UeB43rFmVmUQ3jdpvrwVxorNM1\",\"ping\":\"pong\"},\"issuer\":\"did:iota:DrQKu5ztsz8gxoDH2xP1v4k3kwMUwftzK7S5HzrE4j47\",\"issuanceDate\":\"2022-10-29T12:19:39Z\",\"proof\":{\"type\":\"JcsEd25519Signature2020\",\"verificationMethod\":\"did:iota:DrQKu5ztsz8gxoDH2xP1v4k3kwMUwftzK7S5HzrE4j47#issuerKey\",\"signatureValue\":\"43tamQv2SNX7PaHVAGzoeb5wxvV2uQG5UVVfz1Affk2gGR1pB4i54Eiqna3QMZkYtdc7HyrSqbiXxyx3er5YVPwc\"}}".to_string(),
            user_id: "2".to_string(),
            did: "did:iota:3jGTAQDx1Kc2tc9Z43UeB43rFmVmUQ3jdpvrwVxorNM1".to_string(),
        };

        let vp = super::create_vp(&verifier_request, &holder_request)
            .await
            .unwrap();

        println!("{:#}", vp);
    }
}
