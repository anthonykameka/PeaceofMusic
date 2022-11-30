import React from 'react'
import styled from 'styled-components'
import { useContext, useState } from 'react'
import { CurrentUserContext } from './CurrentUserContext'
import pomme from "../assets/pommes/pomme4.png"
import { useNavigate } from 'react-router-dom'


const UserPanel = () => {
    const navigate = useNavigate();
    const {
        currentUser,
        reviewer,
    } = useContext(CurrentUserContext)

    const [pendingEdits, setPendingEdits] = useState(null)
    const [pendingActive, setPendingActive] = useState(false)
    const [pendingEditActive, setPendingEditActive] = useState(false)

    const handlePendingClick = (ev) => {
        ev.preventDefault();

        fetch("/api/get-edits")
        .then(res => res.json())
        .then(res => {
            console.log(res)
            setPendingEdits(res.data.filter(edit => edit.pending === true)   )// check pending edits
            setPendingActive(!pendingActive)
        })
        
    }

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

  return (
    <Wrapper>
        {
            !currentUser?
            <p>I am a loading wheel...</p>
            :
            <>
            <UserPanelBox>
            <ProfilePicture src={pomme}/>
            <NameAndActions>
            <DisplayName>{currentUser.displayname} </DisplayName>
            {
               reviewer?
                <Pending onClick={handlePendingClick}>Pending</Pending>
                :<div></div>
            }
            {
                !pendingActive?
                <div></div>
                :
                <PendingList>
                    <PendingEdits onClick={handlePendingEditClick}>{pendingEdits?.length}</PendingEdits>
                </PendingList>
            }
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
                                    <EditTitle onClick={() => {handleGoToEditPage(edit)}}>{edit.editedTitle}</EditTitle>
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

const NameAndActions = styled.div`
height: 80%
;
`


const UserPanelBox = styled.div`
display:flex;`
const PendingEdit = styled.div``
const EditTitle = styled.p`
`
const PendingEditsList = styled.ul``
const PendingEditPreview = styled.li``

const PendingEdits = styled.li`
`

const PendingList = styled.ul`
`

const Pending = styled.button`
height: 30px;
margin-top: 30px;
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
background-color: var(--color-purple);
height: 70%;
display: flex;
align-items: center;
padding: 0 30px;
border-radius: 35px;
position: absolute;
right: 50px
`

export default UserPanel