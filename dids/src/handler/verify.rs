use actix_web::{web, HttpResponse, Responder};
use serde::Deserialize;

use crate::verifier;

#[derive(Deserialize)]
pub struct VerifyRequest {
    pub presentation_json: String,
    pub challenge: String,
}

pub async fn verify(body: web::Json<VerifyRequest>) -> impl Responder {
    let presentation_json = &body.presentation_json;
    let challenge = &body.challenge;

    verifier::verify(presentation_json, challenge)
        .await
        .unwrap();

    HttpResponse::Ok().body("")
}
