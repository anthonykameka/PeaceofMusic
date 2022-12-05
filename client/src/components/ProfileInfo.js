import React, { useEffect } from 'react'
import { useContext, useState, useRef } from 'react'
import { CurrentUserContext } from './CurrentUserContext'
import styled from "styled-components";
import FocusLock from "react-focus-lock"
import Modal from "styled-react-modal"
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { set } from 'date-fns';

const ProfileInfo = ({profileID, profileData, params}) => {

    const tags = ["musician", "bass", "guitar", "piano", "drums", 
                "songwriter", "producer", "poet", "fan", "educator", 
                "transcriber", "saxophone", "clarinet", "violin", "cello"]
    // to be used later // each user will select their tags, used for potential future use.
    const {
        currentUser,
        refreshUser,
        setRefreshUser,
    } = useContext(CurrentUserContext)

    
// states for editing info

const [editUserName, setEditUserName] = useState(false)
const [newUserName, setNewUserName] = useState(null)
const [usernameDisplay, setUserNameDisplay] = useState(currentUser.username)
const [editDisplayName, setEditDisplayName] = useState(false)
const [newDisplayName, setNewDisplayName] = useState(null)
const [displayNameDisplay, setDisplayNameDisplay] = useState(currentUser.displayName)
const [editPicture, setEditPicture] = useState(false)
const [pictureSrc, setPictureSrc] = useState(null)

 
     
///////////////////////////////////////
 
// profile page depends on if it is current user or not. logic is below.
// data is changed dependent on currentUserMAtch
    let profile = null;
    let currentUserMatch = false;
    if (!params.id) {
        profile = currentUser
        currentUserMatch=true
    }
    
    
   else if (currentUser?._id === profileData?._id) {
        profile = currentUser
        currentUserMatch=true
    }
    else {
        currentUserMatch=false
        profile = profileData
    }





    let editButtonText = "Edit" // edit button text
    // edit username function
    const handleEditUserName = (ev) => {
        ev.preventDefault();
        setEditUserName(!editUserName)
        if (newUserName && editUserName) {

            if (newUserName.charAt(0) !== "@") {
               
                return
            }
            const patch = {newUserName: newUserName, _id: currentUser._id}

            fetch("/api/update-username/", 
            {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(patch)
            })
            .then(res => res.json())
            .then(res => {
                if (res.status ===200){
                    setUserNameDisplay(newUserName)
                    setRefreshUser(refreshUser+1)
                }
                if (res.status === 402){
                    console.log("already exists")
                }
            })
        }

    } // change button text depending on state
    if (editUserName) {
        editButtonText = "Done"
    }
    else {
        editButtonText = "Edit"
    }


    // display name is nearly identical to username change

    let displayEditButtonText = "Edit"

    const handleEditDisplayName = (ev) => {
        console.log("test")
        ev.preventDefault();
        setEditDisplayName(!editDisplayName)
        if (newDisplayName && editDisplayName) {
            const patch = {newDisplayName: newDisplayName, _id: currentUser._id}

            fetch("/api/update-displayname/", 
            {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(patch)
            })
            .then(res => res.json())
            .then(res => {
                if (res.status ===200){
                    setDisplayNameDisplay(newDisplayName)
                    setRefreshUser(refreshUser+1)
                }
                if (res.status === 402){
                    console.log("already exists")
                }
            })
        }
        setRefreshUser(refreshUser+1)
    }

    // the following handlers for profile photo change. similar concept to the above
    const handlePicture = (ev) => {
        ev.preventDefault();
        setEditPicture(!editPicture)
    }

    const handlePictureChange = (ev) => {
        ev.preventDefault();
        setPictureSrc(ev.target.value)
     
    }

    const handlePatchPicture = (ev) => {
        ev.preventDefault();
        setEditPicture(false)
        const src = {src: pictureSrc, _id: currentUser._id}
        if (pictureSrc !== null) {
        fetch("/api/update-picture/", 
            {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(src)
            })
            .then(res => res.json())
            .then(res => {
                if (res.status ===200){
                    setRefreshUser(refreshUser+1)
                }
                
            })
        }
    }




    if (editDisplayName) {
        displayEditButtonText = "Done"
    }
    else {
        displayEditButtonText = "Edit"
    }

    ///USER DEACTIVATION // USER CANOT DELETE SUBMISSIONS OR COMMENTS. // ONLY THEIR PROFILE. RELOGGING IN WILL REACTIVATE
    const { logout } = useAuth0();

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); // initialize modal state
    const [deleteConfirmed, setDeleteConfirmed] = useState(false)
   //function to toggle modal
    const toggleModal = () => {

    setIsOpen(!isOpen)
    }

    const handleDeleteProfile = (ev) => {
        ev.preventDefault();
       
        toggleModal();
    }
    
    const handleCancel = (ev) => {
        ev.preventDefault();
        toggleModal();
        setDeleteConfirmed(false)
        navigate("/home")
    }

    

    const handleYesChange = (ev) => {
        ev.preventDefault()
        setDeleteConfirmed(ev.target.checked);
    }

    const handleDeactivation = (ev) => {
        ev.preventDefault();
        if (deleteConfirmed) {
            setRefreshUser(refreshUser+1)
            deactivateUser();
        }
    }
 // deactivation
    const deactivateUser = async (req, res) => {
        await fetch(`/api/deactivate-user/${currentUser._id}`,
        {
            method: "PATCH",

        })
        .then(res => res.json())
        .then(res => {
            
            logout();
        })
    }
    // handlers

    const handleDisplayCancel = (ev) => {
        ev.preventDefault();
        setEditDisplayName(!editDisplayName)
        // setDisplayNameDisplay(null)
    }

    const handleUserCancel = (ev) => {  
        ev.preventDefault();
        setEditUserName(!editUserName)
    }

    const handlePictureCancel = (ev) => {
            ev.preventDefault();
            setEditPicture(!editPicture)
    }
    return (
        <Wrapper>
            {
                !profile?<></>
                : 
            <>
            <TopContent>
                {/* <ClicktoEdit>Click to Edit</ClicktoEdit> */}
                <DisplayNameLine>       
                    <DisplayName>
                        {
                            !editDisplayName
                            ?
                                !profile.displayname
                                ? <h2>Random Pom</h2>
                                : <h2>{profile.displayname}</h2>
                            :
                            <>
                                <input placeholder={profile.displayname}
                                        onChange={(e)=> setNewDisplayName(e.target.value)}
                                ></input>
                                <CancelButton onClick={handleDisplayCancel}>Cancel</CancelButton>
                            </>
                        }
                    </DisplayName>
                    {
                        currentUserMatch? <EditDisplay onClick={(handleEditDisplayName)}>{displayEditButtonText}</EditDisplay>
                        : <></>
                    }
                   
                </DisplayNameLine>
                <UserNameLine>
                    <UserName>
                        {
                            !editUserName?
                            <h2>{usernameDisplay}</h2> 
                            : <>
                            <input 
                                placeholder={profile.username} 
                                onChange={(e)=> setNewUserName(e.target.value)}>
                                        
                            </input>
                            <CancelButton onClick = {handleUserCancel}>Cancel</CancelButton>
                            </>
                        }
                        
                    </UserName>
                    {
                        currentUserMatch? 
                        <>
                        
                        <EditUser onClick={(handleEditUserName)}>{editButtonText}</EditUser>
                        </>
                        : <></>
                    }
                
                 
                </UserNameLine>
                <RolesBox>
                    {
                        profile.tags?
                        tags.map((tag => {
                            return (
                                <Tag>{tag}</Tag>
                            )
                        }))
                        : <div style={{display: "none"}}></div>
                    }
                </RolesBox>
            </TopContent>
            <MiddleContent>
                <Contributions>
                    <ContributionsTitle>Contributions: </ContributionsTitle>
                    <SongsAdded>Songs Added: {profile.adds}</SongsAdded>
                    <Annotations>
                        Annotations: 
                        {
                        profile.annotations.meanings.length + profile.annotations.theories.length > 0
                        ? profile.annotations.meanings.length + profile.annotations.theories.length
                        : 0
                        }
                    </Annotations>
                    <Edits>
                        edits: 
                        {
                        profile.edits.approved.length + profile.edits.approved.length > 0
                        ? profile.edits.approved.length + profile.edits.approved.length
                        : 0
                        }
                    </Edits>
                    <Comments>
                        comments: 
                        {
                        profile.comments.approved.length + profile.comments.approved.length > 0
                        ? profile.comments.approved.length + profile.comments.approved.length
                        : 0
                        }
                    </Comments>
                    <Poms>
                        poms: 
                        {
                        profile.poms.approved.length + profile.poms.approved.length > 0
                        ? profile.poms.approved.length + profile.poms.approved.length
                        : 0
                        }
                    </Poms>


                </Contributions>
                <AccountStatus>Account Status: {profile.role}</AccountStatus>
            </MiddleContent>
            <BottomContent>
                {
                        !currentUserMatch? <></>
                        : 
                
                <DeleteUpdate>
                
                {   
                    !editPicture
                    ?<UpdateProfile onClick={handlePicture}>Update Picture</UpdateProfile>
                    : <PictureEdit>
                        <input placeholder="enter URL" onChange={(ev) => handlePictureChange(ev)} ></input>
                        <CancelConfirm>
                            <Confirm   Confirm onClick={handlePatchPicture}>Confirm</Confirm>
                            <CancelPicture onClick = {handlePictureCancel}>Cancel</CancelPicture>
                        </CancelConfirm>
                    </PictureEdit>
                }
                
                </DeleteUpdate>
                }
                <ProfilePic src={profile.profile_picture_src} />
                {
                        !currentUserMatch? <></>
                        : <DeleteProfile onClick={handleDeleteProfile}>Deactivate</DeleteProfile>
                }
                
            </BottomContent>
            {
                        !currentUserMatch? <></>
                        :
            <Modal
                isOpen={isOpen}
                onEscapeKeydown={toggleModal}
                role="dialog"
                aria-modal={true}
                aria-labelledby="modal-label"
                >
            <FocusLock>
                <Form>
                    <h1>Are you sure you want to deactivate your profile?</h1>
                <Label>Yes</Label>
               <Yes onChange={(ev) => handleYesChange(ev)} type="checkbox"/>
               <Deactivate onClick={handleDeactivation}>Deactivate profile </Deactivate>
               <Cancel onClick={handleCancel}>Cancel</Cancel>
               
                </Form>
            </FocusLock>

        </Modal>
        }
        </>
    }
        </Wrapper>
    )
}

