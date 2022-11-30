import React, { useEffect } from 'react'
import { useContext, useState } from 'react';
import { MusicContext } from './MusicContext';
import { CurrentUserContext } from './CurrentUserContext';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Diff from "./Diff"


const EditSongPage = () => {

    const navigate = useNavigate();

    const {
      currentUser,
    } = useContext(CurrentUserContext)
  
    const {
      refreshSongs,// to refresh song list after edit or deletion
      setRefreshSongs,// to refresh song list after edit or deletion
      getSong, //getSong function fetching
    } = useContext(MusicContext)

    const _id = useParams()// _id
    const editId = _id.id // editId


    // getting the info for this edit from db
    const [editDetails, setEditDetails] = useState(null)
    const [origDetails, setOrigDetails] = useState(null)
    useEffect(() => {
        fetch(`/api/get-edit/${editId}`)
        .then(res => res.json())
        .then(res => {
            setEditDetails(res.data) // get edit details
            getSong(res.data.targetId)
            .then(res => {
                setOrigDetails(res.data)
            }) // get current song details 
        })

    }, [])
    
    console.log(editDetails)

    console.log(origDetails)

    ////// role and priviledges //
    let canEdit = false;
    let canDelete = false;
    let canApprove = false;

    if (currentUser.role === "admin" || currentUser.role === "founder" ){
        canDelete = true;
        canApprove = true;
        canEdit = true;
      }
      if (currentUser.role === "moderator")  {
        canEdit = true;
        canApprove = true;
      }

      /////// approval /////

      const [approvalActive, setApprovalActive] = useState(false);
      const [approvalConfirmed, setApprovalConfirmed] = useState(false)
      const [declineConfirmed, setDeclineConfirmed] = useState(false)
      const [declineActive, setDeclineActive] = useState(false);
      const [reviewerCommentActive, setReviewerCommentActive] = useState(false)
      const [reviewComment, setReviewComment] = useState(null);
      const [savedReviewComment, setSavedReviewComment] = useState(null);

      const handleApproveEdit = (ev) => {
        ev.preventDefault();
        console.log("test")
        setApprovalActive(!approvalActive)
      }

      const handleConfirmEdit = (ev) => {
        ev.preventDefault();
        console.log("test")
        setApprovalActive(!approvalActive)
        if (approvalConfirmed) {
            //patch to server
            fetch(`/api/`)
            
        }
        
      }

      const handleDeclineConfirmed = (ev) => {
        ev.preventDefault();
        setDeclineConfirmed(ev.target.checked)
        console.log("test")
        setDeclineActive(!declineActive)
    }

      const handleAcceptChange = (ev) => {
        ev.preventDefault();
        setApprovalConfirmed(ev.target.checked)
      }
    
    const handleCancelEdit = (ev) => {
        ev.preventDefault();
        setApprovalConfirmed(false)
        setApprovalActive(!approvalActive)

    }

    const handleDeclineEdit = (ev) => {
        ev.preventDefault();
        console.log("decline")
        setDeclineActive(!declineActive)
    }

    const handleDeclineChange = (ev) => {
        ev.preventDefault();
        setDeclineConfirmed(ev.target.checked)
      }

      const handleCancelDecline = (ev) => {
        ev.preventDefault();
        setDeclineConfirmed(false)
        setDeclineActive(!declineActive)

    }

    const handleReviewerComment = (ev) => {
        ev.preventDefault();
        setReviewerCommentActive(!reviewerCommentActive);
        
        console.log(handleReviewComment())

    }

    const handleReviewComment = () => {
        console.log("test")

        if (reviewComment.length > 0) {
            setSavedReviewComment(reviewComment)
        }
        else {
            setSavedReviewComment(null)

        }
    }





  return (
    <Wrapper>
        {
            !origDetails
            ? <p>loading...</p>
            :
            <>
            <SongInfoBox>
                <SongInfoSubBox>
                    <AlbumCover src={origDetails.thisSong.albumArt}/>
                        <Title><span className ="title">"{origDetails.songTitle}" </span> <span className="by"> - </span>{origDetails.artistName}</Title>
                        <DateAdded>last edit: 
                            {
                                origDetails.virgin?
                                <span>N/A</span>
                                : <span>most recent date</span>

                            }
                        </DateAdded>

                </SongInfoSubBox>
            </SongInfoBox>
            <LyricsMainWrapper>
                <LyricsWrapper>
                    <Lyrics>
                                {origDetails.thisSong.lyrics}
                    </Lyrics>
                </LyricsWrapper>
                <EditWrapper>
                    <EditSubWrapper>
                        {
                            !editDetails.editedTitle?
                            <div></div>
                            :
                            <EditTitleWrapper>
                                <p> Edited song title: </p>
                                <Diff string1={origDetails.songTitle} string2={editDetails.editedTitle} />
                            </EditTitleWrapper>

                        }
                        {
                            !editDetails.editedArtist?
                            <div></div>
                            :
                            <EditArtistWrapper>
                                <p> Edited artist name: </p>
                                <Diff string1={origDetails.artistName} string2={editDetails.editedArtist} />
                            </EditArtistWrapper>
                        }
                                                {
                            !editDetails.editedLyrics?
                            <div></div>
                            :
                            <EditLyricsWrapper>
                                <p> Edited lyrics: </p>
                                <Diff string1={origDetails.thisSong.lyrics} string2={editDetails.editedLyrics} />
                            </EditLyricsWrapper>
                        }
                        {
                            !editDetails.editorComment?
                            <div></div>
                            :
                        <EditorComments>
                            <p> Editor comment:
                            <span>{editDetails.editorComment}</span></p>
                        </EditorComments>
                        }
                        {

                            !savedReviewComment
                            ? <></>
                            :
                            <SeeReviewerComment onClick={handleReviewerComment}>
                            <p>** See Reviewer Comment **</p>
                            </SeeReviewerComment>
                        }
                        
                       
                    </EditSubWrapper>
                    <ApprovalBox>
                        {
                            !canApprove || approvalActive || declineActive
                            ? <div></div>
                            :
                            <>
                            <Approve onClick={handleApproveEdit}> Approve Edit</Approve>
                            
                            <button onClick={handleDeclineEdit}>Decline Edit</button>
                            
                                {
                                    !reviewerCommentActive
                                    ? <button onClick={handleReviewerComment}>Add Comment</button>
                                    : <button onClick={handleReviewerComment}>Save Comment</button>
                                }
                            
                            </> 
                        }
                        {
                            !approvalActive
                            ?<div></div>

                            : 
                            <>
                                
                                <input onChange={(ev) => handleAcceptChange(ev)} type="checkbox"></input>
                                <button onClick={handleConfirmEdit}>Confirm Approval</button>
                                
                                <button onClick={handleCancelEdit}>Cancel</button>
                               

                                
                            </>

                        }
                        {
                            !declineActive
                            ?<div></div>
                            :
                            <>
                            <input onChange={(ev) => handleDeclineChange(ev)} type="checkbox"></input>
                            <button onClick={handleDeclineConfirmed}>Yes, I am sure I want to delete this</button>
                            <button onClick={handleCancelDecline}>Cancel</button>
                            </>
                        }
                    </ApprovalBox>
                </EditWrapper>
                {
                !reviewerCommentActive
                ?<div></div>
                :

            <ReviewerComment>
                <ReviewCommentBox>
                    <h2>Reviewer Comments:</h2>
                    <ReviewComment onChange={(ev) => setReviewComment(ev.target.value)} defaultValue={savedReviewComment} >

                    </ReviewComment>

                </ReviewCommentBox>
            </ReviewerComment>

            }
            </LyricsMainWrapper>

            </>
        }   
        

 

    </Wrapper>
  )
}

