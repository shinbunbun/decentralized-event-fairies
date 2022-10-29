use actix_web::{web, HttpResponse, Responder};
use identity_iota::core::FromJson;
use serde::Deserialize;
use serde_json::Value;

use crate::{
    holder::{create_vp, HolderRequest, VerifierRequest},
    issuer::create_holder_account,
};

#[derive(Deserialize)]
pub struct PresentationRequest {
    pub credential_json: String,
    pub did: String,
    pub challenge: String,
    pub expires: i64,
}

pub async fn presentation(
    body: web::Json<PresentationRequest>,
    param: web::Path<String>,
) -> impl Responder {
    let user_id = param.clone();

    let verifier_request = VerifierRequest {
        challenge: body.challenge.clone(),
        expires: body.expires,
    };

    let holder_request = HolderRequest {
        credential_json: body.credential_json.clone(),
        user_id,
        did: body.did.clone(),
    };

    let presentation = create_vp(&verifier_request, &holder_request).await.unwrap();

    HttpResponse::Ok().body(presentation.to_string())
}
