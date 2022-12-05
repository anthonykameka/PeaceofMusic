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
import { AiFillEye, AiOutlineStar, AiFillStar } from "react-icons/ai";
import CommentSection from './Comments/CommentSection'
import { CircularProgress } from '@mui/material'

const SongPage = () => {
 // initialize values
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

  useEffect(() => {
      setRefreshSongs(refreshSongs + 1)
  }, [])


    const _id = useParams()
    const songId = _id.id // params
    const [song, setSong] = useState(null)
    const [userWhoAdded, setUserWhoAdded] = useState(null)
    const [dateAdded, setDateAdded] = useState(null)
    const [userActive, setUserActive] = useState(true)

 // add views to song
    useEffect(() => {
      fetch(`/api/view-song`,  
     {
       method: "PATCH",
       headers: {
           "Accept": "application/json",
           "Content-Type": "application/json"
       },
       body: JSON.stringify({songId: songId})
     })
       .then(res => res.json())
       .then(res => {
         console.log(res)
         setRefreshSongs(refreshSongs => refreshSongs+1)
       })
    

    }, [])
    

    // get song
    useEffect(() => {
        fetch(`/api/get-song/${_id.id}`)
        .then(res => res.json())
        .then(res =>  {
            setSong(res.data)
           
            const rawDate = res.data.dateAdded.slice(0, 10)
            
            setDateAdded(rawDate)
            fetch(`/api/match-user/${res.data.thisSong.addedBy}`) // get user info for who added
          .then(res => res.json())
          .then(res => {
           setUserWhoAdded(res.data) 
           if (res.data.active === false) {
            setUserActive(false)
           }
      })
        })
        
       
        
    }, [refreshSongs, _id])

// site roles, let you edit or delete.
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

  // USER  CAN SUBMIT EDITS

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
  } // edit is sent to server

  const handleSubmitEdit = (ev) => {
    ev.preventDefault();
    const edit = {editedTitle: editedTitle,
                  editedArtist: editedArtist,
                  editedLyrics: editedLyrics,
                  editorComment: editorComments,
                  editedBy: currentUser._id,
                  targetId: songId
                }
                //
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
      
      toggleModal();
    })

    // toggleModal()
  }

  const handleCancelEdit = (ev) => {
    ev.preventDefault();
    toggleModal();
  }
  // if you click the added by, you will go to their profile
  const handleAddedByClick = (ev) => {
    ev.preventDefault();

    navigate(`/profile/${userWhoAdded._id}`)

  }
 // unfavorite
  const handleUnfav = (ev) => {
    ev.preventDefault();
    fetch(`/api/remove-fav`,  
     {
       method: "PATCH",
       headers: {
           "Accept": "application/json",
           "Content-Type": "application/json"
       },
       body: JSON.stringify({songId: songId, userId: currentUser._id})
     })
       .then(res => res.json())
       .then(res => {
         
         setRefreshSongs(refreshSongs+1)
         setRefreshUser(refreshUser+1)
       })

  }
 // favorite
  const handleFav = (ev) => {
    ev.preventDefault();
    fetch(`/api/add-fav`,  
     {
       method: "PATCH",
       headers: {
           "Accept": "application/json",
           "Content-Type": "application/json"
       },
       body: JSON.stringify({songId: songId, userId: currentUser._id})
     })
       .then(res => res.json())
       .then(res => {
         console.log(res)
         setRefreshSongs(refreshSongs+1)
         setRefreshUser(refreshUser+1)
       })

  }






  return (
    <Wrapper>
      {
        !song
        ? <CircularProgress/>
        :
        <>
        <SongInfoBox>
        <SongInfoSubBox>
          <Favorites> 
            <p style={{marginRight: "10px"}}>{song.favorites}</p>
            {
              currentUser?.favorites.includes(song._id)?
              <AiFillStar onClick={handleUnfav} size={20}/>
              : <AiOutlineStar onClick={handleFav}  size={20}/>
            }
          </Favorites>
          <Views>{song.views}<AiFillEye/></Views>
          <AlbumCover src={song.thisSong.albumArt}/>
          <Title>{song?.songTitle}</Title>
          <Title><span>{song?.artistName}</span></Title>
          <DateBy>
          <DateAdded>Date added: {dateAdded} </DateAdded>
          {
            userActive?
            <AddedBy onClick={handleAddedByClick}>by: {userWhoAdded?.username}</AddedBy>
            : <AddedBy >by: Deactivated User</AddedBy>
          }
          </DateBy>
          <SongActions>
          {
            canEdit?<EditSong onClick={handleEditSong}>Edit</EditSong>
            :<div></div>
          }
          {
            canDelete?<DeleteSong onClick={handleDeleteSong}>Delete</DeleteSong>
            :<div></div>
          }
          
          
        </SongActions>
        </SongInfoSubBox>
       
      </SongInfoBox>
      <LyricsComments>
      <LyricsWrapper>
        <Title>{song?.songTitle}</Title>
          <Title><span>{song?.artistName}</span></Title>
        <Lyrics>{song?.thisSong.lyrics}</Lyrics>
       
      </LyricsWrapper>
     
      


      </LyricsComments>


      <PomWrapper>
        <SongPoms song={song}/>
      </PomWrapper>
      <CommentSection songId={songId}/>
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

const LyricsComments = styled.div`

display: flex;
width: 50%;
margin-left: 100px;
`
const Favorites = styled.div`
position: absolute;
top: 10px;
left: 40px;
justify-content: center;
display: flex;
`
const Views = styled.div`
position: absolute;
top: 10px;
right: 30px;
display: flex;
justify-content: center;
`

const DateBy = styled.div`
display:flex;
position: absolute;
bottom: 6px;
flex-direction: column;
left: 20px;
`

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
background-color: var(--color-dark-grey);
justify-content: center;
align-items: center;
button {
  width: 100px;
}
`
const Label = styled.label``
const EditedSongTitle = styled.input``
const EditedArtist = styled.input``
const Submit = styled.button`
color: white;`
const Cancel = styled.button`
color: white;
`


const EditSong = styled.button`
position: absolute;
top: -40px;
right: 0;
&:hover {
  color: white;
}
`
const SongActions = styled.div`
display:flex;
width: 170px;
margin-top: 20px;
position: absolute;
justify-content: space-between;
bottom: 0;
right: 1px;
`
const DeleteSong = styled.button`
`

const DateAdded = styled.p`
margin-top: 4px;
`

const AddedBy = styled.p`
margin-top: 4px;
&:hover {
  cursor: pointer;
  color: black;
}
`

const Title = styled.h1`
font-size: 17px;
margin-top: 10px;
color: white;
span {
  font-style: italic;
}
`

const SongInfoSubBox = styled.div`
background-color: var(--color-darkpurple);
width: 350px;
height: 380px;
position: relative;
display:flex;
flex-direction: column;
align-items: center;
border-radius: 30px;
justify-content: center;
padding-bottom: 30px;
p, h1{
  color: white
}
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
white-space: pre-wrap;
margin-top: 20px;
line-height: 25px;

word-wrap: break-word;


`

const LyricsWrapper = styled.div`
width: 50vw;
margin: auto;
height: 500px;

margin-top: 90px;
`
const Wrapper = styled.div`
display:flex;`

export default SongPage
