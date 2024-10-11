import { useState, useEffect } from 'react';
import { IconButton } from '@chakra-ui/react';
import { FaMicrophone } from "react-icons/fa";
import { createModel } from "vosk-browser";

export default function MicrophoneButton({ setText, setAvatarState=null }) {
    const [recognizer, setRecognizer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ready, setReady] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [audioContext, setAudioContext] = useState(null);
    const [mediaStream, setMediaStream] = useState(null);
    const size = "5vw";

    const loadModel = async (path) => {
        setLoading(true);

        const model = await createModel("/models/" + path);

        const recognizer = new model.KaldiRecognizer(16000);
        recognizer.setWords(true);
        recognizer.on("result", (message) => {
            const result = message.result;
            setText((utt) => [...utt, result]);
        });

        recognizer.on("partialresult", (message) => {
            setText(message.result.partial);
        });

        setRecognizer(() => {
            setLoading(false);
            setReady(true);
            return recognizer;
        });
    };

    const toggleMicrophone = async () => {
        if (!ready) return;

        if (isListening) {
            if (setAvatarState){
                setAvatarState("base");
            }
            // Stop the microphone stream
            if (audioContext) {
                audioContext.close();
            }
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
            setIsListening(false);
        } else {
            if (setAvatarState){
                setAvatarState("listening");
            }
            // Start the microphone stream
            const stream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    channelCount: 1,
                    sampleRate: 16000
                },
            });

            const audioCtx = new AudioContext(); 

            // The following code is marked as deprecated in favor of AudioWorkletNode
            // it still works in most browsers, but should be replaced in the future
            const recognizerNode = audioCtx.createScriptProcessor(4096, 1, 1);
            recognizerNode.onaudioprocess = (event) => {
                try {
                    recognizer.acceptWaveform(event.inputBuffer);
                } catch (error) {
                    console.error('acceptWaveform failed', error);
                }
            };

            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(recognizerNode);
            recognizerNode.connect(audioCtx.destination);

            setAudioContext(audioCtx);
            setMediaStream(stream);
            setIsListening(true);
        }
    };

    useEffect(() => {
        loadModel('vosk-model-small-en-us-0.15.tar.gz');
    }, []);

    return (
        <IconButton
            icon={<FaMicrophone />}
            // h={size}
            w={size}
            onClick={toggleMicrophone}
            isLoading={loading}
            isDisabled={!ready}
        />
    );
}