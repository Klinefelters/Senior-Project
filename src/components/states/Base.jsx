import { Box, Input } from '@chakra-ui/react';
import MicrophoneButton from '../MicrophoneButton';

export default function Base({ onSubmit, setText, value, onChange }) {
    return(
        <Box
            // bg="rgba(0,0,0,.25)"
            borderRadius="25px"
            // border="1px solid white"
            h="65vh"
            w="50vw"
            as="form" onSubmit={onSubmit}
        >
            <Input 
                type="text" 
                w="100%" 
                ml="1vw" 
                value={value} 
                onChange={onChange}
                variant="flushed"
                fontSize={"2vw"}
                opacity={(value.length > 1) ? "1" : ".01"}
            />

            <MicrophoneButton text={value} setText={setText} submit={onSubmit} />

        </Box>
    );
}