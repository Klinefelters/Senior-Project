import { useState, useEffect } from 'react';
import { IconButton } from '@chakra-ui/react';
import { FaMicrophone } from "react-icons/fa";

import ConfirmationModal from './ConfirmationModal';
import { invoke } from '@tauri-apps/api/tauri';
import { useDisclosure } from '@chakra-ui/react';


export default function MicrophoneButton({ text, setText, submit, setAvatarState=null }) {
    const [ready, setReady] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const size = "15vw";
    const mic_size = "10vw";
    const borderRadius = `calc(${size} / 10)`;
    const { isOpen, onOpen, onClose } = useDisclosure()


    const toggleMicrophone = async () => {
        if (!ready) return;

        if (isListening) {
            if (setAvatarState){
                setAvatarState("base");
            }
            setIsListening(false);
        } else {
            if (setAvatarState){
                setAvatarState("listening");
            }
            setIsListening(true);
            setReady(false);
            await invoke('listen_and_transcribe', {}).then((message) => setText(message));
            setReady(true);
            onOpen();
        }
    };

    return (
        <>
            <ConfirmationModal
                isOpen={isOpen}
                onClose={onClose}
                submit={submit}
                text={text}
                setText={setText}
            />
            <IconButton
                icon={<FaMicrophone size={mic_size} />}
                h={size}
                w={size}
                m={borderRadius}
                borderRadius={borderRadius}
                onClick={toggleMicrophone}
                isLoading={!ready}
                isDisabled={!ready}
            />
        </>
    );
}