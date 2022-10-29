use actix_web::{
    web::{self, Path},
    HttpResponse, Responder,
};
use identity_iota::core::FromJson;
use serde_json::Value;

use crate::issuer::{create_holder_account, issue_vc};

pub async fn issue(req: String, param: Path<String>) -> impl Responder {
    let user_id = param.clone();

    let holder = create_holder_account(&user_id).await.unwrap();

    let subject_value = Value::from_json(&req).unwrap();

    let credential_type = "EventJoinProofCredential";

    let credential = issue_vc(subject_value, credential_type).await.unwrap();

    HttpResponse::Ok().body(credential.to_string())
}
