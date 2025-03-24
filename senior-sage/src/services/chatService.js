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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    let fullResponse = await OllamaService.generateResponse('phi3', messages);

    console.log(fullResponse.message);

    setMessages([...messages, fullResponse.message ]);

    SpeechSynthesisService.speak(fullResponse.message.content, setState)
=======
    let fullResponse = await OllamaService.generateResponse('tinyllama', lastMessage.content);
=======
 //   let fullResponse = await OllamaService.generateResponse('tinyllama', lastMessage.content);
    let fullResponse = await ragService.ragTalk(lastMessage.content);
>>>>>>> 95640d2 (added rag)

    console.log(fullResponse);

    setMessages([...messages, { role: 'assistant', content: fullResponse }]);

<<<<<<< HEAD
    SpeechSynthesisService.speak(fullResponse.response, setState)
>>>>>>> 56eca48 (testing)
=======
    SpeechSynthesisService.speak(fullResponse, setState)
>>>>>>> 080360e (moved .ragit, rag working sorta)
=======
    let fullResponse = await OllamaService.generateResponse('tinyllama', lastMessage.content);
=======
 //   let fullResponse = await OllamaService.generateResponse('tinyllama', lastMessage.content);
    let fullResponse = await ragService.ragTalk(lastMessage.content);
>>>>>>> efc05a9 (added rag)

    console.log(fullResponse);

    setMessages([...messages, { role: 'assistant', content: fullResponse.response }]);

    SpeechSynthesisService.speak(fullResponse.response, setState)
>>>>>>> 1c427a3 (testing)
}