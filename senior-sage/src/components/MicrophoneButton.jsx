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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            await invoke('listen_and_transcribe', {}).then((message) => console.log(message));
=======
            await invoke('listen_and_transcribe', {}).then((message) => setText(message))
>>>>>>> fe99dcf (STT is Integrated using voskrs and pvrecorder)
=======
            await invoke('listen_and_transcribe', {}).then((message) => console.log(message));
>>>>>>> 57c7237 (Replace text setting with console logging in MicrophoneButton component)
=======
            await invoke('listen_and_transcribe', {}).then((message) => console.log(message));
>>>>>>> cf32b5f (Replace text setting with console logging in MicrophoneButton component)
=======
            await invoke('listen_and_transcribe', {}).then((message) => console.log(message));
>>>>>>> 6e62f4e14f88e1afa466b169f8fadd6cc369d405
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