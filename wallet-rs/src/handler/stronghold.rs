use actix_web::HttpResponse;

use crate::error::Error;

pub async fn post() -> Result<HttpResponse, Error> {
    Ok(HttpResponse::Ok().body("Hello world!"))
}
