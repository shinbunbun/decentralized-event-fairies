use identity_iota::{
    account, account_storage, client::CompoundCredentialValidationError, core, credential,
};

#[derive(Debug)]
pub enum Error {
    AccountStorage(account_storage::Error),
    Account(account::Error),
    Core(core::Error),
    Credential(credential::Error),
    CompoundCredentialValidation(CompoundCredentialValidationError),
}