const SeeReviewerComment = styled.div`
color: red;
position: absolute;
bottom: 14px;
right: 14px;
`

const ReviewCommentBox = styled.div`
border-radius: 40px;
height: 75%;
width: 75%;
background-color: white;
padding: 20px;
`

const ReviewComment = styled.input`
background: none;
border: none;
&:focus {
background: none;
border: none;
outline: none;
}
`

const ReviewerComment = styled.div`
position: absolute;
margin-top:20px;
bottom: 100px;
right: 200px;
border-radius: 40px;

background-color: var(--color-purple);
height: 300px;
width: 300px;
display: flex;
justify-content: center;
align-items: center;

`

const ApprovalBox = styled.div`
display: flex;
justify-content: center;
align-items: center;
height: 100px;
button {
    height: 40px;
}



`

const Approve = styled.button`
width: 75px;
`

const EditorComments = styled.div`
display:flex;
justify-content: center;
margin-top: 20px;
margin-left: auto;
margin-right: auto;
border-bottom: 1px solid black;
padding-bottom:4px;

width:70%;
p {
    margin-right: 20px;
}

span {
    font-style: italic;
}
`

const EditLyricsWrapper = styled.div`
`

const EditArtistWrapper = styled.div`
display:flex;
justify-content: center;
margin-top: 20px;
margin-left: auto;
margin-right: auto;
border-bottom: 1px solid black;
padding-bottom:4px;
width:70%;
p {
    margin-right: 20px;
}
`

const EditSubWrapper = styled.div`
background-color: white;
width: 80%;
margin: auto;
height: 80%;
position: relative;
border-radius: 40px;


`

const EditTitleWrapper = styled.div`
display:flex;
justify-content: center;
margin-top: 20px;
margin-left: auto;
margin-right: auto;
border-bottom: 1px solid black;
padding-bottom:4px;
width:70%;
p {
    margin-right: 20px;
}
`

const LyricsMainWrapper = styled.div`
display:flex;
`

const EditWrapper = styled.div`

width: 500px;
background-color: var(--color-blue);
display: flex;
flex-direction: column;
border-radius: 40px;
margin-top: 20px;


`


const Wrapper = styled.div`
display:flex;`

const DateAdded = styled.p`
margin-top: 4px;
`

const Title = styled.h1`
font-size: 17px;
margin-top: 10px;
.title {
    font-style: italic;
    font-weight: 500;
}
.by {
    font-weight: 100;
}
`
const SongInfoSubBox = styled.div`
background-color: var(--color-orange);
width: 300px;
height: 300px;
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
width: 30vw;
margin: auto;

`

export default EditSongPage