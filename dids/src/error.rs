use identity_iota::{
    account, account_storage,
    client::{self, CompoundCredentialValidationError},
    core, credential,
};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum Error {
    #[error("AccountStorage: {0}")]
    AccountStorage(#[from] account_storage::Error),
    #[error("Account: {0}")]
    Account(#[from] account::Error),
    #[error("Core: {0}")]
    Core(#[from] core::Error),
    #[error("Credential: {0}")]
    Credential(#[from] credential::Error),
    #[error("CompoundCredentialValidation: {0}")]
    CompoundCredentialValidation(#[from] CompoundCredentialValidationError),
    #[error("Client: {0}")]
    Client(#[from] client::Error),
}
