import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const ArtistCard = ({artist, data}) => {

  
  const navigate = useNavigate();
  // is song is clicked, navigate to its songPage
  const handleSongClick = (song) => {
    navigate(`/songs/${song._id}`)
  }

  // sort data alphebetically based on song title//

  // console.log(data)

  data.sort((songA, songB) => songA.songTitle.localeCompare(songB.songTitle))

  //easy access to album art
  const albumArtDisplay = data[0].thisSong.albumArt


  return (
    <ArtistItem>
        <ArtistBox>
          <AlbumArt src={albumArtDisplay}/>
          <InfoBox>
            <ArtistName>{data.artistName}</ArtistName>
            <SongList>
                {
                  //for each artist, go through their songs and display songTitle.
                  data.map(song => {
                    return <Song onClick={() => handleSongClick(song)}>{song.songTitle}</Song>
                  })
                }
            </SongList>
          </InfoBox>
        </ArtistBox>
    </ArtistItem>
  )
}

const Song = styled.li`
font-style: italic;
margin-right: 10px;
&:hover {
  cursor: pointer;
  color: var(--color-deepteal)
}


`

const InfoBox = styled.div`
margin-left: 3px;
`

const SongList = styled.ul`
max-height: 80px;
display: flex;
flex-flow: wrap column;
`

const ArtistName = styled.p`
font-weight: bold;
color: #bc35ca;;`

const AlbumArt = styled.img`
width: 100px;`

const ArtistBox = styled.div`
display:flex;`

const ArtistItem = styled.li`

min-height: 100px;`

export default ArtistCard