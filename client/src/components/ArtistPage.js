import React from 'react'
import { useParams } from 'react-router-dom'
import { useContext, useState } from 'react';
import { MusicContext } from './MusicContext';
import styled from "styled-components/"

const ArtistPage = () => {
    const params = useParams();
    const artistId = params.id
    console.log(artistId)

    const {
        songs,
        artists,
        artistsData
    } = useContext(MusicContext)


    const test = songs.filter(song => song.artistId === artistId)
    const artistName = test[0].artistName
  
    const songData = artistsData.filter(artist => artist.artistName.includes(artistName))[0]
    const sortedSongs = songData.sort((a, b) => a.artistName.localeCompare(b.artistName))
    const photos = songData.map(song => {
      return song.thisSong.albumArt
    })

    console.log(photos)
    let uniqueAlbumPhotos= photos.filter((item, i, array) => array.indexOf(item) === i);
    console.log(uniqueAlbumPhotos);


    // console.log(artistSongs)
    console.log(artistsData)

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


  return (
    <Wrapper>


              <ListWrapper>
          <TitleView>
          <Title>{artistName}</Title>
          <Views>
            <View onClick={handleAlbumView}>Album View</View>
            <View onClick={handleSongView}>Song View</View>
            </Views>
          </TitleView>
  
          {
           songView?
          <Songs>
            {
              sortedSongs.map(song => {
                return (
                  <Song>{song.songTitle}</Song>
                )
              })
            }

          </Songs>
          :<></>
          }     
            
        </ListWrapper>

          
          {
            albumView?

            <AlbumsWrapper>
            {
            uniqueAlbumPhotos?.map(photo => {
              return (
                <AlbumWrapper>
                  <Album src={photo}/>
                </AlbumWrapper>
              )
      })}

      </AlbumsWrapper>
      :<></>
          }

            
        </Wrapper>
  )
}

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
display:flex;`

export default ArtistPage