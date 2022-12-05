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
word-wrap:wrap;
text-align: center;
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
word-wrap:wrap
display: flex;
flex-flow: wrap column;
`

const ArtistName = styled.p`
font-weight: bold;
word-wrap:wrap;
font-size: 16px;
text-align: center;
color: #bc35ca;;`

const AlbumArt = styled.img`
width: 130px;`

const ArtistBox = styled.div`
flex-direction: column;
align-items: center;
justify-content:center;
display:flex;`

const ArtistItem = styled.div`

    height: 200px;
    padding: 10px;
    width: 260px;

min-height: 100px;`

export default ArtistCard