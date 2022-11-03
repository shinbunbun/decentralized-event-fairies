use actix_web::{
    web::{self, Path},
    HttpResponse, Responder,
};
use identity_iota::core::FromJson;
use serde_json::Value;

use crate::{
    error::Error,
    issuer::{create_holder_account, issue_vc},
};

pub async fn issue(req: String) -> Result<HttpResponse, Error> {
    // let user_id = param.clone();

    // let holder = create_holder_account(&user_id).await?;

    let subject_value = Value::from_json(&req)?;

    // subject_value["id"] = Value::String(holder.did().to_string());

    let credential_type = "EventJoinProofCredential";

    let credential = issue_vc(subject_value, credential_type).await?;

    Ok(HttpResponse::Ok().body(credential.to_string()))
}
