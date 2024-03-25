import axios from "axios";

const API_URL = "http://127.0.0.1:11434";

export default class OllamaService {
	static async generateResponse(
		model,
		prompt,
		// images = [],
		// format = "json",
		// options = {},
		// system = "",
		// template = "",
		// context = "",
		stream = false
		// raw = false,
		// keep_alive = "5m"
	) {
		const { data } = await axios.post(API_URL + "/api/generate", {
			model,
			prompt,
			// images,
			// format,
			// options,
			// system,
			// template,
			// context,
			stream,
			// raw,
			// keep_alive,
		});
		return data;
	}
}
