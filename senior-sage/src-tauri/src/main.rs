
use tauri::Manager;
use std::thread::sleep;
use std::time::Duration;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
use std::process::Command;
<<<<<<< HEAD
=======
>>>>>>> a226e0f (changed to cpal, working kinda)
=======
use std::process::Command;
>>>>>>> 9c16a01 (Added Piper live transctiption)
=======
use ragit::{Index, LoadMode, QueryTurn};
<<<<<<< HEAD
use std::io::Write;
>>>>>>> 95640d2 (added rag)
=======
use std::process::Command;
>>>>>>> 3f0ce3a (Added Piper live transctiption)

=======
use once_cell::sync::Lazy;
>>>>>>> 080360e (moved .ragit, rag working sorta)
use cpal::{
    traits::{DeviceTrait, HostTrait, StreamTrait},
    ChannelCount, SampleFormat,
};
use dasp::{sample::ToSample, Sample};
<<<<<<< HEAD
=======
>>>>>>> fe99dcf (STT is Integrated using voskrs and pvrecorder)
=======
>>>>>>> a226e0f (changed to cpal, working kinda)
mod vosk;

static INDEX: Lazy<Index> = Lazy::new(|| {
    Index::load("./".to_string(), LoadMode::QuickCheck)
        .expect("Failed to load index")
});

static mut HISTORY: Vec<QueryTurn> = Vec::new();


#[tauri::command]
async fn ragtalk(input: String) -> Result<String, String> {
    let response = INDEX.query(&input, unsafe { HISTORY.to_vec() })
        .await
        .map_err(|e| format!("Query error: {:?}", e))?;

    if response.response.trim() == "/q" {
        return Ok(response.response.clone());
    }

    unsafe {
        HISTORY.push(QueryTurn::new(input, response.clone()));
    }

    Ok(response.response)
}




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
<<<<<<< HEAD
=======
>>>>>>> a226e0f (changed to cpal, working kinda)
=======
>>>>>>> 9c16a01 (Added Piper live transctiption)
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
<<<<<<< HEAD
<<<<<<< HEAD
      .invoke_handler(tauri::generate_handler![listen_and_transcribe, speak_text])
      .invoke_handler(tauri::generate_handler![listen_and_transcribe, speak_text])
=======
      .invoke_handler(tauri::generate_handler![ragtalk, listen_and_transcribe, speak_text])
>>>>>>> 080360e (moved .ragit, rag working sorta)
=======
      .invoke_handler(tauri::generate_handler![listen_and_transcribe, speak_text])
>>>>>>> 316497c (Fixed)
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