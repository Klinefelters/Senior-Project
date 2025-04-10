import { useState, useEffect } from 'react';
import { Image } from '@chakra-ui/react';

export default function Avatar({ base, speaking, state }) {
    // const [currentImage, setCurrentImage] = useState(base);

    // useEffect(() => {
    //     if (state === 'speaking') {
    //         const interval = setInterval(() => {
    //             setCurrentImage(prevImage => prevImage === base ? speaking : base);
    //         }, 250);
    //         return () => clearInterval(interval);
    //     } else {
    //         setCurrentImage(base);
    //     }
    // }, [state]);

    
    return (
        <Image src={base} w="30vw" h="30vw"/>
    )
}