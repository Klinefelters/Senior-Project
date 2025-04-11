// src/services/chatService.js
import OllamaService from './ollamaService';
import SpeechSynthesisService from './speechSynthesisService';

import.meta.env

export async function handleChat(messages, setMessages, setState, piperModel="amy-medium") {
    const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL

    if (setState) {
        setState('thinking');
    }

    let fullResponse = await OllamaService.generateResponse(OLLAMA_MODEL, messages);

    console.log(fullResponse.message);

    setMessages([...messages, fullResponse.message ]);

    await SpeechSynthesisService.speak(fullResponse.message.content, piperModel, setState)
}

export async function introduce(messages, setState, piperModel="amy-medium") {
    if (setState) {
        setState('thinking');
    }
    await SpeechSynthesisService.speak(messages[1].content, piperModel, setState)
}