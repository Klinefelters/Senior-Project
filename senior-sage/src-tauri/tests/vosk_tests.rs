use once_cell::sync::OnceCell;
use vosk::{Model, Recognizer};
use std::sync::Mutex;

static MODEL: OnceCell<Model> = OnceCell::new();
static RECOGNIZER: OnceCell<Mutex<Recognizer>> = OnceCell::new();

pub fn init_vosk() {
    if !RECOGNIZER.get().is_none() {return;} // already initialized
    let model = Model::new("./model").unwrap();
    let mut recognizer = Recognizer::new(&model, 16000.0).unwrap();
    recognizer.set_max_alternatives(10);
    recognizer.set_words(true);
    recognizer.set_partial_words(true);
    let _ = MODEL.set(model);
    let _ = RECOGNIZER.set(Mutex::new(recognizer));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_vosk_initialization() {
        init_vosk();
        assert!(MODEL.get().is_some(), "Model should be initialized");
        assert!(RECOGNIZER.get().is_some(), "Recognizer should be initialized");
    }

    #[test]
    fn test_vosk_recognition() {
    init_vosk();
    let mut recognizer = RECOGNIZER.get().unwrap().lock().unwrap();
    let result = recognizer.accept_waveform(&[0; 16000]);
    assert_eq!(result, vosk::DecodingState::Running, "Recognizer should be running");
    }

    
}