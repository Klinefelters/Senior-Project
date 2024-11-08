import React, { useState } from 'react';
import { Box, Input, Button, VStack, Flex, Center, Heading } from '@chakra-ui/react';
import { handleChat } from '../services/chatService';
import MicrophoneButton from '../components/MicrophoneButton';

export default function Llm() {
    const [messages, setMessages] = useState([{ role: 'system', content: '' }]);
    const [input, setInput] = useState('');

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleFormSubmit = async (event) => {
      event.preventDefault();
      const userMessage = { role: 'user', content: input };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');
      await handleChat(newMessages, setMessages);
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
          <MicrophoneButton setText={setInput} />
          <Input type="text" w="50vw" ml="1vw" value={input} onChange={handleInputChange} />
          <Button type="submit" w="10vw" ml="1vw">Send</Button>
        </Flex>
      </VStack>
    </Center>
  );
}