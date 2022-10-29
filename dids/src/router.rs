use actix_web::web;

use crate::handler;

pub fn router(cfg: &mut web::ServiceConfig) {
    cfg.route("/", web::get().to(|| async { "Hello world!" }));
    cfg.route("/issue/{user_id}", web::post().to(handler::issue::issue));
    cfg.route(
        "/presentation/{user_id}",
        web::post().to(handler::presentation::presentation),
    );
}
