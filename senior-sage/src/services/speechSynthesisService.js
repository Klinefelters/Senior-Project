export default class SpeechSynthesisService {
	static async speak(text, setAvatarState=null, voice = 0, speed = 1, volume = 1, pitch = 1) {
		let speech = window.speechSynthesis;
		let utterance = new SpeechSynthesisUtterance(text);
		utterance.voice = speechSynthesis.getVoices()[voice];
		utterance.rate = speed;
		utterance.pitch = pitch;
		utterance.volume = volume;
		speech.cancel();
		speech.speak(utterance);
		if (setAvatarState) {
			setAvatarState("speaking");
			utterance.onend = () => {
				setAvatarState("base");
			};
		}
	}
}
