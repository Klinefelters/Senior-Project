import React, { useState, useEffect } from 'react';
import { Center, Flex } from '@chakra-ui/react';
import { handleChat } from '../services/chatService';
import {listen} from '@tauri-apps/api/event'
import { AnimatePresence, motion } from 'framer-motion';

// Different display components for each state
import Speaking from '../components/states/Speaking';
import Base from '../components/states/Base';
import Thinking from '../components/states/Thinking';
import Avatar from '../components/Avatar';


export default function David({headerDisabled, setHeaderDisabled}) {

  const [state, setState] = useState('thinking');
  // State can be 'thinking', 'speaking', 'listening', or 'base'

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const voice = "kusal-medium";

  
  listen('transcription', (event) => {
    setInput(event.payload)
  })

  useEffect(() => {
    const fetchIntroduction = async () => {
      setHeaderDisabled(true);
      const introduction = { role: 'system', content: "You are Ryan, a reporter that interviews residents at an assisted living facility called Juniper Village. Your goal is to share the residents stories with their loved ones, so keep the converstation going. Introduce yourself to the resident and ask for their name. Keep it short." };
      const newMessages = ([introduction]);
      await handleChat(newMessages, setMessages, setState, voice);
      setHeaderDisabled(false);
    };
    fetchIntroduction();
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setHeaderDisabled(true);
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    await handleChat(newMessages, setMessages, setState, voice);
    setHeaderDisabled(false);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  
  return (
    <Center flexDirection="column" minHeight="50vh">
      <AnimatePresence mode="wait">
        <Flex>
          <motion.div
              key="avatar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
          >
            <Avatar 
              base="avatars/ryan/base.png" 
              state={state}
            />
          </motion.div>
          {state === 'thinking' && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Thinking />
            </motion.div>
          )}
          {state === 'speaking' && (
            <motion.div
              key="speaking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Speaking role={messages[messages.length - 1].role} content={messages[messages.length - 1].content} />
            </motion.div>
          )}
          {(state === 'base' || state === 'listening') && (
            <motion.div
              key="base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Base onSubmit={handleFormSubmit} setText={setInput} value={input} onChange={handleInputChange} />
            </motion.div>
          )}
        </Flex>
      </AnimatePresence>
    </Center>
  );
}