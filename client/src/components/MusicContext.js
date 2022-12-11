import { createContext, useState, useEffect } from "react";
export const MusicContext = createContext();
// context for all of the song metadata.
 export const MusicProvider = ({ children }) => {

    const [songs, setSongs] = useState(null)
    const [refreshSongs, setRefreshSongs] = useState(0)
    const [artists, setArtists] = useState(null)
    const [artistsData, setArtistsData] = useState(null)
    const [refreshEdits, setRefreshEdits] = useState(0)
    const [accessToken, setAccessToken] = useState(null)
    const [isOpen, setIsOpen] = useState(false); // initialize modal state
    const [featured, setFeatured] = useState(null)

    useEffect(() => {
        fetch(`api/get-access-token`)
        .then(res => res.json())
        .then(res => setAccessToken(res.data))
      }, []) // get access token from server

    const songsByArtists = (songArray, artistArray) => {
        const newArray = artistArray.map(artist => {
            return songArray.filter((song => {
                return artist === song.artistName
            }))
        })

        newArray.forEach(artistCatalogue => {
            artistCatalogue.artistName = artistCatalogue[0].artistName
        })
        setArtistsData(newArray)

        }

    useEffect(() => {
        fetch("/api/get-songs")
        .then(res => res.json())
        .then(res =>  {
            // console.log(res.data)
            setSongs(res.data)
            const artists = [...new Set(res.data.map((song) => song.artistName))] // creating new array of unique artists based on data
            setArtists(artists.sort())
            songsByArtists(res.data, artists)
            
            
        })
        
    }, [refreshSongs, setRefreshSongs])
 
        // this function is used to getSong, everywherever required.

        const getSong = (songId) => {

           return fetch(`/api/get-song/${songId}`)
            .then(res => res.json())

        }


        const shuffle = (array) => {
            console.log(array[0])
           
          
            // // While there remain elements to shuffle.
            // while (currentIndex != 0) {
          
            //   // Pick a remaining element.
            //   let randomIndex = Math.floor(Math.random() * currentIndex);
            //   currentIndex--;
          
            //   // And swap it with the current element.
            //   [array[currentIndex], array[randomIndex]] = [
            //     array[randomIndex], array[currentIndex]];
            // }
          
            return array;
          }
          
    // let featuredSongs = songs?.slice()
    // console.log(shuffle(featuredSongs))

        //   console.log(songs)



    return (
        <MusicContext.Provider
            value={{
                songs, //all songs from our server
                artists,
                artistsData, // array of unique artists
                setRefreshSongs,
                refreshSongs,
                getSong,
                refreshEdits,
                setRefreshEdits,
                accessToken,
                isOpen,
                setIsOpen,
                featured,
            }}
        >
            {children}
        </MusicContext.Provider>
    )
}