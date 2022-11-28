import { createContext, useState, useEffect } from "react";
export const MusicContext = createContext();






 export const MusicProvider = ({ children }) => {

    const [songs, setSongs] = useState(null)
    const [refreshSongs, setRefreshSongs] = useState(0)

    useEffect(() => {
        fetch("/api/get-songs")
        .then(res => res.json())
        .then(res => setSongs(res.data))
        
    }, [refreshSongs])

    console.log(refreshSongs)

    songs && console.log(songs)
    


    return (
        <MusicContext.Provider
            value={{
                songs,
                setRefreshSongs,
                refreshSongs,
            }}
        >
            {children}
        </MusicContext.Provider>
    )
}