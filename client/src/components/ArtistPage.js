import React from 'react'
import { useParams } from 'react-router-dom'
import { useContext, useState } from 'react';
import { MusicContext } from './MusicContext';
import styled from "styled-components/"
import { useNavigate } from 'react-router-dom';

const ArtistPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const artistId = params.id
    

    const {
        songs,
        artists,
        artistsData
    } = useContext(MusicContext)


    const test = songs?.filter(song => song.artistId === artistId)
    const artistName = test[0]?.artistName
  
    const songData = artistsData?.filter(artist => artist.artistName.includes(artistName))[0]
    const sortedSongs = songData?.sort((a, b) => a.artistName.localeCompare(b.artistName))
    const photos = songData?.map(song => {
      return song.thisSong.albumArt
    })

    let uniqueAlbumPhotos= photos?.filter((item, i, array) => array.indexOf(item) === i);
  


 

    const [songView, setSongView] = useState(true)
    const [albumView, setAlbumView] = useState(false)

    const handleAlbumView= (ev) => {
      ev.preventDefault();
      setAlbumView(true)
      setSongView(false)
    }
    const handleSongView= (ev) => {
      ev.preventDefault();
      setAlbumView(false)
      setSongView(true)
    }

    
      
  const handleSongClick = (songId) => {

    navigate(`/songs/${songId}`)
  }
  


  return (
    <Wrapper>


              <ListWrapper>
          <TitleView>
          <Title>{artistName}</Title>
          <Views>
            {/* <View onClick={handleAlbumView}>Album View</View> */}
            <View onClick={handleSongView}>Song View</View>
            </Views>
          </TitleView>
  
          {
           songView?
          <Songs>
            {
              sortedSongs.map(song => {
                console.log(song)
                return (
                  <Song onClick={() => handleSongClick(song._id)}>
                    {
                    song.songTitle[0].toUpperCase() + song.songTitle.slice(1)
                    }
                    </Song>
                )
              })
            }

          </Songs>
          :<></>
          }     
            
        </ListWrapper>

          {
            albumView?

            <Albums>
            {
              sortedSongs.map(song => {
                return (
                  <>
                  <SongAlbum>
                  <Album src={song.thisSong.albumArt}/>
                    <Song onClick={handleSongClick}>{song.songTitle.charAt(0).toUpperCase()}</Song>
                  </SongAlbum>
                  </>
                )
              })
            }

          </Albums>

      
      :<></>
          }

            
        </Wrapper>
  )
}

const SongAlbum = styled.li`
display:flex;
`

const Albums = styled.ul`
margin-left: 40px;

`

const AlbumsWrapper = styled.div`

border: 1px solid blue;
`
const Views = styled.div`
`
const TitleView = styled.div`
  display: flex;
  margin-left: 40px;
  flex-direction: column;`

const View = styled.button`
color: var(--color-deepteal);

`

const Song = styled.li`
color: white;
margin-left: 20px;
line-height: 25px;
&:hover{
  color: #bc35ca;
  cursor: pointer;
}
font-size: 20px;
`
const Songs = styled.ul`
 margin-top: 25px;
 margin-bottom: 10px;
 margin-left: 40px;
`


const Title = styled.p`
  margin: 0;
  color: var(--color-orange);
  font-size: 50px;
  padding: 0;`

const ListWrapper = styled.div`
`

const AlbumWrapper = styled.div`
width: 100vw;
display:flex;
flex-wrap: wrap ;
`

const Album = styled.img`
width: 250px;
`

const Wrapper = styled.div`
display:flex;
flex-direction: column;`

export default ArtistPage