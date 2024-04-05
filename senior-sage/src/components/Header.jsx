import { Flex, Icon, Link, Spacer } from '@chakra-ui/react';
import { FaHome } from 'react-icons/fa';
import { Link as RouterLink } from "react-router-dom";

export default function Header() {
    return (
        <Flex p="10px" alignItems="center" bg="gray.700" fontSize="20px">
            <Link as={RouterLink} to={"/"} pr={2} >
                <Icon as={FaHome} />
            </Link>
            <Spacer />
        </Flex>
    );
}