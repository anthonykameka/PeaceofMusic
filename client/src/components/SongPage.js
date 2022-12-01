import React, { useEffect, useState, useContext } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { format } from 'date-fns'
import { CurrentUserContext } from './CurrentUserContext'
import { MusicContext } from './MusicContext'
import Modal from 'styled-react-modal'
import FocusLock from "react-focus-lock"
import { EditorBlock } from 'draft-js'
import SongPoms from './SongPoms'

const SongPage = () => {

  const navigate = useNavigate();

  const {
    currentUser,
    refreshUser,
    setRefreshUser, // current logged in user (from MONGODB)
  } = useContext(CurrentUserContext)

  const {
    refreshSongs,
    setRefreshSongs // to refresh song list after edit or deletion
  } = useContext(MusicContext)


    console.log(currentUser)
    const _id = useParams()
    const songId = _id.id

    const [song, setSong] = useState(null)
    const [userWhoAdded, setUserWhoAdded] = useState(null)
    const [dateAdded, setDateAdded] = useState(null)
    const [userActive, setUserActive] = useState(true)
    console.log(song)

    useEffect(() => {
        fetch(`/api/get-song/${_id.id}`)
        .then(res => res.json())
        .then(res =>  {
            setSong(res.data)
            console.log(res.data)
            const rawDate = res.data.dateAdded.slice(0, 10)
            console.log(rawDate)
            setDateAdded(rawDate)
            fetch(`/api/match-user/${res.data.thisSong.addedBy}`)
          .then(res => res.json())
          .then(res => {
           setUserWhoAdded(res.data) 
           if (res.data.active === false) {
            setUserActive(false)
           }
      })
        })
        
    }, [])

////////////////////SITE ROLES TO ALLOW FOR EDITS//DELETING
    let canEdit = true;
    let canDelete = false;
    let canSubmit = true;
    let canApprove = false;
    canApprove = false;
    if (currentUser?.role === "admin" || currentUser?.role === "founder" ){
      canDelete = true;
      canApprove = true;
    }
    if (currentUser?.role === "moderator")  {
      canEdit = true;
      canApprove = true;
    }
/////////////////////EVENT HANDLERS TO DELETE AND EDIT SONG
    const handleDeleteSong = (ev) => {
      ev.preventDefault();
      fetch(`/api/delete-song/${song._id}`, 
      {
        method: "DELETE"
      })
      .then(res => res.json())
      .then(res => {
        if (res.status === 200) {
          navigate("/songs")
          setRefreshSongs(refreshSongs+1)
          setRefreshUser(refreshUser+1)
        }
      })

    }

    //EDIT MODAL

    const [isOpen, setIsOpen] = useState(false); // initialize modal state
    const [editedTitle, setEditedTitle] = useState(null)
    const [editedArtist, setEditedArtist] = useState(null)
    const [editedLyrics, setEditedLyrics] = useState(null)
    const [editorComments, setEditorComments] = useState(null)
   //function to toggle modal
    const toggleModal = () => {

    setIsOpen(!isOpen)
}

  const handleEditSong = (ev) => {
    ev.preventDefault();
    toggleModal()
  }

  const handleSubmitEdit = (ev) => {
    ev.preventDefault();
    const edit = {editedTitle: editedTitle,
                  editedArtist: editedArtist,
                  editedLyrics: editedLyrics,
                  editorComment: editorComments,
                  editedBy: currentUser._id,
                  targetId: songId
                }

    fetch(`/add-edit`,  
    {
      method: "PATCH",
      headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
      },
      body: JSON.stringify(edit)
    })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      toggleModal();
    })

    // toggleModal()
  }

  const handleCancelEdit = (ev) => {
    ev.preventDefault();
    toggleModal();
  }

  const handleAddedByClick = (ev) => {
    ev.preventDefault();
    // console.log(userWhoAdded)
    navigate(`/profile/${userWhoAdded._id}`)

  }

  console.log(song)


  return (
    <Wrapper>
      {
        !song
        ? <p>loading...</p>
        :
        <>
        <SongInfoBox>
        <SongInfoSubBox>
          <AlbumCover src={song.thisSong.albumArt}/>
          <Title>{song?.thisSong.title}</Title>
          
          <DateAdded>Date added: {dateAdded} </DateAdded>
          {
            userActive?
            <AddedBy onClick={handleAddedByClick}>by: {userWhoAdded?.username}</AddedBy>
            : <AddedBy >by: Deactivated User</AddedBy>
          }
          
        </SongInfoSubBox>
        <SongActions>
          {
            canEdit?<EditSong onClick={handleEditSong}>Submit an Edit</EditSong>
            :<div></div>
          }
          {
            canDelete?<DeleteSong onClick={handleDeleteSong}>Delete</DeleteSong>
            :<div></div>
          }
          
          
        </SongActions>
      </SongInfoBox>
      <LyricsWrapper>
        <Lyrics>{song.thisSong.lyrics}</Lyrics>
      </LyricsWrapper>

      <PomWrapper>
        <SongPoms song={song}/>
      </PomWrapper>
      <Modal
        isOpen={isOpen}
        onEscapeKeydown={toggleModal}
        role="dialog"
        aria-modal={true}
        aria-labelledby="modal-label"
        >
          <FocusLock>
            <FormWrapper>
              <Form>
                <TopWrapper>
                  <SubTopWrapper>
                    <Label>Song Title</Label>
                    <EditedSongTitle defaultValue={song.songTitle} onChange={(e)=> setEditedTitle(e.target.value)}></EditedSongTitle>
                    <Label>Artist Name</Label>
                    <EditedArtist defaultValue={song.artistName} onChange={(e)=> setEditedArtist(e.target.value)}></EditedArtist>
                  </SubTopWrapper>
                  <Comment>
                    <Label>Editor Comments</Label>
                    <TextArea placeholder={"briefly explain changes. required for lyrics change"} onChange={(e)=> setEditorComments(e.target.value)}/>


                    </Comment>
                </TopWrapper>
                <Label>Lyrics</Label>
                <EditedLyrics onChange={(e)=> setEditedLyrics(e.target.value)}>
                  {song.thisSong.lyrics}
                </EditedLyrics>
                <Submit onClick={handleSubmitEdit}>Submit</Submit>
                <Cancel onClick ={handleCancelEdit}>Cancel</Cancel>
              </Form>
            </FormWrapper>
          </FocusLock>
      </Modal>


      </>
      }

    </Wrapper>
  )
}

