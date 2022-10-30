use identity_iota::{
    client::{
        CredentialValidationOptions, FailFast, PresentationValidationOptions, Resolver,
        SubjectHolderRelationship,
    },
    core::{Duration, FromJson, Timestamp},
    credential::Presentation,
    did::verifiable::VerifierOptions,
};

use crate::error::Error;

pub async fn verify(presentation: &str, challenge: &str) -> Result<(), Error> {
    let presentation: Presentation = Presentation::from_json(presentation).map_err(Error::Core)?;

    let presentation_verifier_options: VerifierOptions = VerifierOptions::new()
        .challenge(challenge.to_owned())
        .allow_expired(false);

    let credential_validation_options: CredentialValidationOptions =
        CredentialValidationOptions::default().earliest_expiry_date(
            Timestamp::now_utc()
                .checked_add(Duration::hours(10))
                .unwrap(),
        );

    let presentation_validation_options = PresentationValidationOptions::default()
        .presentation_verifier_options(presentation_verifier_options.clone())
        .shared_validation_options(credential_validation_options)
        .subject_holder_relationship(SubjectHolderRelationship::AlwaysSubject);

    let resolver: Resolver = Resolver::new().await.map_err(Error::Client)?;
    resolver
        .verify_presentation(
            &presentation,
            &presentation_validation_options,
            FailFast::FirstError,
            None,
            None,
        )
        .await
        .map_err(Error::Client)?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::verify;

    #[tokio::test]
    async fn test_verify() {
        verify("{
            \"@context\": \"https://www.w3.org/2018/credentials/v1\",
            \"type\": \"VerifiablePresentation\",
            \"verifiableCredential\": {
              \"@context\": \"https://www.w3.org/2018/credentials/v1\",
              \"type\": [
                \"VerifiableCredential\",
                \"EventJoinProofCredential\"
              ],
              \"credentialSubject\": {
                \"id\": \"did:iota:3jGTAQDx1Kc2tc9Z43UeB43rFmVmUQ3jdpvrwVxorNM1\",
                \"ping\": \"pong\"
              },
              \"issuer\": \"did:iota:DrQKu5ztsz8gxoDH2xP1v4k3kwMUwftzK7S5HzrE4j47\",
              \"issuanceDate\": \"2022-10-29T12:19:39Z\",
              \"proof\": {
                \"type\": \"JcsEd25519Signature2020\",
                \"verificationMethod\": \"did:iota:DrQKu5ztsz8gxoDH2xP1v4k3kwMUwftzK7S5HzrE4j47#issuerKey\",
                \"signatureValue\": \"43tamQv2SNX7PaHVAGzoeb5wxvV2uQG5UVVfz1Affk2gGR1pB4i54Eiqna3QMZkYtdc7HyrSqbiXxyx3er5YVPwc\"
              }
            },
            \"holder\": \"did:iota:3jGTAQDx1Kc2tc9Z43UeB43rFmVmUQ3jdpvrwVxorNM1\",
            \"proof\": {
              \"type\": \"JcsEd25519Signature2020\",
              \"verificationMethod\": \"did:iota:3jGTAQDx1Kc2tc9Z43UeB43rFmVmUQ3jdpvrwVxorNM1#key\",
              \"signatureValue\": \"5z5K8EsV6cXQBeedp6555K1aAgCfJFshqoAEL6t3p48tdRfqGBdGg2bhQECSTg1YjfmYK1XpLtMsQSRhvAABbrg4\",
              \"expires\": \"2100-10-29T14:04:18Z\",
              \"challenge\": \"challenge\"
            }
          }", "challenge").await.unwrap();
    }
}
