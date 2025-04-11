import { invoke } from '@tauri-apps/api/tauri';
export default class SpeechSynthesisService {
	static async speak(input, model="amy-medium", setAvatarState=null) {
		
		if (setAvatarState) {
			setAvatarState("speaking");
			await invoke('speak_text', { inputText: input, model: model }).then(() => setAvatarState("base"))
		}else{
			await invoke('speak_text', {inputText: input, model: model}).then(() => console.log("done"))
		}
	}
}

