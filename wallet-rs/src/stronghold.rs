use std::path::PathBuf;

use identity_iota::account_storage::Stronghold;

pub async fn create_stronghold(
    path: &str,
    password: &str,
) -> Result<Stronghold, identity_iota::account_storage::Error> {
    let stronghold_path: PathBuf = path.into();
    Stronghold::new(&stronghold_path, password.to_string(), None).await
}
