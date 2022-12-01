import React, { useEffect } from 'react'
import { useContext, useState } from 'react';
import { MusicContext } from './MusicContext';
import { CurrentUserContext } from './CurrentUserContext';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Diff from "./Diff"


const EditSongPage = () => {

    const navigate = useNavigate(); // declare navigate hook

    const {
      currentUser,
    } = useContext(CurrentUserContext) // getcurrent user details
  
    const {
      refreshSongs,// to refresh song list after edit or deletion
      setRefreshSongs,// to refresh song list after edit or deletion
      getSong, //getSong function fetching
      refreshEdits,
      setRefreshEdits,
    } = useContext(MusicContext)

    const _id = useParams()// 
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

    }, [refreshEdits, setRefreshEdits])
    
    //  console.log(editDetails)

     //console.log(origDetails)

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

      /////// approval system /////

      const [approvalActive, setApprovalActive] = useState(false); // active toggle for approval button
      const [approvalConfirmed, setApprovalConfirmed] = useState(false) // toggle when reviewer has chosen to confirm the edit
      const [declineConfirmed, setDeclineConfirmed] = useState(false) // toggle when reviewer has chosent to decline the edit
      const [declineActive, setDeclineActive] = useState(false); // active toggle for decline button
      const [reviewerCommentActive, setReviewerCommentActive] = useState(false) // ^^ for reviewer comments button
      const [reviewComment, setReviewComment] = useState(null); // keep track of reviewer comments
      const [savedReviewComment, setSavedReviewComment] = useState(null); // save reviewer comments until leaves page

      /// handlers/// lots of similar names// apologies//
      //button states 

      const handleApproveEdit = (ev) => { //toggle approval button
        ev.preventDefault();
        setApprovalActive(!approvalActive)
      }

// process to submit approval of review to server
      const handleConfirmEdit = (ev) => {
        ev.preventDefault();

        setApprovalActive(!approvalActive)
        if (approvalConfirmed) {
            // if approval confirmed, send following object . go to backend to see what is done from here.
            const approval = {
                editId: editId,
                reviewerId: currentUser._id,
                status: "approved",
                reviewComments: reviewComment,
                targetId: editDetails.targetId

            }
            //patch to server// use same endpoint as decline, as the info is very similar.
            fetch(`/api/review-edit/`,
            {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(approval)
            })
            setRefreshEdits(refreshEdits + 1)
        }
        
      }
// process to decline the edit after review to server
      const handleDeclineConfirmed = (ev) => {
        ev.preventDefault();
        setDeclineConfirmed(ev.target.checked)
        console.log("test")
        setDeclineActive(!declineActive)
        if (declineConfirmed) {
            const decline = {
                editId: editId,
                reviewerId: currentUser._id,
                status: "declined",
                reviewComments: reviewComment,
                targetId: editDetails.targetId

            }

            fetch(`/api/review-edit/`,
            {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(decline)
            })

            setRefreshEdits(refreshEdits + 1)
            setRefreshSongs(refreshSongs + 1)
        }


    }

    //onchange for listening to confirm checkbox

      const handleAcceptChange = (ev) => {
        ev.preventDefault();
        setApprovalConfirmed(ev.target.checked)
      }

          //onchange for listening to confirm checkbox
        const handleDeclineChange = (ev) => {
        ev.preventDefault();
        setDeclineConfirmed(ev.target.checked)
      }

      // cancel button for approval
    
    const handleCancelEdit = (ev) => {
        ev.preventDefault();
        setApprovalConfirmed(false)
        setApprovalActive(!approvalActive)

    }

    // cancel button for decline

    const handleCancelDecline = (ev) => {
        ev.preventDefault();
        setDeclineConfirmed(false)
        setDeclineActive(!declineActive)

    }


    // Decline button toggle

    const handleDeclineEdit = (ev) => {
        ev.preventDefault();
        setDeclineActive(!declineActive)
    }

    // reviewer comments handlers, toggles the pop up
    const handleReviewerComment = (ev) => {
        ev.preventDefault();
        setReviewerCommentActive(!reviewerCommentActive); // setReviewer toggle
    
        handleReviewComment() // calling the handleReviewComment function that is immediately below

    }
