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
import loader from "../assets/pomloader.gif"

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
    const [searching, setSearching] = useState(null)
    

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
    setSearching(true)
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

    setSearching(false)
    // toggleModal()
  }


console.log(searching)


  const handleConfirmAdd = (ev) => {
    setAddingSong(true)
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

const handleSongClick = (ev) => {
  ev.preventDefault();
  console.log("help")
}
console.log(songSearch)

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
                  <MainFormContent>
                  <SearchMain>

                  <FormBoxAB>
                  <FormBoxA>
                    <SongAndArtist>
                      <Song>
                        {/* <Label>Song</Label> */}
                        <SongInput placeholder={"Song"} onClick={handleSongClick}  onChange={(e)=> setSongSearch(e.target.value)}></SongInput>
                      </Song>
                      <Artist>
                        {/* <Label>Artist</Label> */}
                        <ArtistInput placeholder={"Artist"} onChange={(e)=> setArtistSearch(e.target.value)}></ArtistInput>
                      </Artist>
                    </SongAndArtist>

                  </FormBoxA>
                  {
                    searchResult?
                    <FormBoxB>
                    
                      

                    {
                      !addingSong || searching? <></>
                      : <Fetching><img src={loader}></img>trying to add..please wait</Fetching>
                    }
                    
                    </FormBoxB>
                    : <></>
                  }
                  </FormBoxAB>

                 
                 <Buttons>   
                 <Search className='yes' onClick={handleSearch}>Search</Search>  
                 <Clear className="no" onClick={handleClear}>Clear</Clear>
                  <Cancel className="no" onClick ={handleCancelClick}>Cancel</Cancel>
                 </Buttons>
                 {
                  notFound?<Error>Sorry! Song was not found... Enter song instead?</Error>
                  : <></>
                 }
                 {
                  exists?<Error>We already have this song in our database. <span onClick={handleExists}>go to song </span> </Error>
                  : <></>
                 }
                 </SearchMain>
                 <ResultMain>
                 {
                  searchResult?
                  <SearchResultsBox>
                      
                    <AlbumArt src={searchResult.albumArt}/>
                    <SearchResultsSubBox>
                      <TitleConfirm>
                    <SongTitle>{searchResult.title}</SongTitle>
                    {
                    addingSong || !finishAdding?
                      <Confirm className="yes" onClick={handleConfirmAdd}>Add</Confirm>
                      :  <></>
                    }
                    </TitleConfirm>
                      </SearchResultsSubBox>
                  
                    </SearchResultsBox>
                    :<></>
                    }
                
                 </ResultMain>
                 </MainFormContent>
                 {
                      !finishAdding || !postedSong ? <></>
                      :
                        <Success>Song was added sucessfully. <a href={`/songs/${postedSong._id}`}>go to song</a></Success>

                    }
                </Form>
                
                </FormSubContainer>
         
                </FormContainer>
            </FocusLock>

            </Modal>
        </Wrapper>
  )
}

const MainFormContent = styled.div`
margin-top: 75px;
display: flex;`

const Form = styled.form`
border: 1px solid black;
height: 93%;
width: 85%;
display: flex;
flex-direction: column;
background-color: var(--color-dark-grey);
border-radius: 40px;
align-items: center;
label {
  margin-bottom: 14px
}
input {
  width: auto;
  background-color: transparent;
  height: 30px;
  font-size: 17px;
  margin-left: 22px;
  color: white;
  border-bottom: 1px solid var(--color-orange);
  &:focus {
    outline: none;
  }

}


`

const FormContainer = styled.div`
height: 40vh;
background-color: var(--color-darkpurple);
border-radius: 40px;
display: flex;
justify-content: center;
align-items: center;
width: 40vw;
position: relative;

`
const SearchResultsBox = styled.div`
display: flex;
flex-direction: column;
margin-top: 20px;
top: 0;
right: 0;


`
const Label = styled.label`
display:flex;
align-items: flex-end;
margin-bottom: 9px;
font-size: 20px;

`


const ResultMain = styled.div`
border-left: 1px solid var(--color-darkpurple);
padding-left: 20px;
`
const SearchMain = styled.div`

input {
  

}
padding: 10px;
`

const GoToSong = styled.a`
color: var(--color-deepteal);
font-size: 20px;
text-decoration: none;
`

const TitleConfirm = styled.div`
display: flex;
flex-direction: column;
margin-left: 20px;
margin-top: 10px;
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

const SearchResultsSubBox = styled.div`
display:flex;
flex-direction: column;
`

const Success = styled.p`
text-align: center;
margin-top: 40px;
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
background-color: var(--color-darkpurple);


`

const SongTitle = styled.p`
font-weight: bold;
max-height: 100px;
max-width: 222px;




`

const AlbumArt = styled.img`
height: 140px;
width: 140px;
margin-left: 20px;
margin-right: 10px;
`



const No = styled.button`
`
const Confirm = styled.button`
display:flex;
justify-content: center;
font-size: 20px;;
margin-right: 30px !important;
background: linear-gradient(var(--color-deepteal), var(--color-darkpurple));

`

const FormBoxB = styled.div`
display: flex;
flex-direction: column;
align-items: center;
position: relative;

`

const Titles = styled.div`
width: 75%;
margin-bottom: -10px;
height: 50px;
margin-top: 10px;
position: absolute;
top: 30px;
left: 80px;
`

const Title = styled.h1`
color: var(--color-orange);
`

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
height: 75px;
justify-content: space-between;


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




const ArtistInput = styled.input`
border: none;

`

const SongInput = styled.input`
border: none;
`

const Cancel = styled.button`

`

const Buttons = styled.div`
display:flex;
button {
  margin-left: 20px;
  height: 50px !important;
  margin-top: 40px;
}
`

const EditSong = styled.button``
const Search = styled.button`
background-color: white;
width: 100px;
`

export default AddASong