const CancelPicture = styled.button`
position: absolute;
top: 0px;
left: -40px;

`

const Confirm = styled.button`
position: absolute;
left: -104px;
`

const CancelConfirm = styled.div`
width: 25%;
position: absolute;
top: 20px;
left: 80px;
`

const PictureEdit = styled.div`
display: flex;
flex-direction: column;
width: 50%;
justify-content: space-between;
position: absolute;
top: -40px;
left: 10px;



input {
    background: transparent !important;
    border: 1px solid black
    border-radius: 30px;
    font-size: 16px;
    height: 2
    

    &:active{
        border: 1px solid var(--color-darkpurple)
    }
}
`

const CancelButton = styled.button`
position: absolute;
right: 53px;
`

const DeleteUpdate = styled.div`
width: 100%;
display:flex;
    justify-content: space-between;
    align-items: center;
`

const UpdatePicture = styled.button`
margin-left: 10px;
`

const PictureInput = styled.input`
`

const Poms = styled.p`
`

const AccountStatus = styled.p``

const Annotations = styled.p`
`

const Comments = styled.p`
`
const Edits = styled.p`
`

const MiddleContent = styled.div`
margin-left: 5px;
`

const Contributions = styled.div`
`
const ContributionsTitle = styled.h1`
`
const SongsAdded = styled.p`
`

