use actix_web::ResponseError;
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
    #[error("JsonWebToken: {0}")]
    JsonWebToken(#[from] jsonwebtoken::errors::Error),
}

impl ResponseError for Error {
    fn status_code(&self) -> actix_web::http::StatusCode {
        match self {
            Error::AccountStorage(_)
            | Error::Account(_)
            | Error::Core(_)
            | Error::Credential(_)
            | Error::CompoundCredentialValidation(_)
            | Error::Client(_)
            | Error::JsonWebToken(_) => actix_web::http::StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn error_response(&self) -> actix_web::HttpResponse<actix_web::body::BoxBody> {
        actix_web::HttpResponse::build(self.status_code()).body(self.to_string())
    }
}
