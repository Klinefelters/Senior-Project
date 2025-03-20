import { useState, useEffect } from 'react';
import { IconButton } from '@chakra-ui/react';
import { FaMicrophone } from "react-icons/fa";
import { invoke } from '@tauri-apps/api/tauri'


export default function MicrophoneButton({ setText, setAvatarState=null }) {
    const [ready, setReady] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const size = "5vw";


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
            await invoke('listen_and_transcribe', {}).then((message) => console.log(message));
            setReady(true);
        }
    };

    return (
        <IconButton
            icon={<FaMicrophone />}
            // h={size}
            w={size}
            onClick={toggleMicrophone}
            isLoading={!ready}
            isDisabled={!ready}
        />
    );
}