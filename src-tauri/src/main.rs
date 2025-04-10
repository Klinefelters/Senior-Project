use tauri::Manager;
use std::process::Command;
use std::sync::mpsc::{self, Sender, Receiver};
// use std::thread::current;
use std::time::Duration;

use cpal::{
    traits::{DeviceTrait, HostTrait, StreamTrait},
    ChannelCount, SampleFormat,
};
use dasp::{sample::ToSample, Sample};
use dotenv::dotenv;
use std::env;

mod vosk;

#[tauri::command]
async fn listen_and_transcribe(app_handle: tauri::AppHandle) -> String {
    let audio_input_device = cpal::default_host()
        .default_input_device()
        .expect("No input device connected");

    let config = audio_input_device
        .default_input_config()
        .expect("Failed to load default input config");
    let channels = config.channels();


    let err_fn = move |err| {
        eprintln!("an error occurred on stream: {}", err);
    };
    println!("Starting transcription");

    let app_handle_clone = app_handle.clone();

    // Create a channel for communication
    let (tx, rx): (Sender<String>, Receiver<String>) = mpsc::channel();

    let stream = match config.sample_format() {
        SampleFormat::I8 => audio_input_device.build_input_stream(
            &config.into(),
            move |data: &[i8], _| recognize(app_handle_clone.clone(), &tx, data, channels),
            err_fn,
            None,
        ),
        SampleFormat::I16 => audio_input_device.build_input_stream(
            &config.into(),
            move |data: &[i16], _| recognize(app_handle_clone.clone(), &tx, data, channels),
            err_fn,
            None,
        ),
        SampleFormat::I32 => audio_input_device.build_input_stream(
            &config.into(),
            move |data: &[i32], _| recognize(app_handle_clone.clone(), &tx, data, channels),
            err_fn,
            None,
        ),
        SampleFormat::F32 => audio_input_device.build_input_stream(
            &config.into(),
            move |data: &[f32], _| recognize(app_handle_clone.clone(), &tx, data, channels),
            err_fn,
            None,
        ),
        sample_format => panic!("Unsupported sample format '{sample_format}'"),
    }
    .expect("Could not build stream");

    stream.play().expect("Could not play stream");

    let mut last_transcription= String::new();
    loop {
        if let Ok(current_transcription) = rx.recv_timeout(Duration::from_millis(500)) {
            if !last_transcription.is_empty() && current_transcription.is_empty() {
                break;
            }
            last_transcription = current_transcription.clone();
        }
    }

    drop(stream);
    last_transcription
}

#[tauri::command]
async fn speak_text(input_text: String, model: String) -> String {
    let sanitized_text = input_text.replace('\n', " ").replace('\'', "");

    let command = if env::var("OPERATING_SYSTEM").unwrap() == "Windows" {
        format!(
            "echo '{}' |   piper -m {}/en_US-{}.onnx --output-raw |   ffplay -f s16le -ar 22050 -autoexit -", 
            sanitized_text, env::var("PATH_TO_PIPER_MODELS").unwrap(), model
        )
    } else {
        format!(
            "echo '{}' |   piper -m {}/en_US-{}.onnx --output-raw |   aplay -r 22050 -f S16_LE -t raw -", 
            sanitized_text, env::var("PATH_TO_PIPER_MODELS").unwrap(), model
        )
    };

    println!("Command executed: {}", &command);
    let output1 = Command::new("sh")
        .arg("-c")
        .arg(command)
        .output()
        .expect("Failed to execute command");
    
    println!("Output: {}", String::from_utf8_lossy(&output1.stdout));
    return "done".to_string();
}

fn main() {
    dotenv().ok();

    if env::var("OPERATING_SYSTEM").is_err() {
        panic!("OPERATING_SYSTEM environment variable is not set. Please set it to be Windows or Linux.");
    }
    if env::var("PATH_TO_PIPER_MODELS").is_err() {
        panic!("PATH_TO_PIPER_MODELS environment variable is not set. Please set it to be the path to the folder containing the piper models.");
    }
  
    let audio_input_device = cpal::default_host()
        .default_input_device()
        .expect("No input device connected");

    let config = audio_input_device
        .default_input_config()
        .expect("Failed to load default input config");
    vosk::init_vosk(config.sample_rate().0 as f32);
    tauri::Builder::default()
      // This is where you pass in your commands
      .invoke_handler(tauri::generate_handler![listen_and_transcribe, speak_text])
      .run(tauri::generate_context!())
      .expect("failed to run app");
}


fn recognize<T: Sample + ToSample<i16>>(
    app_handle: tauri::AppHandle,
    tx: &Sender<String>,
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
        tx.send(text.clone()).expect("Failed to send transcription");
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