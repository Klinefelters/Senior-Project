import { Flex, Icon, Link, Spacer, Text } from '@chakra-ui/react';
import { FaHome } from 'react-icons/fa';
import { Link as RouterLink } from "react-router-dom";

export default function Header({ disable }) {
    const size = "50px";
    return (
        <Flex p="10px" alignItems="center" bg="gray.700" fontSize={size}>
            <Link
                as={disable ? undefined : RouterLink} // Disable navigation if `disable` is true
                to={disable ? undefined : "/"}
                pr={2}
                _hover={{ textDecoration: disable ? 'none' : 'underline' }}
                style={{ pointerEvents: disable ? 'none' : 'auto' }} // Prevent clicking when disabled
            >
                <Flex alignItems="center" color={disable ? "gray.500" : "white"}>
                    <Icon as={FaHome} h={size} w={size} mr="15px" ml="15px" />
                    <Text>Home</Text>
                </Flex>
            </Link>
            <Spacer />
        </Flex>
    );
}