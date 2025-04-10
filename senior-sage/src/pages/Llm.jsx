import React, { useState, useEffect } from 'react';
import { HStack, Center, Spinner} from '@chakra-ui/react';
import { handleChat } from '../services/chatService';
import Card  from '../components/cards/Card';
import InputCard from '../components/cards/InputCard';
import {listen} from '@tauri-apps/api/event'
import { motion } from 'framer-motion';


export default function Llm() {
  
  const [waiting, setWaiting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([{ role: 'system', content: 'You are Amy, a reporter that interviews residents at an assisted living facility called Juniper Village. Your goal is to share the residents stories with their loved ones, so keep the converstation going.' }]);
  const [input, setInput] = useState('');

  const handleInputChange = (event) => {
      setInput(event.target.value);
  };
  listen('transcription', (event) => {
    setInput(event.payload)
  })
  

  const handleFormSubmit = async (event) => {
    setWaiting(false);
    setLoading(true);
    event.preventDefault();
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    await handleChat(newMessages, setMessages);
    setWaiting(true);
    setLoading(false);
  };

  const introduction = useEffect(() => {
    const fetchIntroduction = async () => {
      const userMessage = { role: 'system', content: "Introduce yourself to the resident and ask for their name." };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');
      await handleChat(newMessages, setMessages);
      setLoading(false);
      setWaiting(true); 
    };
    fetchIntroduction();
    
  }, []);
    return (
      <Center flexDirection="column" minHeight="50vh">
      {loading ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }} // Start with opacity 0 and slide down
          animate={{ opacity: 1, y: 0 }}  // Fade in and slide to position
          exit={{ opacity: 0, y: -20 }}   // Fade out and slide up
          transition={{ duration: 0.3 }}  // Smooth transition
        >
          <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
        </motion.div>
      ) : (
      <HStack w="80vw" alignContent="left" spacing="2.5vw">
        {messages
          .slice(-1 * (waiting ? 1 : 2)) // Show only the last message or last two if no input card
          .map((message, index) => (
            message.role === 'assistant' ? (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  role={'Amy'}
                  content={message.content}
                />
              </motion.div>
            ) : null
          ))}
        {waiting ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <InputCard
              onSubmit={handleFormSubmit}
              setText={setInput}
              value={input}
              onChange={handleInputChange}
            />
          </motion.div>
        ) : null}
      </HStack>
    )}
  </Center>
  );
}