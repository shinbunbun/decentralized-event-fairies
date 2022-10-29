use uuid::Uuid;

pub fn gen() -> String {
    Uuid::new_v4().to_string()
}
