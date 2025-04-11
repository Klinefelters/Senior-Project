// CSS Import
import './App.css'

//Library Imports
import { Routes, Route} from "react-router-dom";
import { Flex } from '@chakra-ui/react';

// Component Imports
import Header from './components/Header';

// Page Imports
import Home from './pages/Home';
import Ryan from './pages/Ryan';
import Amy from './pages/Amy';
import William from './pages/William';

// Hook Imports
import { useState } from 'react';

export default function App() {
  const [headerDisabled, setHeaderDisabled] = useState(false);
  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Header disable={headerDisabled}/>
      <Flex flex="1" direction="column" p="70px" pb="40px">
        <Routes>
          <Route path="/" element={<Home headerDisabled={headerDisabled} setHeaderDisabled={setHeaderDisabled}/>} />
          <Route path="/amy" element={<Amy headerDisabled={headerDisabled} setHeaderDisabled={setHeaderDisabled}/>} />
          <Route path="/ryan" element={<Ryan headerDisabled={headerDisabled} setHeaderDisabled={setHeaderDisabled}/>} />
          <Route path="/william" element={<William headerDisabled={headerDisabled} setHeaderDisabled={setHeaderDisabled}/>} />
        </Routes>
      </Flex>
    </Flex>
  );
}