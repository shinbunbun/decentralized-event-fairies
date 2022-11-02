use actix_web::web;

use crate::handler;

pub fn router(cfg: &mut web::ServiceConfig) {
    cfg.route("/", web::get().to(|| async { "Hello world!" }));
    cfg.route("/stronghold", web::post().to(handler::stronghold::post));
}
