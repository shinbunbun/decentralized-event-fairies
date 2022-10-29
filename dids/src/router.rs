use actix_web::web;

pub fn router(cfg: &mut web::ServiceConfig) {
    cfg.route("/", web::get().to(|| async { "Hello world!" }));
}
