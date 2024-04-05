import { Flex, Icon, Link, Spacer } from '@chakra-ui/react';
import { FaHome } from 'react-icons/fa';
import { Link as RouterLink } from "react-router-dom";

export default function Header() {
    const size = "25px";
    return (
        <Flex p="10px" alignItems="center" bg="gray.700" fontSize={size} >
            <Link as={RouterLink} flex-direction="row" to={"/"} pr={2} _hover={{ textDecoration: 'none' }}>
                <Flex alignItems="center">
                    <Icon as={FaHome} h={size} w={size} mr="2"/>
                    Home
                </Flex>
            </Link>
            <Spacer />
        </Flex>
    );
}