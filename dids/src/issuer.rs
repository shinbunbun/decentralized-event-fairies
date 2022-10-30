use std::path::PathBuf;

use identity_iota::{
    account::{Account, IdentitySetup, MethodContent, Result},
    account_storage::Stronghold,
    client::{CredentialValidationOptions, CredentialValidator, FailFast},
    core::{Url, Value},
    credential::{Credential, CredentialBuilder, Subject},
    crypto::ProofOptions,
    did::DID,
};

use identity_iota::core::FromJson;

use crate::error::Error;

pub async fn issue_vc(
    subject_value: Value,
    // credential_id: &str,
    credential_type: &str,
) -> Result<Credential, Error> {
    let stronghold = create_stronghold("./hodl/issuer.hodl")
        .await
        .map_err(Error::AccountStorage)?;

    let mut issuer: Account = Account::builder()
        .storage(stronghold)
        .create_identity(IdentitySetup::default())
        .await
        .map_err(Error::Account)?;

    issuer
        .update_identity()
        .create_method()
        .content(MethodContent::GenerateEd25519)
        .fragment("issuerKey")
        .apply()
        .await
        .map_err(Error::Account)?;

    let subject: Subject = Subject::from_json_value(subject_value).map_err(Error::Core)?;

    let mut credential: Credential = CredentialBuilder::default()
        // .id(Url::parse(credential_id).map_err(Error::Core)?)
        .issuer(Url::parse(issuer.did().as_str()).map_err(Error::Core)?)
        .type_(credential_type)
        .subject(subject)
        .build()
        .map_err(Error::Credential)?;

    issuer
        .sign("#issuerKey", &mut credential, ProofOptions::default())
        .await
        .map_err(Error::Account)?;

    CredentialValidator::validate(
        &credential,
        &issuer.document(),
        &CredentialValidationOptions::default(),
        FailFast::FirstError,
    )
    .map_err(Error::CompoundCredentialValidation)?;

    Ok(credential)
}

pub async fn create_holder_account(user_id: &str) -> Result<Account, Error> {
    let stronghold = create_stronghold(&("./hodl/".to_string() + user_id + ".hodl"))
        .await
        .map_err(Error::AccountStorage)?;
    Account::builder()
        .storage(stronghold)
        .create_identity(IdentitySetup::default())
        .await
        .map_err(Error::Account)
}

pub async fn create_stronghold(
    path: &str,
) -> Result<Stronghold, identity_iota::account_storage::Error> {
    let stronghold_path: PathBuf = path.into();
    let password: String = "my-password".to_owned();
    Stronghold::new(&stronghold_path, password, None).await
}

#[cfg(test)]
mod tests {

    use super::*;
    use identity_iota::core::json;

    #[tokio::test]
    async fn test_issue_vc() {
        let user_id = "39c129a2-fee8-46a9-b8e6-9635f04b66f9";

        let holder = create_holder_account(user_id).await.unwrap();

        let subject_value = json!({
          "id": holder.document().id(),
          "user_id": user_id,
          "eventName": "学祭ハッカソン",
          "startDate": "2021-10-28T10:00:00+09:00",
          "endDate": "2021-10-30T19:00:00+09:00",
          "location": "会津大学",
          "description": "学祭ハッカソンです。",
          "organizer": "Zli",
        });

        // let credential_id = "https://example.edu/credentials/3732";

        let credential_type = "EventJoinProofCredential";

        let credential = issue_vc(subject_value, /* credential_id, */ credential_type)
            .await
            .unwrap();

        println!("credential: {:#}", credential);
    }
}
