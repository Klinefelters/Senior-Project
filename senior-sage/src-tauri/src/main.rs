use inputbot::KeybdKey::SpaceKey;
use std::thread;
use tauri::Manager;

fn main() {
    let app = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    let app_handle = app.handle();

    SpaceKey.bind(move || {
        app_handle.emit_all("spacebar", true).unwrap();
    });

    thread::spawn(|| {
        inputbot::handle_input_events();
    });

    app.run(|_, _| {});
}
