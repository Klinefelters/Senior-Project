import React, { useState } from 'react';
import { Box, Input, Button, VStack, Flex, Center, Heading } from '@chakra-ui/react';
import OllamaService from '../services/ollamaService';
import SpeechSynthesisService from '../services/speechSynthesisService';

export default function Llm() {
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
          SpeechSynthesisService.speak(fullResponse)
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
};
  return (

    <Center flexDirection="column">
      <Heading as="h1" size="xl" m="1em">Senior Sage</Heading>
      <VStack w="66vw" m="3em" alignContent="left" spacing={2} >
      {messages.map((message, index) => (
        message.role !== 'system' ? (
          <Box w="66vw" key={index} border="1px solid #4d4d4d" p="1em">
            <strong>{message.role}:</strong> {message.content}
          </Box>
        ) : null
      ))}
        <Flex as="form" onSubmit={handleFormSubmit}>
          <Input type="text" w="55vw" value={input} onChange={handleInputChange} />
          <Button type="submit" w="10vw" ml="1vw">Send</Button>
        </Flex>
      </VStack>
    </Center>
  );
}