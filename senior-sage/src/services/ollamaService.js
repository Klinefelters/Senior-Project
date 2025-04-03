const API_URL = "http://127.0.0.1:11434";

export default class OllamaService {
	static async generateResponse(model, prompt) {
		console.log("Prompt: ", prompt);
		const stream = false;
		const response = await fetch(API_URL + "/api/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				"model": model,
				"messages": prompt,
				"stream": stream
			}),
		});
		const data = await response.json();
		return data;
	}

	static streamResponse(model, prompt) {
		const stream = true;
		return fetch(API_URL + "/api/generate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model,
				prompt,
				stream,
			}),
		});
	}

	static async streamChat(model, messages) {
		return fetch(API_URL + "/api/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model,
				messages,
			}),
		});
	}
}