const Form = styled.form`
background-color: var(--color-orange);
border-radius: 10px;
padding:20px;
`

const Yes = styled.input``

const Cancel = styled.button`

`
const Label = styled.label``

const Deactivate = styled.button`
`

const DeleteProfile = styled.button`
width: 20%;
bottom: -5px;
right: 50px;
position: absolute;
margin-bottom: 10px;`

const UpdateProfile = styled.button`
width: 20%;
top: -30px;
left: 0;
position: absolute;
margin-bottom: 10px;`


const RolesBox = styled.div`

`

const Tag = styled.button``

const ClicktoEdit = styled.p`
color: var(--color-purple);
margin-bottom: 5px;`

const UserNameLine = styled.div`
display:flex;
input {
    background: transparent !important;
    border: none!important;
    border-radius: 10px;
    font-size: 16px;

    &:active{
        border: 1px solid var(--color-darkpurple)
    }
    
}
width: 100%;`

const DisplayNameLine = styled.div`
display:flex;
margin-bottom: 10px;
width: 100%;
input {
    background: transparent !important;
    border: 1px solid grey;
    border-radius: 10px;
    font-size: 16px;
    
    &:active{
        border: 1px solid var(--color-darkpurple)
    }
    
}

`

const DisplayName = styled.div`
display:flex;
justify-content: space-between;
width: 80%;
`
const UserName = styled.div`
display:flex;
justify-content: space-between;
width: 80%;

`

const EditUser = styled.button`
 &:hover{
    color: var(--color-white)
 }
`

const EditDisplay = styled.button``


const BottomContent = styled.div`
display: flex;
justify-content: center;
position: absolute;
bottom: 0;
width: 100%;
flex-direction: column;
align-items: center;

`

const TopContent = styled.div`
display: flex;
margin-top: 5px;
margin-left: 5px;
flex-direction: column;
`
const Wrapper = styled.div`
    display:flex;
    flex-direction: column;
    border-left: 1px dotted rgba(0, 0, 0,  0.2);
    width: 23vw;
    height: calc(100vh - 200px);
    position: absolute;
    right: 0;
    /* box-shadow: rgba(240, 46, 170, 0.4) -5px 5px, rgba(240, 46, 170, 0.3) -10px 10px, rgba(240, 46, 170, 0.2) -15px 15px, rgba(240, 46, 170, 0.1) -20px 20px, rgba(240, 46, 170, 0.05) -25px 25px; */
 
    background: linear-gradient(var(--color-deepteal), var(--color-darkpurple), var(--color-orange));
    p, h1, h2{
        color: black;
    }
`

const ProfilePic = styled.img`
border-radius: 100%;
width: 200px;
height: auto;
margin-bottom: 20px;
`

export default ProfileInfo