// listener for the input for reviewer comment. save it in state if > 0
    const handleReviewComment = () => {
        console.log("test")

        if (reviewComment.length > 0) {
            setSavedReviewComment(reviewComment) 
        }
        else {
            setSavedReviewComment(null)

        }
    }
 let pending = false
 if (editDetails?.status === "pending") {
    pending = true
 }


  return (
    <Wrapper>
        {
            !origDetails // Conditional render based on fetch that occurs
            ? <p>loading...</p>
            :
            <>
            <SongInfoBox>
                <SongInfoSubBox>
                    <AlbumCover src={origDetails.thisSong.albumArt}/> 
                        <Title><span className ="title">"{origDetails.songTitle}" </span> <span className="by"> - </span>{origDetails.artistName}</Title>
                        <DateAdded>last edit: 
                            {
                                origDetails.virgin? // has this song ever been edited?
                                <span>N/A</span>
                                : <span>most recent date</span> // TO DO** if notvirgin, show most recent edit

                            }
                        </DateAdded>

                </SongInfoSubBox>
            </SongInfoBox>
            <LyricsMainWrapper>
                {
                    !editDetails.editedLyrics
                    ?
                    <LyricsWrapper>
                        <Lyrics>
                                    {origDetails.thisSong.lyrics} // current lyrics 
                                    
                        </Lyrics>
                    
                    </LyricsWrapper>
                    :
                    <EditLyricsWrapper>
                        <p> Edited lyrics: </p>
                        <Diff string1={editDetails.currentDetails.currentLyrics} string2={editDetails.editedLyrics} />
                    </EditLyricsWrapper>
                }
                <StatusAndReviewerComments>
                <EditWrapper>
                    <EditSubWrapper>
                        {
                           <h1>Status: {editDetails?.status}</h1> 
                        }
                        
                        {
                            // series of 3 similar portions, depending on what the fields the edits have occured in.
                            // DIFF is a function  that  from Diff.js that uses diff js npm.
                            // this compares two strings and checks for difference// and allows you to style accordingly.
                            // an ideal shortcut for an editor at scale.
                        
                            !editDetails.editedTitle? 
                            <EditTitleWrapper>SONGTITLE: no change</EditTitleWrapper>
                            :
                            <EditTitleWrapper>
                                <p> Edited song title: </p>
                                
                                <Diff string1={editDetails.currentDetails.currentTitle} string2={editDetails.editedTitle} />
                            </EditTitleWrapper>

                        }
                        {
                            !editDetails.editedArtist?
                            <EditArtistWrapper>ARTIST NAME: no change</EditArtistWrapper>
                            :
                            <EditArtistWrapper>
                                <p> Edited artist name: </p>
                                <Diff string1={editDetails.currentDetails.currentArtist} string2={editDetails.editedArtist} />
                            </EditArtistWrapper>
                        }
                        {
                            !editDetails.editorComment
                            ?<div></div>
                            :
                            <EditorComments>
                                <p> Editor comment:
                                <span>{editDetails.editorComment}</span></p> 
                            </EditorComments>
                        }



                        {
                            // is there a saved comment by the reviewer? if so, show **see**
                            !savedReviewComment
                            ? <></>
                            :
                            <SeeReviewerComment onClick={handleReviewerComment}>
                            <p>** See Reviewer Comment **</p>
                            </SeeReviewerComment>
                        }
                        
                       
                    </EditSubWrapper>
                    {
                        !pending
                        ? <></>
                        :
                    
                    <ApprovalBox>
                        {
                            // using user role, show edit reviewer righs
                            !canApprove || approvalActive || declineActive
                            ? <div></div>
                            :
                            <>
                            <Approve onClick={handleApproveEdit}> Approve Edit</Approve>
                            
                            <button onClick={handleDeclineEdit}>Decline Edit</button>
                            
                                {
                                    // switch the button name from add to save
                                    !reviewerCommentActive
                                    ? <button onClick={handleReviewerComment}>Add Comment</button>
                                    : <button onClick={handleReviewerComment}>Save Comment</button>
                                }
                            
                            </> 
                        }
                        {
                            // if approval mode is toggle do the following. listen to checkbox and show buttons
                            !approvalActive
                            ?<div></div>

                            : 
                            <>
                                
                                <input onChange={(ev) => handleAcceptChange(ev)} type="checkbox"></input>
                                <button onClick={handleConfirmEdit}>Confirm Approval</button>
                                
                                <button onClick={handleCancelEdit}>Cancel</button>
                               

                                
                            </>

                        }
                        {   // if decline mode is toggle do the following. listen to checkbox and show buttons
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
                    }
                </EditWrapper>
                {
                !reviewerCommentActive
                ?<div></div>
                :
                    //reviewer comment box    
            <ReviewerComment>
                <ReviewCommentBox>
                    <h2>Reviewer Comments:</h2>
                    <ReviewComment onChange={(ev) => setReviewComment(ev.target.value)} defaultValue={savedReviewComment} >

                    </ReviewComment>

                </ReviewCommentBox>
            </ReviewerComment>
            

            }
            </StatusAndReviewerComments>
            </LyricsMainWrapper>

            </>
        }   
        

 

    </Wrapper>
  )
}

const StatusAndReviewerComments = styled.div`
display:flex;
flex-direction:column;`
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

const ReviewComment = styled.textarea`
background: none;
width: 90%;
border: none;
height: 80%;
&:focus {
background: none;
border: none;
outline: none;
}
`

const ReviewerComment = styled.div`
position: relative;
margin-top:20px;
border-radius: 40px;

background-color: var(--color-purple);
height: 300px;
width: 500px;
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
white-space: pre-wrap;`


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
height: 60%;
position: relative;
border-radius: 40px;
padding: 20px;


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
height: 500px;


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