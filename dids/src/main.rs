mod error;
mod handler;
mod holder;
mod issuer;
mod router;
mod utils;
mod verifier;

use actix_cors::Cors;
use actix_web::{http, middleware::Logger, App, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    HttpServer::new(move || {
        App::new()
            .wrap(
                Cors::default()
                    // .allowed_origin("*")
                    .allowed_origin_fn(|_, _| true)
                    .allowed_methods(vec!["POST"])
                    .allowed_headers(vec![http::header::ACCEPT])
                    .allowed_header(http::header::CONTENT_TYPE)
                    .max_age(3600),
            )
            .wrap(Logger::default())
            .configure(router::router)
    })
    .bind(("localhost", 8000))?
    .run()
    .await
}
