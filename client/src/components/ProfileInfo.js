import React from 'react'
import { useContext, useState, useRef } from 'react'
import { CurrentUserContext } from './CurrentUserContext'
import styled from "styled-components";
import pomme1 from "../assets/pommes/pomme1.png"
import pomme2 from "../assets/pommes/pomme2.png"
import pomme3 from "../assets/pommes/pomme3.png"
import pomme4 from "../assets/pommes/pomme4.png"
import pomme5 from "../assets/pommes/pomme5.png"
import pomme6 from "../assets/pommes/pomme6.png"
import FocusLock from "react-focus-lock"
import Modal from "styled-react-modal"
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const ProfileInfo = () => {

    const tags = ["musician", "bass", "guitar", "piano", "drums", 
                "songwriter", "producer", "poet", "fan", "educator", 
                "transcriber", "saxophone", "clarinet", "violin", "cello"]

    const {
        currentUser,
        refreshUser,
        setRefreshUser,
    } = useContext(CurrentUserContext)


        //default profile picture randomizer
///////////////////////////////////////
    const randomIntFromInterval = (min, max) => { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    const randomInt = randomIntFromInterval(1, 6) // increase depending on photos in the assets
    //console.log(randomInt)

    const pommes = [pomme1, pomme2, pomme3, pomme4, pomme5, pomme6]

    let profilePictureSrc = pomme1
    /////////////////////
    // console.log(currentUser)

    ///EDIT USERNAME///



    const [editUserName, setEditUserName] = useState(false)
    const [newUserName, setNewUserName] = useState(null)
    const [usernameDisplay, setUserNameDisplay] = useState(currentUser.username)


    let editButtonText = "Edit"

    const handleEditUserName = (ev) => {
        ev.preventDefault();
        setEditUserName(!editUserName)
        if (newUserName && editUserName) {

            if (newUserName.charAt(0) !== "@") {
                console.log("wrong format")
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

    }
    if (editUserName) {
        editButtonText = "Done"
    }
    else {
        editButtonText = "Edit"
    }


    const [editDisplayName, setEditDisplayName] = useState(false)
    const [newDisplayName, setNewDisplayName] = useState(null)
    const [displayNameDisplay, setDisplayNameDisplay] = useState(currentUser.displayName)


    let displayEditButtonText = "Edit"

    const handleEditDisplayName = (ev) => {
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
    }

    if (editDisplayName) {
        displayEditButtonText = "Done"
    }
    else {
        displayEditButtonText = "Edit"
    }

    ///DELETE FUNCTION + DELETE MODAL ///
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
        console.log("deleting")
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

    const deactivateUser = async (req, res) => {
        await fetch(`/api/deactivate-user/${currentUser._id}`,
        {
            method: "PATCH",

        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            logout();
        })
    }


    return (
        <Wrapper>
            <TopContent>
                <ClicktoEdit>Click to Edit</ClicktoEdit>
                <DisplayNameLine>
                    <DisplayName>
                        {
                            !editDisplayName?
                            !currentUser.displayname?
                            <h2>Random Pom</h2>
                            : <h2>{currentUser.displayname}</h2>
                            :<input placeholder={currentUser.displayname} onChange={(e)=> setNewDisplayName(e.target.value)}></input>
                        }
                    </DisplayName>
                    <EditDisplay onClick={(handleEditDisplayName)}>{displayEditButtonText}</EditDisplay>
                </DisplayNameLine>
                <UserNameLine>
                    <UserName>
                        {
                            !editUserName?
                            <h2>{usernameDisplay}</h2> 
                            : <input placeholder={currentUser.username} onChange={(e)=> setNewUserName(e.target.value)}></input>
                        }
                        
                    </UserName>
                
                    <EditUser onClick={(handleEditUserName)}>{editButtonText}</EditUser>
                </UserNameLine>
                <RolesBox>
                    {
                        currentUser.tags?
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
                    <SongsAdded>Songs Added: {currentUser.adds}</SongsAdded>
                    <Annotations>
                        Annotations: 
                        {
                        currentUser.annotations.meanings.length + currentUser.annotations.theories.length > 0
                        ? currentUser.annotations.meanings.length + currentUser.annotations.theories.length
                        : 0
                        }
                    </Annotations>
                    <Edits>
                        edits: 
                        {
                        currentUser.edits.approved.length + currentUser.edits.approved.length > 0
                        ? currentUser.edits.approved.length + currentUser.edits.approved.length
                        : 0
                        }
                    </Edits>
                    <Comments>
                        comments: 
                        {
                        currentUser.comments.approved.length + currentUser.comments.approved.length > 0
                        ? currentUser.comments.approved.length + currentUser.comments.approved.length
                        : 0
                        }
                    </Comments>
                    <Poms>
                        poms: 
                        {
                        currentUser.poms.approved.length + currentUser.poms.approved.length > 0
                        ? currentUser.poms.approved.length + currentUser.poms.approved.length
                        : 0
                        }
                    </Poms>


                </Contributions>
                <AccountStatus>Account Status: {currentUser.role}</AccountStatus>
            </MiddleContent>
            <BottomContent>
                <DeleteProfile onClick={handleDeleteProfile}>Delete Profile</DeleteProfile>
                <ProfilePic src={pomme4} />
            </BottomContent>
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
               <Cancel onClick={handleCancel}>Cancel</Cancel>
               <Deactivate onClick={handleDeactivation}>Deactivate profile.. </Deactivate>
                </Form>
            </FocusLock>

        </Modal>

        </Wrapper>
    )
}

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
`

const Contributions = styled.div`
`
const ContributionsTitle = styled.h1`
`
const SongsAdded = styled.p`
`

const Form = styled.form`
`

const Yes = styled.input``

const Cancel = styled.button``
const Label = styled.label``

const Deactivate = styled.button`
`

const DeleteProfile = styled.button`
width: 20%;
margin-bottom: 10px;`

const RolesBox = styled.div`

`

const Tag = styled.button``

const ClicktoEdit = styled.p`
color: var(--color-purple);
margin-bottom: 5px;`

const UserNameLine = styled.div`
display:flex;`

const DisplayNameLine = styled.div`
display:flex;
margin-bottom: 10px;`

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
    width: 30vw;
    height: calc(100vh - 200px);
    position: relative;
`

const ProfilePic = styled.img`
border-radius: 100%;
width: 200px;
height: auto;
margin-bottom: 20px;
`

export default ProfileInfo