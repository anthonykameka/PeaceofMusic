import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import Modal from "styled-react-modal";
import FocusLock from "react-focus-lock"
import { useState, useContext, useEffect } from 'react';
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
    const [notFound, setNotFound] = useState(false)
    const [exists, setExists] = useState(false)
    const [existsId, setExistsId] = useState(null)



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
    setNotFound(false)
    setExists(false)
    ev.preventDefault();
    toggleModal()
  }

  const handleSearch = (ev) => { 
    setExists(false)
    setNotFound(false)
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
      if (song===null) {
        setNotFound(true)
      }

      
    })

    // toggleModal()
  }


console.log(notFound)


  const handleConfirmAdd = (ev) => {
    setExists(false)
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
          if (res.status === 400) {
            setExists(true)
            setExistsId(res.data._id)
          }
      })
      setAddingSong(false)

  }
const handleClear = (ev) => {
  ev.preventDefault();
  setSearchResult(null)
  document.getElementById("add-song-form").reset();
  setNotFound(false)
  setExists(false)
}

const handleExists = (ev) => {
  ev.preventDefault();
  navigate(`/songs/${existsId}`)
  toggleModal()
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
                <FormSubContainer>
                <Form id="add-song-form">
                  
                  <Titles>
                  <Title>Can't find the lyrics on our database?</Title>
                  <SubTitle>Search below...</SubTitle>
                  </Titles>
                  <FormBoxAB>
                  <FormBoxA>
                    <SongAndArtist>
                      <Song>
                        <Label>Song</Label>
                        <SongInput onChange={(e)=> setSongSearch(e.target.value)}></SongInput>
                      </Song>
                      <Artist>
                        <Label>Artist</Label>
                        <ArtistInput onChange={(e)=> setArtistSearch(e.target.value)}></ArtistInput>
                      </Artist>
                    </SongAndArtist>

                  </FormBoxA>
                  {
                    searchResult?
                    <FormBoxB>
                    
                      <SongDetailsBox>
                      
                        <AlbumArt src={searchResult.albumArt}/>
                        <SongDetailsSubBox>
                          <TitleConfirm>
                        <SongTitle>{searchResult.title}</SongTitle>
                        {
                        addingSong || !finishAdding?
                          <Confirm className="yes" onClick={handleConfirmAdd}>Confirm</Confirm>
                          : <></>
                      }
                        </TitleConfirm>
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
                  </FormBoxAB>

                      
                 <ClearCancel>   
                 <Search className='yes' onClick={handleSearch}>Search</Search>  
                 <Clear className="no" onClick={handleClear}>Clear</Clear>
                  <Cancel className="no" onClick ={handleCancelClick}>Close</Cancel>
                 </ClearCancel>
                 {
                  notFound?<Error>Sorry! Song was not found... Enter song instead?</Error>
                  : <></>
                 }
                 {
                  exists?<Error>We already have this song in our database. <span onClick={handleExists}>go to song </span> </Error>
                  : <></>
                 }
                 
                </Form>
                </FormSubContainer>
                </FormContainer>
            </FocusLock>

            </Modal>
        </Wrapper>
  )
}


const TitleConfirm = styled.div`
display: flex;
flex-direction: column;

`
const FormBoxAB = styled.div`
display: flex;
width: 50%;
`

const Song = styled.div`
display:flex;`

const Artist = styled.div`
display:flex;`

const FormSubContainer = styled.div`
background-color:  var(--color-deepteal);
border: 1px solid black;
height: 98%;
width: 98%;
border-radius: 40px;
display:flex;
justify-content: center;
align-items: center;
`

const Error = styled.p`
color: white;
margin-top: 50px;
margin-bottom: 10px;
span {
  text-decoration: underline;
  color: var(--color-orange);
  cursor: pointer;
  
  }

`

const SongDetailsSubBox = styled.div`
display:flex;
flex-direction: column;
`

const Success = styled.p`
text-align: center;
margin-top: 20px;
margin-bottom: 10px;
a {
  color: var(--color-deepteal);
}

`
const Fetching = styled.p`
text-align: center;
margin-top: 20px;
`

const Clear = styled.button`
`
const SongTitle = styled.p`
font-weight: bold;


`

const AlbumArt = styled.img`
height: 100px;
margin-left: 20px;
margin-right: 10px;
`

const SongDetailsBox = styled.div`
display: flex;
width: 80%;
margin-top: 20px;

`

const No = styled.button`
`
const Confirm = styled.button`
width: 70px;
display:flex;
font-size: 10px;;
margin-right: 30px !important;

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
flex-direction: column


`
const FormBoxA = styled.div`
display:flex;
flex-direction: column;
width: 50%;
margin-top: 5%;

border-radius: 3px;

padding-bottom: 10px;
/* background-color: white;; */






`

const Wrapper = styled.div`

`

const AddSong = styled.button`
`


const Form = styled.form`
border: 1px solid black;
height: 93%;
width: 85%;
display: flex;
flex-direction: column;
background-color: var(--color-dark-grey);
border-radius: 40px;
align-items: center;
input {
  width: 140px;
  background-color: transparent;
  margin-bottom: 10px;
  height: 30px;
  font-size: 17px;
  margin-left: 10px;
  color: white;
  border-bottom: 1px solid white;
  &:focus {
    outline: none;
  }

}


`

const FormContainer = styled.div`
height: 40vh;
background-color: var(--color-darkpurple);
border-radius: 40px;
width: 500px;
display: flex;
justify-content: center;
align-items: center;
width: 40vw;

`
const Label = styled.label`
display:flex;
align-items: flex-end;
margin-bottom: 9px;
font-size: 20px;

`

const ArtistInput = styled.input`
border: none;

`

const SongInput = styled.input`
border: none;
`

const Cancel = styled.button`

`

const ClearCancel = styled.div`
display:flex;
button {
  margin-left: 20px;
  height: 50px !important
}
`

const EditSong = styled.button``
const Search = styled.button`
background-color: white;
width: 100px;
`

export default AddASong