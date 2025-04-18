import { Flex } from '@chakra-ui/react';

export default function Speaking({ role, content }) {
    return(
        <Flex
            h="65vh"
            w="50vw"
            maxWidth="50vw"
            fontSize={"2vw"}
            alignContent={"center"}
            justifyContent={"center"}
        >
            {content}
        </Flex>
    );
}