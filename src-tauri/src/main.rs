use tauri::Manager;

use std::{
    process::Command,
    sync::mpsc::{self, Sender, Receiver},
    time::Duration
};

// environment variable libraries
use dotenv::dotenv;
use std::env;

// Audio processing libraries
use cpal::{
    traits::{DeviceTrait, HostTrait, StreamTrait},
    ChannelCount, SampleFormat,
};
use dasp::{sample::ToSample, Sample};

// Text cleaning 
use regex::Regex;
use std::collections::HashMap;

// File system libraries
use std::fs;

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
    let processed_text = remove_cont_and_abb(&input_text).await;
    let sanitized_text = processed_text.replace('\n', " ").replace('\'', "");
    
    let temp_dir = std::env::temp_dir();
    let output_path = temp_dir.join("output.wav");
    let output_fixed_path = temp_dir.join("output_fixed.wav");

    let command = if env::var("OPERATING_SYSTEM").unwrap() == "Windows" {
        format!(
            "echo '{}' |   piper -m {}/en_US-{}.onnx --output-raw |   ffplay -f s16le -ar 22050 -autoexit -", 
            sanitized_text, env::var("PATH_TO_PIPER_MODELS").unwrap(), model
            
        )
    } else {
        format!(
            "echo '{}' | piper -m {}/en_US-{}.onnx --output-file '{}' && \
            sox '{}' -r 44100 -c 2 '{}' && \
            aplay -D plughw:CARD=rockchipes8388,DEV=0 '{}'",
            sanitized_text,
            env::var("PATH_TO_PIPER_MODELS").unwrap(),
            model,
            output_path.display(),
            output_path.display(),
            output_fixed_path.display(),
            output_fixed_path.display()
        )
    };

    println!("Command executed: {}", &command);
    let output1 = Command::new("sh")
        .arg("-c")
        .arg(command)
        .output()
        .expect("Failed to execute command");
    
    println!("Output: {}", String::from_utf8_lossy(&output1.stdout));

    if let Err(e) = fs::remove_file(&output_path) {
        eprintln!("Failed to delete {}: {}", output_path.display(), e);
    }
    if let Err(e) = fs::remove_file(&output_fixed_path) {
        eprintln!("Failed to delete {}: {}", output_fixed_path.display(), e);
    }
    return "done".to_string();
}
async fn remove_cont_and_abb(input: &str) -> String {
    let mut contractions = HashMap::new();

    // Common English contractions
    contractions.insert(r"\bI'm\b", "I am");
    contractions.insert(r"\byou're\b", "you are");
    contractions.insert(r"\bwe're\b", "we are");
    contractions.insert(r"\bthey're\b", "they are");
    contractions.insert(r"\bcan't\b", "cannot");
    contractions.insert(r"\bdon't\b", "do not");
    contractions.insert(r"\bdoesn't\b", "doesnt");
    contractions.insert(r"\bwon't\b", "will not");
    contractions.insert(r"\bwouldn't\b", "would not");
    contractions.insert(r"\bshouldn't\b", "shouldnt");
    contractions.insert(r"\bcouldn't\b", "could not");
    contractions.insert(r"\bhaven't\b", "have not");
    contractions.insert(r"\bhasn't\b", "has not");
    contractions.insert(r"\bhadn't\b", "had not");
    contractions.insert(r"\bI'll\b", "I will");
    contractions.insert(r"\byou'll\b", "you will");
    contractions.insert(r"\bwe'll\b", "we will");
    contractions.insert(r"\bthey'll\b", "they will");
    contractions.insert(r"\bI've\b", "I have");
    contractions.insert(r"\byou've\b", "you have");
    contractions.insert(r"\bwe've\b", "we have");
    contractions.insert(r"\bthey've\b", "they have");
    contractions.insert(r"\bit's\b", "it is");
    contractions.insert(r"\bthat's\b", "that is");
    contractions.insert(r"\bwhat's\b", "what is");
    contractions.insert(r"\bthere's\b", "there is");
    contractions.insert(r"\bwho's\b", "who is");

    // Abbreviations
    contractions.insert(r"\bDr.\s?", "Doctor ");
    contractions.insert(r"\bMr.\s?", "Mister ");
    contractions.insert(r"\bMrs.\s?", "Missus ");
    contractions.insert(r"\bMs.\s?", "Miz ");
    contractions.insert(r"\bSt.\s?", "Street ");
    contractions.insert(r"\bAve.\s?", "Avenue ");
    contractions.insert(r"\bJr.\s?", "Junior ");
    contractions.insert(r"\bSr.\s?", "Senior ");
    contractions.insert(r"\bInc.\s?", "Incorporated ");
    contractions.insert(r"\be.g.\s?", "for example ");
    contractions.insert(r"\bi.e.\s?", "that is ");
    contractions.insert(r"\betc.\s?", "et cetera ");
    contractions.insert(r"\bvs.\s?", "versus ");
    contractions.insert(r"\bNo.\s?", "Number ");

    let mut output = input.to_string();
    for (pattern, replacement) in contractions {
        let re = Regex::new(pattern).unwrap();
        output = re.replace_all(&output, replacement).to_string();
    }

    output
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