const PomWrapper = styled.div`
`

const Comment = styled.div`
display:flex;
flex-direction: column;
margin-left: 20px;
`

const TextArea = styled.textarea`
height: 50px;

`

const SubTopWrapper = styled.div`
display: flex;
flex-direction: column;
`

const TopWrapper = styled.div`
display:flex;
`

const EditedLyrics = styled.textarea`
height: 700px;
width: 500px;
padding: 0px;
margin: 0;`

const FormWrapper = styled.div`
width: 800px;
height: 800px;
background-color: var(--color-purple);
display: flex;
justify-content: center;
align-items: center;
border-radius: 20px;

`
const Form = styled.form`
display:flex;
flex-direction: column;
padding: 20px;
border-radius: 20px;
width: 600px;
height: 700px;
background-color: white;
justify-content: center;
align-items: center;
button {
  width: 100px;
}
`
const Label = styled.label``
const EditedSongTitle = styled.input``
const EditedArtist = styled.input``
const Submit = styled.button``
const Cancel = styled.button``


const EditSong = styled.button`
`
const SongActions = styled.div`
display:flex;
width: 170px;
margin-top: 20px;
justify-content: space-between;
`
const DeleteSong = styled.button`
`

const DateAdded = styled.p`
margin-top: 4px;
`

const AddedBy = styled.p`
margin-top: 4px;
`

const Title = styled.h1`
font-size: 17px;
margin-top: 10px;
`

const SongInfoSubBox = styled.div`
background-color: var(--color-orange);
width: 350px;
height: 350px;
display:flex;
flex-direction: column;
align-items: center;
border-radius: 30px;
justify-content: center;
`

const SongInfoBox = styled.div`
display:flex;
flex-direction: column;
align-items: center;
margin-top: 100px;
width: 500px;

`
const AlbumCover = styled.img`
width: 200px;
border: 1px solid black;
`

const Lyrics = styled.p`
white-space: pre-wrap;`

const LyricsWrapper = styled.div`
width: 50vw;
margin: auto;

`
const Wrapper = styled.div`
display:flex;`

export default SongPage