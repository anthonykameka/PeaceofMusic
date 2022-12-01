import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import Modal from "styled-react-modal";
import FocusLock from "react-focus-lock"
import { useState, useContext } from 'react';
import {getSong} from "genius-lyrics-api";
import { CurrentUserContext } from './CurrentUserContext';
import { MusicContext } from './MusicContext';
import GlobalStyles from './GlobalStyles';
import { TextField } from '@mui/material'
import { set } from 'date-fns';

const AddASong = () => {

    const navigate = useNavigate();

    const {
      currentUser, // current logged in user (from MONGODB)
      setRefreshUser,
      refreshUser,
      
    } = useContext(CurrentUserContext)

    const {
      setRefreshSongs, refreshSongs //dependency for the getSongs fetch. Adding song will cause dependent data to refresh
    } = useContext(MusicContext)
  
  
  
  
    const [songSearch, setSongSearch] = useState(null) // initialize
    const [artistSearch, setArtistSearch] = useState(null) // initialize.
    const [song, setSong] = useState(null) // initialize
    const [searchResult, setSearchResult] = useState(null)
    const [addingSong, setAddingSong] = useState(false)
    const [finishAdding, setFinishAdding] = useState(false)
    const [postedSong, setPostedSong] = useState(null)






    const [isOpen, setIsOpen] = useState(false); // initialize modal state







   //function to toggle modal
  const toggleModal = () => {
    setIsOpen(!isOpen)
    
}

const handleAddSong = () => {
    toggleModal()
    setSearchResult(null)

  }

  const handleCancelClick = (ev) => {
    ev.preventDefault();
    toggleModal()
  }

  const handleSearch = (ev) => { 
    ev.preventDefault();
    setFinishAdding(false)
    //these options are required for GENIUS API/NPM package // use inputs to search api
    const options = {
      apiKey: "mPaybTjlCGUYikeRswTWOEU57Pf-vXKk6WrAttu0ue344TFuamLsUzn7p9GgXe3p",
      title: songSearch,
      artist: artistSearch,
      optimizeQuery:true
  }

  // console.log(options)
  // console.log(currentUser)
  

    getSong(options).then((song) => {
      setSearchResult(song)

      
    })

    // toggleModal()
  }

  console.log(addingSong)


  const handleConfirmAdd = (ev) => {
    ev.preventDefault();
    const thisSong = {...searchResult, addedBy: currentUser._id}// retain user information to keep track on who is adding // stats tend to engage the user
    
    setFinishAdding(false)

    fetch("/api/add-song" , { 
      method: "POST",
      headers: {
          "Accept": "application/json",
          "Content-type": "application/json"
      },
      body: JSON.stringify({thisSong})
      })
      .then(res => res.json())
      .then(res => {
          console.log(res)
          setPostedSong(res.data)
          if (res.status === 200) {
            setRefreshSongs(refreshSongs+1)
            setRefreshUser(refreshUser+1)
            setAddingSong(false)
            setFinishAdding(true)

            document.getElementById("add-song-form").reset();
          }
      })
      setAddingSong(false)

  }
const handleClear = (ev) => {
  ev.preventDefault();
  setSearchResult(null)
  document.getElementById("add-song-form").reset();
}

// console.log(postedSong)

  return (
        <Wrapper>
            <AddSong onClick={handleAddSong}>add song</AddSong>

            <Modal
                isOpen={isOpen}
                onEscapeKeydown={toggleModal}
                role="dialog"
                aria-modal={true}
                aria-labelledby="modal-label"
                transparent={true}
                >
            <FocusLock>
                <FormContainer>
                <Form id="add-song-form">
                  <Titles>
                  <Title>Can't find the lyrics on our database?</Title>
                  <SubTitle>Submit a song and artist and allow our advanced data mining technology to locate & retrieve the song from the ether...</SubTitle>
                  </Titles>
                  <FormBoxA>
                    <SongAndArtist>
                      <Label>Song</Label>
                      <SongInput onChange={(e)=> setSongSearch(e.target.value)}></SongInput>
                      <Label>Artist</Label>
                      <ArtistInput onChange={(e)=> setArtistSearch(e.target.value)}></ArtistInput>
                    </SongAndArtist>
                    <SearchAndCancel>
                      <Submit onClick={handleSearch}>Search</Submit>
                      
                    </SearchAndCancel>
                  </FormBoxA>
                  {
                    searchResult?
                    <FormBoxB>
                    
                      <SongDetailsBox>
                      
                        <AlbumArt src={searchResult.albumArt}/>
                        <SongDetailsSubBox>
                        <SongTitle>{searchResult.title}</SongTitle>
                        {
                        addingSong || !finishAdding?
                          <Confirm onClick={handleConfirmAdd}>Confirm</Confirm>
                          : <></>
                      }
                        </SongDetailsSubBox>
                        </SongDetailsBox>

                    {
                      !addingSong? <></>
                      : <Fetching>trying to add..please wait</Fetching>
                    }
                    {
                      !finishAdding || !postedSong ? <></>
                      :
                        <Success>Song was added sucessfully. <a href={`/songs/${postedSong._id}`}>go to song</a></Success>

                    }
                    </FormBoxB>
                    : <></>
                  }
                 <Clear onClick={handleClear}>Clear</Clear>
                 <Cancel onClick ={handleCancelClick}>Close</Cancel>
                </Form>
                </FormContainer>
            </FocusLock>

            </Modal>
        </Wrapper>
  )
}

const SongDetailsSubBox = styled.div`
display:flex;
flex-direction: column;
`

const Success = styled.p`
text-align: center;
margin-top: 20px;
margin-bottom: 10px;

`
const Fetching = styled.p`
text-align: center;
margin-top: 20px;
`

const Clear = styled.button`
background-color: var(--color-orange);
`
const SongTitle = styled.p`
font-weight: bold;`

const AlbumArt = styled.img`
height: 100px;
`

const SongDetailsBox = styled.div`
display: flex;
width: 80%;
margin-top: 20px;

`

const No = styled.button`
`
const Confirm = styled.button`

`

const FormBoxB = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`

const Titles = styled.div`
width: 75%;
margin-bottom: -10px;
height: 100px;
margin-top: 10px;
`

const Title = styled.h1``

const SubTitle = styled.p`
font-size: 16px;
`

const SearchAndCancel = styled.div`
display:flex;
justify-content: space-between;
`
const SongAndArtist = styled.div`
display:flex;
flex-direction: column;


`
const FormBoxA = styled.div`
display:flex;
flex-direction: column;
width: 50%;
margin-top: 5%;

border-radius: 3px;
border-bottom: 1px solid lightgray;
padding-bottom: 10px;
/* background-color: white;; */

`

const Wrapper = styled.div`

`

const AddSong = styled.button`
`


const Form = styled.form`
border: 1px solid black;
height: 98%;
width: 98%;
display: flex;
flex-direction: column;
background-color: var(--color-deepteal);
border-radius: 40px;
align-items: center;
input {
  width: 100%;
  background-color: transparent;
  margin-bottom: 10px;
  height: 30px;
  font-size: 17px;

}


`

const FormContainer = styled.div`
height: 55vh;
background-color: var(--color-darkpurple);
border-radius: 40px;
width: 500px;
display: flex;
justify-content: center;
align-items: center;

`
const Label = styled.label`
text-align: center;
margin-bottom: 9px;
font-size: 20px;

`

const ArtistInput = styled.input`
`

const SongInput = styled.input`
`

const Cancel = styled.button`
background-color: var(--color-orange);`

const EditSong = styled.button``
const Submit = styled.button``

export default AddASong