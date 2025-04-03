import { invoke } from '@tauri-apps/api/tauri';
export default class SpeechSynthesisService {
	static async speak(input, setAvatarState=null) {
		
		if (setAvatarState) {
			setAvatarState("speaking");
			await invoke('speak_text', { inputText: input }).then(() => setAvatarState("base"))
		}else{
			await invoke('speak_text', {inputText: input}).then(() => console.log("done"))
		}
	}
}

