// CSS Import
import './App.css'

//Library Imports
import { Routes, Route} from "react-router-dom";
import { Flex } from '@chakra-ui/react';

// Component Imports
import Header from './components/Header';

// Page Imports
import Home from './pages/Home';
import Llm from './pages/Llm';


export default function App() {
  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Header />
      <Flex flex="1" direction="column" p="15vh" pb="40px">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/llm" element={<Llm/>} />
        </Routes>
      </Flex>
    </Flex>
  );
}