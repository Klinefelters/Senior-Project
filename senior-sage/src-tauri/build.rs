fn main() {
    let lib_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap()).join("/home/orangepi/Senior-Project/senior-sage/src-tauri/libvosk");
    println!("cargo:rustc-link-search=libvosk");
    tauri_build::build()
}
