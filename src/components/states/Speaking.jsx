import { Box } from '@chakra-ui/react';

export default function Speaking({ role, content }) {
    return(
        <Box
            bg="rgba(0,0,0,.25)"
            borderRadius="25px"
            border="1px solid white"
            h="65vh"
            w="50vw"
            maxWidth="50vw"
        >
            <strong>{role}</strong>: {content}
        </Box>
    );
}