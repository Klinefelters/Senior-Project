fn main() -> Result<(), Box<dyn std::error::Error>> {
    let app = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|_, _| {});
    Ok(())
}
