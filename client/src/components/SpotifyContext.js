import { createContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SpotifyWebApi from 'spotify-web-api-js';
import base64 from 'base-64';

export const SpotifyContext = createContext();

// const useAuthorizationCode = () => {
//     const [code, setCode] = useState(null);

//     cono

//     useEffect(() => {
//         const queryString = window.location.search;
//         const params = new URLSearchParams(queryString);
//         const code = params.get('code');
//         if (code) {
//           setCode(code);
//         }
//     }, []);

//     useEffect(() => {
//         if (code) {
//             fetch('/auth', {
//                 method: 'POST',
//                 body: code,
//             })
//                 .then(res => res.json())
//                 .then(data => {
//                     console.log(data);
//                 })
//                 .catch(error => {
//                     console.error(error);
//                 });
//         }
//     }, [code]);

//     return [code, setCode];
// }

export const SpotifyProvider = ({ children }) => {
    window.sessionStorage.clear();

    const [accessToken, setAccessToken] = useState(null);
   
    const clientId = process.env.REACT_APP_SPOTIFYID;
    const secret = process.env.REACT_APP_SPOTIFYSECRET;
    const redirectUri = encodeURI('http://localhost:3000');

    const handleSpotifyLogin = () => {
        const scopes = 'user-read-private user-read-email streaming user-read-currently-playing user-modify-playback-state user-read-playback-state';
        const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code`;
        window.location.href = url;

    
    }

    const getAccessToken = () => {
        
        const queryString = window.location.search;
    
        const params = new URLSearchParams(queryString);
        const code = params.get('code');
        console.log(code)
        if (code) {
            fetch('/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({code: code})
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error(error);
                });
            }
        
    }

    useEffect(() => {
        getAccessToken();
    }, []);


    var Spotify = require('spotify-web-api-js');
    var s = new Spotify();
    var spotifyApi = new SpotifyWebApi({
        clientId: clientId,
        clientSecret: secret,
        redirectUri: redirectUri
    })

    const userJSON = {};

    return (
        <SpotifyContext.Provider
            value={{
                handleSpotifyLogin,
            }}
        >
            {children}
        </SpotifyContext.Provider>
    )
} 