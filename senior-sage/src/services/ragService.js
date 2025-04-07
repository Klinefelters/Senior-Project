import { invoke } from '@tauri-apps/api/tauri';
export default class ragService {

static async ragTalk(inputText) {
    try {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        const response = await invoke("ragtalk", { input: inputText });
=======
        const response = await invoke("rag_talk", { input: inputText });
>>>>>>> efc05a9 (added rag)
=======
        const response = await invoke("ragtalk", { input: inputText });
>>>>>>> 818d89e (moved .ragit, rag working sorta)
=======
        const response = await invoke("ragtalk", { input: inputText });
>>>>>>> 6e62f4e14f88e1afa466b169f8fadd6cc369d405
        console.log("Response from Rust:", response);
        return response;
    } catch (error) {
        console.error("Error invoking Rust function:", error);
        return "error in rag process"
    }
}

// Example usage
}