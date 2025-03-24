import { invoke } from '@tauri-apps/api/tauri';
export default class ragService {

static async ragTalk(inputText) {
    try {
<<<<<<< HEAD
        const response = await invoke("ragtalk", { input: inputText });
=======
        const response = await invoke("rag_talk", { input: inputText });
>>>>>>> efc05a9 (added rag)
        console.log("Response from Rust:", response);
        return response;
    } catch (error) {
        console.error("Error invoking Rust function:", error);
        return "error in rag process"
    }
}

// Example usage
}