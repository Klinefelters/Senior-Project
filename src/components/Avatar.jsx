import { Image } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export default function Avatar({ base, state }) {
    return (
        <motion.div
            animate={
                state === 'speaking'
                    ? { y: [-5, 5, -5] } // Shake animation
                    : { y: 0 } // Reset position when not speaking
            }
            transition={
                state === 'speaking'
                    ? { duration: 0.25, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0.1 }
            }
        >
            <Image src={base} w="30vw" h="30vw" />
        </motion.div>
    );
}