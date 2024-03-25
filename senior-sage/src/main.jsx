import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {ChakraProvider, extendTheme} from '@chakra-ui/react';

const colors = {
  brand: {
    dark_blue: '#0A2240',
    mid_blue: '#004B98',
    light_blue: '#3DB5E6',
    grey: '#C8C8C8',
    green: '#61BF1A',
    red: '#E1261C',
  },
}


const fonts = {
  body: 'Tahoma',
  heading: 'Courier New'
}

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors, 
  fonts,
});



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
