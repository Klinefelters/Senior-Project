import { useState } from "react";
import { Box, Input, Button, VStack, Flex, Center, Heading } from '@chakra-ui/react';
import Avatar from "../components/Avatar";
import MicrophoneButton from "../components/MicrophoneButton";
import { handleChat } from '../services/chatService';

export default function WizardLlm() {
    const [state, setState] = useState("base");
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
        await handleChat(newMessages, setMessages, setState);
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