import { SimpleGrid, Image, Link, Text, Center } from '@chakra-ui/react';
import { Link as RouterLink } from "react-router-dom";

export default function Home ({headerDisabled, setHeaderDisabled}) {
    const apps = [
        { path: "/ryan", image: "/avatars/ryan/base.png", name: "Ryan" },
        { path: "/amy", image: "/avatars/amy/base.png", name: "Amy" },
        { path: "/william", image: "/avatars/william/base.png", name: "William" },
    ];
    return (
  <SimpleGrid minChildWidth="20vw" spacing="75px" pt="5vh">
    {apps.map((app, index) => (
      <Link key={index} as={RouterLink} to={app.path}>
        <Image bg="rgba(0,0,0,.25)" borderRadius="25px" border="1px solid white" maxW="50vh" w="100%" src={app.image}/>
        <Center>
          <Text fontSize="2xl" fontWeight="bold" color="white" mt="10px">
            {app.name}
          </Text>
        </Center>
      </Link>
    ))}
  </SimpleGrid>
);
}