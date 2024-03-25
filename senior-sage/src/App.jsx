import React, { useState } from 'react';
import { Box, UnorderedList, ListItem, Input, Button, VStack } from '@chakra-ui/react';
import OllamaService from './services/ollamaService';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    let tmp = input;
    setInput('');
    event.preventDefault();
    setMessages([...messages, { text: tmp, sender: 'user' }]);
    try{
      const response = await OllamaService.generateResponse('tinyllama', tmp);
      setMessages([...messages, { text: tmp, sender: 'user' }, { text: response.response, sender: 'bot' }]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <VStack spacing={4}>
      <UnorderedList>
        {messages.map((message, index) => (
          <ListItem key={index}>
            <strong>{message.sender}:</strong> {message.text}
          </ListItem>
        ))}
      </UnorderedList>
      <Box as="form" onSubmit={handleFormSubmit}>
        <Input type="text" value={input} onChange={handleInputChange} />
        <Button type="submit">Send</Button>
      </Box>
    </VStack>
  );
}

export default App;