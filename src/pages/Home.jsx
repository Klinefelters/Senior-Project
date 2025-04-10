import { SimpleGrid, Image, Link } from '@chakra-ui/react';
import { Link as RouterLink } from "react-router-dom";

export default function Home ({headerDisabled, setHeaderDisabled}) {
    const apps = [
        { path: "/amy", image: "/avatars/amy/base.png" },
        { path: "/ryan", image: "/avatars/ryan/base.png" },
        { path: "/david", image: "/avatars/ryan/base.png" },
    ];
    return (
  <SimpleGrid minChildWidth="20vw" spacing="75px" pt="5vh">
    {apps.map((app, index) => (
      <Link key={index} as={RouterLink} to={app.path}>
        <Image bg="rgba(0,0,0,.25)" borderRadius="25px" border="1px solid white" maxW="50vh" w="100%" src={app.image}/>
      </Link>
    ))}
  </SimpleGrid>
);
}