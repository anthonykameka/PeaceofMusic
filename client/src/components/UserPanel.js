import React from 'react'
import styled from 'styled-components'
import { useContext, useState, useEffect } from 'react'
import { CurrentUserContext } from './CurrentUserContext'
import { useNavigate } from 'react-router-dom'
import { MusicContext } from './MusicContext'
import LogoutButton from './LogoutButton'


const UserPanel = () => {
    const navigate = useNavigate();
    const {
        currentUser,
        reviewer,
    } = useContext(CurrentUserContext)

    const {
        refreshEdits,
        setRefreshEdits,
    } = useContext(MusicContext)

    const [pendingEdits, setPendingEdits] = useState(null)
    const [pendingActive, setPendingActive] = useState(false)
    const [pendingEditActive, setPendingEditActive] = useState(false)

    const handlePendingClick = (ev) => {
        ev.preventDefault();

        fetch("/api/get-edits")
        .then(res => res.json())
        .then(res => {
            console.log(res)
            setPendingEdits(res.data.filter(edit => edit.status === "pending")   )// check pending edits
            setPendingActive(!pendingActive)
        })
        
    }

    useEffect(() => {

        fetch("/api/get-edits")
        .then(res => res.json())
        .then(res => {
            console.log(res)
            setPendingEdits(res.data.filter(edit => edit.status === "pending")   )// check pending edits
            setPendingActive(!pendingActive)
        })
    }, [refreshEdits])

    // console.log(pendingEdits)

    const handlePendingEditClick = (ev) => {
        ev.preventDefault();
        console.log(pendingEdits)
        setPendingEditActive(!pendingEditActive)
    }

    const handleGoToEditPage = (edit) => {
        console.log(edit._id)
        console.log("test")
        setPendingEditActive(!pendingEditActive)
        setPendingActive(!pendingActive)
        navigate(`/edits/song/${edit._id}`)
        
    }

    const handleGoToProfile = (ev) => {
        ev.preventDefault();
        navigate("/home")

    }
    

  return (
    <Wrapper>
        {
            !currentUser?
            <p>I am a loading wheel...</p>
            :
            <>
            <UserPanelBox>
            <ProfilePicture  onClick={handleGoToProfile}src={currentUser.profile_picture_src}/>
            <NameAndActions>
                
            <DisplayName>
                {
                currentUser.displayname
                ?currentUser.displayname
                :"Random Pom"
                }

                </DisplayName>
            <UserName>{currentUser.username}</UserName>
            <LogoutPending>
            <PendingBox>
            {
               reviewer?
                <Pending onClick={handlePendingClick}>Pending</Pending>
                :<div></div>
            }
            {
                !pendingActive || !reviewer?
                <div></div>
                :
                <PendingList>
                    <PendingEdits onClick={handlePendingEditClick}><p>edits: {pendingEdits?.length}</p></PendingEdits>
                </PendingList>
            }
            </PendingBox>
            <LogoutButton style={{color: "white"}}/>
            </LogoutPending>
            </NameAndActions>
            </UserPanelBox>
            {
                !pendingEditActive?
                <div></div>
                :
                <PendingEditsList>
                    {
                        pendingEdits.map(edit => {
                            return (
                                <PendingEdit>
                                    <EditTitle onClick={() => {handleGoToEditPage(edit)}}>{edit._id.slice(0, 6)}...</EditTitle>
                                </PendingEdit>
                            )
                        })
                    }
                </PendingEditsList>
            }
            
            </>
        }
        
    </Wrapper>
  )
}

const PendingBox = styled.div`

p{
    margin-left: 13px;
}
`

const UserName = styled.p`
margin-left: 10px;
`

const NameAndActions = styled.div`
height: 80%
;
`
const LogoutPending = styled.div`
display:flex;

justify-content: center;
align-items: center;
`

const UserPanelBox = styled.div`
display:flex;`
const PendingEdit = styled.div`
display:flex;
flex-direction: column;`
const EditTitle = styled.p`
`
const PendingEditsList = styled.ul`
display:flex;
flex-direction: column;
`
const PendingEditPreview = styled.li``

const PendingEdits = styled.li`
display:flex;
flex-direction: column;
`

const PendingList = styled.ul`
`

const Pending = styled.button`
height: 30px;
margin-left: -10px;

`

const DisplayName = styled.h1`
margin-top: 7px;
`

const ProfilePicture = styled.img`
width: 100px;
height: 100px;
border-radius: 100%;
`

const Wrapper = styled.div`
background-color: var(--color-darkpurple);
height: 70%;
display: flex;
align-items: center;
padding: 0 30px;
border-radius: 35px;
position: relative;
margin-bottom: 10px;
right: 0px;
color: black;
width: 300px;
`

export default UserPanel