import { invoke } from '@tauri-apps/api/tauri';
export default class ragService {

static async ragTalk(inputText) {
    try {
        const response = await invoke("ragtalk", { input: inputText });
        console.log("Response from Rust:", response);
        return response;
    } catch (error) {
        console.error("Error invoking Rust function:", error);
        return "error in rag process"
    }
}

// Example usage
}