use inputbot::KeybdKey::CapsLockKey;
use pv_recorder::PvRecorderBuilder;
use std::{thread, thread::sleep, time::Duration};
use tauri::Manager;

mod vosk;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let app = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    let app_handle = app.handle();

    vosk::init_vosk();

    let recorder = PvRecorderBuilder::new(512).init()?;

    CapsLockKey.bind(move || {
        while CapsLockKey.is_toggled() {

            if !recorder.is_recording() {
                recorder.start().unwrap();
            }

            let frame = recorder.read().unwrap();

            if let Some(transcription) = vosk::recognize(&frame, true) {
                if transcription.is_empty() {
                    continue;
                }
                println!("{}", transcription);
                app_handle
                    .emit_all("transcription", transcription)
                    .expect("failed to emit transcription");
            }

            
            sleep(Duration::from_millis(30));
        }
        if recorder.is_recording(){
            recorder.stop().unwrap();
        }
        
    });

    thread::spawn(|| {
        inputbot::handle_input_events();
    });

    app.run(|_, _| {});
    Ok(())
}
