// src/services/chatService.js
import OllamaService from './ollamaService';
import SpeechSynthesisService from './speechSynthesisService';

export async function handleChat(messages, setMessages, setState) {
    if (setState) {
        setState('thinking');
    }

    
    
    const lastMessageIndex = messages.length - 1;
    const lastMessage = messages[lastMessageIndex];

    let fullResponse = await OllamaService.generateResponse('tinyllama', lastMessage.content);

    console.log(fullResponse);

    setMessages([...messages, { role: 'assistant', content: fullResponse.response }]);

    SpeechSynthesisService.speak(fullResponse.response, setState)
}