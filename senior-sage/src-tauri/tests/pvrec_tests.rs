// use pv_recorder::PvRecorderBuilder;

// #[cfg(test)]
// mod tests {
//     use super::*;

//     #[test]
//     fn test_pv_recorder_start() {
//         let recorder = PvRecorderBuilder::new(512).init().expect("Failed to initialize recorder");
//         assert!(!recorder.is_recording(), "Recorder should not be recording initially");

//         recorder.start().expect("Failed to start recorder");
//         assert!(recorder.is_recording(), "Recorder should be recording after start");

//         recorder.stop().expect("Failed to stop recorder");
//         assert!(!recorder.is_recording(), "Recorder should not be recording after stop");
//     }

//     #[test]
//     fn test_pv_recorder_record() {
//         let recorder = PvRecorderBuilder::new(512).init().expect("Failed to initialize recorder");

//         recorder.start().expect("Failed to start recorder");
//         assert!(recorder.is_recording(), "Recorder should be recording after start");

//         let frame = recorder.read().expect("Failed to read frame");
//         assert!(!frame.is_empty(), "Frame should not be empty");

//         recorder.stop().expect("Failed to stop recorder");
//         assert!(!recorder.is_recording(), "Recorder should not be recording after stop");
//     }
// }