// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use vosk::{Model, Recognizer};

    #[test]
    fn test_vosk_model_loading() {
        // Hardcoding samples from the example for a test
        let samples = vec![100, -2, 700, 30, 4, 5];
        let model_path = "./model"; 

        let model = Model::new(model_path).expect("Failed to create model");
        let mut recognizer = Recognizer::new(&model, 16000.0).expect("Failed to create recognizer");

        recognizer.set_max_alternatives(10);
        recognizer.set_words(true);
        recognizer.set_partial_words(true);

        for sample in samples.chunks(100) {
            recognizer.accept_waveform(sample);
            println!("{:#?}", recognizer.partial_result());
        }

        println!("{:#?}", recognizer.final_result().multiple().unwrap());
    }

    // use cpal::Data;
    use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
        
    #[test]
    fn test_cpal_recording() {
    
        // CPAL Audio Stream Setup
        let host = cpal::default_host();
        let device = host.default_input_device().expect("Failed to get default input device");
        
        let mut configs_range = device.supported_input_configs().expect("Failed to get supported input configs");
        let config = configs_range.next().expect("Failed to get next config").with_max_sample_rate().config();
        
        let stream = device.build_input_stream(
            &config,
            move |data: &[f32], _: &cpal::InputCallbackInfo| {
                println!("Received data: {:?}", data);
            },
            move |err| {
                eprintln!("Error occurred on stream: {}", err);
            },
            None
        ).expect("Failed to build input stream");
        
        // Start the stream
        stream.play().expect("Failed to start stream");
        
        // Keep the stream running for a certain duration
        std::thread::sleep(std::time::Duration::from_secs(10));
        
        println!("Recording finished.");
    
    }
        
        #[test]
    fn test_cpal_vosk_transcribing() {
        // Vosk Setup
        let model_path = "./model"; 
        let model = Model::new(model_path).expect("Failed to create model");
        let mut recognizer = Recognizer::new(&model, 16000.0).expect("Failed to create recognizer");
    
        recognizer.set_max_alternatives(10);
        recognizer.set_words(true);
        recognizer.set_partial_words(true);
    
        // CPAL Audio Stream Setup
        let host = cpal::default_host();
        let device = host.default_input_device().expect("Failed to get default input device");
    
        let mut configs_range = device.supported_input_configs().expect("Failed to get supported input configs");
        let config = configs_range.next().expect("Failed to get next config").with_max_sample_rate().config();
    
        let mut recognizer = std::sync::Arc::new(std::sync::Mutex::new(recognizer));
    
        let stream = device.build_input_stream(
            &config,
            {
                let mut recognizer = recognizer.clone();
                move |data: &[f32], _: &cpal::InputCallbackInfo| {
                    let mut recognizer = recognizer.lock().unwrap();
                    // Convert f32 data to i16
                    let data_i16: Vec<i16> = data.iter().map(|&sample| (sample * i16::MAX as f32) as i16).collect();
                    recognizer.accept_waveform(&data_i16);
                    println!("{:#?}", recognizer.partial_result());
                }
            },
            move |err| {
                eprintln!("Error occurred on stream: {}", err);
            },
            None
        ).expect("Failed to build input stream");
    
        // Start the stream
        stream.play().expect("Failed to start stream");
    
        println!("Stream started. Transcribing for 10 seconds...");
    
        // Keep the stream running for a certain duration
        std::thread::sleep(std::time::Duration::from_secs(10));
    
        println!("Transcribing finished.");
    }
}