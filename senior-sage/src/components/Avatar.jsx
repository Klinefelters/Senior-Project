import { useState, useEffect } from 'react';
import { Image } from '@chakra-ui/react';

export default function Avatar({ base, listening, speaking, thinking, state }) {
    const [currentImage, setCurrentImage] = useState(base);

    useEffect(() => {
        if (state === 'speaking') {
            const interval = setInterval(() => {
                setCurrentImage(prevImage => prevImage === base ? speaking : base);
            }, 250);
            return () => clearInterval(interval);
        } else if (state === 'listening') {
            setCurrentImage(listening);
        } else if (state === 'thinking') {
            setCurrentImage(thinking);
        } else {
            setCurrentImage(base);
        }
    }, [state]);

    
    return (
        <Image src={currentImage} w="20vw" h="20vw"/>
    )
}