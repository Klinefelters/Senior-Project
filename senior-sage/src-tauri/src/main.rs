
use tauri::Manager;
use std::thread::sleep;
use std::time::Duration;

use cpal::{
    traits::{DeviceTrait, HostTrait, StreamTrait},
    ChannelCount, SampleFormat,
};
use dasp::{sample::ToSample, Sample};
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

    let stream = match config.sample_format() {
        SampleFormat::I8 => audio_input_device.build_input_stream(
            &config.into(),
            move |data: &[i8], _| recognize(app_handle.clone(), data, channels),
            err_fn,
            None,
        ),
        SampleFormat::I16 => audio_input_device.build_input_stream(
            &config.into(),
            move |data: &[i16], _| recognize(app_handle.clone(), data, channels),
            err_fn,
            None,
        ),
        SampleFormat::I32 => audio_input_device.build_input_stream(
            &config.into(),
            move |data: &[i32], _| recognize(app_handle.clone(), data, channels),
            err_fn,
            None,
        ),
        SampleFormat::F32 => audio_input_device.build_input_stream(
            &config.into(),
            move |data: &[f32], _| recognize(app_handle.clone(), data, channels),
            err_fn,
            None,
        ),
        sample_format => panic!("Unsupported sample format '{sample_format}'"),
    }
    .expect("Could not build stream");

    stream.play().expect("Could not play stream");
    sleep(Duration::from_secs(5));
    drop(stream);
    let result = "Transcription stopped".to_string();
    result
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