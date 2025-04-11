import { Box, Button, Input } from '@chakra-ui/react';
import MicrophoneButton from '../MicrophoneButton';

export default function Base({ onSubmit, setText, value, onChange }) {
    return(
        <Box
            bg="rgba(0,0,0,.25)"
            borderRadius="25px"
            border="1px solid white"
            h="65vh"
            w="50vw"
            as="form" onSubmit={onSubmit}
        >
            <MicrophoneButton setText={setText} />
            <Input type="text" w="25vw" ml="1vw" value={value} onChange={onChange} />
            <Button type="submit" w="10vw" ml="1vw">Send</Button>
        </Box>
    );
}