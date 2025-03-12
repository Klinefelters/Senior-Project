use pv_recorder::PvRecorderBuilder;
use tauri::Manager;
mod vosk;

#[tauri::command]
async fn listen_and_transcribe(app_handle: tauri::AppHandle) -> String {
    let recorder = PvRecorderBuilder::new(512).init().expect("failed to initialize recorder");
    let mut transcription = "".to_string();
    println!("Starting transcription");

    
    loop {
        if !recorder.is_recording() {
            recorder.start().unwrap();
        }

        let frame = recorder.read().unwrap();

        if let Some(result) = vosk::recognize(&frame, true) {
            if result.is_empty() {
                continue;
            }
            println!("{}", result);
            app_handle
                .emit_all("transcription", result.clone())
                .expect("failed to emit transcription");
            transcription = result;
            if transcription.contains("stop") {
                transcription.replace("stop", "");
                break;
            }
        }

        // sleep(Duration::from_millis(30));
    }
    if recorder.is_recording() {
        recorder.stop().unwrap();
    }
    transcription
}

fn main() {
    vosk::init_vosk();
    tauri::Builder::default()
      // This is where you pass in your commands
      .invoke_handler(tauri::generate_handler![listen_and_transcribe])
      .run(tauri::generate_context!())
      .expect("failed to run app");
}
