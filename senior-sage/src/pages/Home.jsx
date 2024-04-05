import { SimpleGrid, Image, Link } from '@chakra-ui/react';
import { Link as RouterLink } from "react-router-dom";

export default function Home () {
    const apps = [
        { path: "/llm", image: "Chat.jpg" },
        { path: "/llm", image: "Chat.jpg" },
        { path: "/llm", image: "Chat.jpg" },
    ];
    return (
  <SimpleGrid minChildWidth="100px" spacing="20px" >
    {apps.map((app, index) => (
      <Link key={index} as={RouterLink} to={app.path}>
        <Image bg="rgba(0,0,0,.25)" borderRadius="25px" border="1px solid white" w="100%" src={app.image}/>
      </Link>
    ))}
  </SimpleGrid>
);
}