import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';

import { Router } from './router';
import { theme } from './theme';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <ColorModeScript initialColorMode={theme['config']['initialColorMode']} />
    <ChakraProvider theme={theme}>
      <Router />
    </ChakraProvider>
  </StrictMode>
);
