fn main() {
    println!("cargo:rustc-link-search=libvosk");
    tauri_build::build()
}
