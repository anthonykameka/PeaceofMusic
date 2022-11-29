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
            setPendingEdits(res.data)
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
            <ProfilePicture src={pomme}/>
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
`

const DisplayName = styled.h1`
`

const ProfilePicture = styled.img`
width: 100px;
border-radius: 100%;
`

const Wrapper = styled.div`
background-color: var(--color-purple);
height: 70%;
`

export default UserPanel