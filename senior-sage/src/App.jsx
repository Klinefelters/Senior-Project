// CSS Import
import './App.css'

//Library Imports
import { Routes, Route} from "react-router-dom";
import { Flex } from '@chakra-ui/react';
import { listen } from '@tauri-apps/api/event';
import { useEffect } from 'react';

// Component Imports
import Header from './components/Header';

// Page Imports
import Home from './pages/Home';
import Llm from './pages/Llm';


export default function App() {
  useEffect(() => {
    listen('spacebar', () => {
      console.log('spacebar')
    })
  }, [])
  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Header />
      <Flex flex="1" direction="column" p="10px" pb="40px">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/llm" element={<Llm/>} />
        </Routes>
      </Flex>
    </Flex>
  );
}