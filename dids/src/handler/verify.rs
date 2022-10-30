use actix_web::{web, HttpResponse, Responder};
use serde::Deserialize;

use crate::{error::Error, verifier};

#[derive(Deserialize)]
pub struct VerifyRequest {
    pub presentation_json: String,
    pub challenge: String,
}

pub async fn verify(body: web::Json<VerifyRequest>) -> Result<HttpResponse, Error> {
    let presentation_json = &body.presentation_json;
    let challenge = &body.challenge;

    verifier::verify(presentation_json, challenge).await?;

    Ok(HttpResponse::Ok().body(""))
}
