// src/services/chatService.js
import OllamaService from './ollamaService';
import SpeechSynthesisService from './speechSynthesisService';

export async function handleChat(messages, setMessages, setState) {
    if (setState) {
        setState('thinking');
    }

    const responseStream = await OllamaService.streamChat('tinyllama', messages);
    const reader = responseStream.body.getReader();
    const decoder = new TextDecoder('utf-8');
    setMessages([...messages, { role: 'assistant', content: '' }]);

    let fullResponse = '';

    reader.read().then(function processText({ done, value }) {
        if (done) {
            SpeechSynthesisService.speak(fullResponse, setState);
            return;
        }
        const responsePart = decoder.decode(value);
        const responseJson = JSON.parse(responsePart);
        setMessages((prevMessages) => {
            const lastMessageIndex = prevMessages.length - 1;
            const lastMessage = prevMessages[lastMessageIndex];
            const updatedLastMessage = { ...lastMessage, content: lastMessage.content + responseJson.message.content };
            const updatedMessages = [...prevMessages];
            updatedMessages[lastMessageIndex] = updatedLastMessage;
            return updatedMessages;
        });
        fullResponse += responseJson.message.content;
        return reader.read().then(processText);
    });
}