
use tauri::Manager;
use std::thread::sleep;
use std::time::Duration;
use std::process::Command;

use cpal::{
    traits::{DeviceTrait, HostTrait, StreamTrait},
    ChannelCount, SampleFormat,
};
use dasp::{sample::ToSample, Sample};
mod vosk;

#[tauri::command]
async fn speak_text(input_text: String) -> String {
    let command = format!("echo '{}' |   ./piper/piper --model ./piper/en_US-ryan-high.onnx --output-raw |   aplay -r 22050 -f S16_LE -t raw -", input_text);
    println!("Command: {}", command); // Print the command for debugging
    let output1 = Command::new("sh")
        .arg("-c")
        .arg(command)
        .output()
        .expect("Failed to execute command");
    println!("{:?}", &output1); // Use {:?} for debug formatting
    println!("Command Output:\n{}", String::from_utf8_lossy(&output1.stdout));  
    println!("Done");
    return "done".to_string();
}

fn main() {
    let audio_input_device = cpal::default_host()
        .default_input_device()
        .expect("No input device connected");

    let config = audio_input_device
        .default_input_config()
        .expect("Failed to load default input config");
    vosk::init_vosk(config.sample_rate().0 as f32);
    tauri::Builder::default()
      // This is where you pass in your commands
      .invoke_handler(tauri::generate_handler![listen_and_transcribe])
      .run(tauri::generate_context!())
      .expect("failed to run app");
}


fn recognize<T: Sample + ToSample<i16>>(
    app_handle: tauri::AppHandle,
    data: &[T],
    channels: ChannelCount,
)  {
    let data: Vec<i16> = data.iter().map(|v| v.to_sample()).collect();
    let data = if channels != 1 {
        stereo_to_mono(&data)
    } else {
        data
    };
    let recognized = vosk::recognize(&data, true);
    if let Some(text) = recognized {
        if text.is_empty() {
            return;
        }
        app_handle.emit_all("transcription", text.clone()).expect("failed to emit transcription");
        println!("Recognized: {}", text);
    }
}

pub fn stereo_to_mono(input_data: &[i16]) -> Vec<i16> {
    let mut result = Vec::with_capacity(input_data.len() / 2);
    result.extend(
        input_data
            .chunks_exact(2)
            .map(|chunk| chunk[0] / 2 + chunk[1] / 2),
    );

    result
}