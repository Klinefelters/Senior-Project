fn main() {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    #[cfg(all(target_os = "linux", target_arch = "aarch64"))]
=======
    #[cfg(all(target_os = "linux", target_arch = "arm"))]
>>>>>>> beca9b5 (Added a conditional compile for linux)
=======
    #[cfg(all(target_os = "linux", target_arch = "arm"))]
>>>>>>> 973d039 (Added a conditional compile for linux)
    {
        let lib_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap())
            .join("/home/orangepi/Senior-Project/senior-sage/src-tauri/libvosk");
        println!("cargo:rustc-link-search=libvosk");
    }

    tauri_build::build();
<<<<<<< HEAD
<<<<<<< HEAD
}
=======
    // println!("cargo:rustc-link-search=libvosk");
    println!("cargo:rustc-link-lib=libvosk");
=======
=======
    let lib_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap()).join("/home/orangepi/Senior-Project/senior-sage/src-tauri/libvosk");
>>>>>>> d8014de (Adding a Perma Path for libvosk.so)
=======
    //let lib_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap()).join("/home/orangepi/Senior-Project/senior-sage/src-tauri/libvosk");
>>>>>>> a226e0f (changed to cpal, working kinda)
    println!("cargo:rustc-link-search=libvosk");
>>>>>>> 802744a (Fixed Linking Error)
    tauri_build::build()
}
>>>>>>> 4471958 (Small Changes for Linux)
=======
}
>>>>>>> beca9b5 (Added a conditional compile for linux)
=======
}
>>>>>>> 973d039 (Added a conditional compile for linux)
