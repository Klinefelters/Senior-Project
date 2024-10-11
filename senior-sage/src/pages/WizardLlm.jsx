import { useState } from "react";
import { Box, Input, Button, VStack, Flex, Center, Heading } from '@chakra-ui/react';
import Avatar from "../components/Avatar";
import MicrophoneButton from "../components/MicrophoneButton";
import OllamaService from '../services/ollamaService';
import SpeechSynthesisService from '../services/speechSynthesisService';

export default function WizardLlm() {
    const [state, setState] = useState("base");
    const [messages, setMessages] = useState([{role: 'system', content:''}]);
  const [input, setInput] = useState('');

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleFormSubmit = async (event) => {
      event.preventDefault();
      const userMessage = { role: 'user', content: input };
      setInput('');
      const newMessages = [...messages, userMessage];
      setMessages(newMessages)

      const responseStream = await OllamaService.streamChat('tinyllama', newMessages);
      const reader = responseStream.body.getReader();
      const decoder = new TextDecoder('utf-8');
      setMessages([...newMessages, { role: 'assistant', content: '' }]);

      let fullResponse = '';

      reader.read().then(function processText({ done, value }) {
          if (done) {
            SpeechSynthesisService.speak(fullResponse, setState)
            return;
          }
          setState("thinking");
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
  };

    return (
        <Center flexDirection="column">
            <Heading as="h1" size="xl" m="1em">Senior Sage</Heading>
            <Flex w="66vw" justify="space-between">
                <Avatar base="avatars/wizard/Base-transparentbg.png" listening="avatars/wizard/Listening-transparentbg.png" speaking="avatars/wizard/Speaking-transparentbg.png" thinking="avatars/wizard/Thinking-transparentbg.png" state={state} />
                <VStack w="33vw" m="3em" alignContent="left" spacing={2} >
                    {messages.map((message, index) => (
                        message.role !== 'system' ? (
                        <Box w="33vw" key={index} border="1px solid #4d4d4d" p="1em">
                            <strong>{message.role}:</strong> {message.content}
                        </Box>
                        ) : null
                    ))}
                    <Flex as="form" onSubmit={handleFormSubmit}>
                        <MicrophoneButton setText={setInput} setAvatarState={setState} />
                        <Input type="text" w="20vw" ml="1vw" value={input} onChange={handleInputChange} />
                        <Button type="submit" w="7vw" ml="1vw">Send</Button>
                    </Flex>
                </VStack>
            </Flex>
        </Center>

    )
}