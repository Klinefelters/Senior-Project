fn main() {
    #[cfg(all(target_os = "linux", target_arch = "aarch64"))]
    {
        let lib_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap())
            .join("/home/orangepi/Senior-Project/senior-sage/src-tauri/libvosk");
        println!("cargo:rustc-link-search=libvosk");
    }

    tauri_build::build();
}