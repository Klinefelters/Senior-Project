use std::process::Command;

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

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let app = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![speak_text])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|_, _| {});
    Ok(())
}