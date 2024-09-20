import { useState, useEffect } from 'react';
import { IconButton} from '@chakra-ui/react';
import { FaMicrophone } from "react-icons/fa";
import { createModel, KaldiRecognizer, Model } from "vosk-browser";

export default function MicrophoneButton({setText}) {
    const [utterances, setUtterances] = useState([]);
    const [partial, setPartial] = useState("");
    const [recognizer, setRecognizer] = useState(null);
    const [loadedModel, setLoadedModel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ready, setReady] = useState(false);
    const size = "5vw";

    const loadModel = async (path) => {
        setLoading(true);

        const model = await createModel( "/models/" + path);
        setLoadedModel({ model, path });

        const recognizer = new model.KaldiRecognizer(48000);
        recognizer.setWords(true);
        recognizer.on("result", (message) => {
            const result= message.result;
            setUtterances((utt) => [...utt, result]);
            setText((utt) => [...utt, result]);
        });

        recognizer.on("partialresult", (message) => {
            setPartial(message.result.partial);
            setText(message.result.partial);
        });

        setRecognizer(() => {
            setLoading(false);
            setReady(true);
            return recognizer;
        });
        console.log("Model loaded");
    }

    useEffect(() => {
        loadModel('vosk-model-small-en-us-0.15.tar.gz')
    }, []);

    return (
        <IconButton icon={<FaMicrophone/>} h={size} w={size} />
    );
}