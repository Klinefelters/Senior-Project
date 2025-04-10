// src/services/chatService.js
import OllamaService from './ollamaService';
import SpeechSynthesisService from './speechSynthesisService';

export async function handleChat(messages, setMessages, setState, piperModel="amy-medium") {
    if (setState) {
        setState('thinking');
    }

    
    
    const lastMessageIndex = messages.length - 1;
    const lastMessage = messages[lastMessageIndex];

    let fullResponse = await OllamaService.generateResponse('phi3', messages);

    console.log(fullResponse.message);

    setMessages([...messages, fullResponse.message ]);

    await SpeechSynthesisService.speak(fullResponse.message.content, piperModel, setState)
}