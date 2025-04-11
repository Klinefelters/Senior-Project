import { Flex, Spinner } from '@chakra-ui/react';

export default function Thinking() {
    return(
        <Flex w="50vw" h="100%" justifyContent="center" alignItems="center">
            <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
        </Flex>
    );
}