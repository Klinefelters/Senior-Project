// src/services/chatService.js
import OllamaService from './ollamaService';
import SpeechSynthesisService from './speechSynthesisService';
import ragService from './ragService';
export async function handleChat(messages, setMessages, setState) {
    if (setState) {
        setState('thinking');
    }

    
    
    const lastMessageIndex = messages.length - 1;
    const lastMessage = messages[lastMessageIndex];

 //   let fullResponse = await OllamaService.generateResponse('tinyllama', lastMessage.content);
    let fullResponse = await ragService.ragTalk(lastMessage.content);

    console.log(fullResponse);

    setMessages([...messages, { role: 'assistant', content: fullResponse }]);

    SpeechSynthesisService.speak(fullResponse, setState)
}