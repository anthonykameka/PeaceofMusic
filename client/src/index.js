import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { Auth0Provider } from "@auth0/auth0-react";
import { CurrentUserProvider } from './components/CurrentUserContext';
import {ModalProvider} from "styled-react-modal"
import { MusicProvider } from './components/MusicContext';
import { PeaceProvider } from './components/PeaceContext';
import { SpotifyProvider } from './components/SpotifyContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
      <Auth0Provider
        domain="dev-tykkk51vqsq8qpts.us.auth0.com"
        clientId="akS3fgQOKPqVjrn3fKTotB4Tipylxnpb"
        redirectUri={"http://localhost:3000/home"}
      >
        <CurrentUserProvider>
          <SpotifyProvider>
            <ModalProvider>
              <MusicProvider>
              <PeaceProvider>
              <App />
              </PeaceProvider>
              </MusicProvider>
            </ModalProvider>
          </SpotifyProvider>
        </CurrentUserProvider>
      </Auth0Provider>
  /* </React.StrictMode> */
);

    