import { createContext, useState, useEffect } from "react";
export const MusicContext = createContext();






 export const MusicProvider = ({ children }) => {

    const [songs, setSongs] = useState(null)
    const [refreshSongs, setRefreshSongs] = useState(0)
    const [artists, setArtists] = useState(null)
    const [artistsData, setArtistsData] = useState(null)

    const songsByArtists = (songArray, artistArray) => {
        // console.log(songArray)
        // console.log(artistArray)

        const newArray = artistArray.map(artist => {
            return songArray.filter((song => {
                return artist === song.artistName
            }))
        })

        setArtistsData(newArray)

        }



    useEffect(() => {
        fetch("/api/get-songs")
        .then(res => res.json())
        .then(res =>  {
            setSongs(res.data)
            const artists = [...new Set(res.data.map((song) => song.artistName))] // creating new array of unique artists based on data
            setArtists(artists.sort())
            songsByArtists(res.data, artists)
            
        })
        
    }, [refreshSongs])

    // console.log(refreshSongs)

    // songs && console.log(songs)
    


    return (
        <MusicContext.Provider
            value={{
                songs, //all songs from our server
                artists,
                artistsData, // array of unique artists
                setRefreshSongs,
                refreshSongs,
            }}
        >
            {children}
        </MusicContext.Provider>
    )
}