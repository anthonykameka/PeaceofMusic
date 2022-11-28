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
import EditProfile from './EditProfile';

const ProfileInfo = () => {

    const tags = ["musician", "bass", "guitar", "piano", "drums", 
                "songwriter", "producer", "poet", "fan", "educator", 
                "transcriber", "saxophone", "clarinet", "violin", "cello"]

    const {
        currentUser,
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

    //console.log(currentUser.displayname)


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
                        : <h1>Edit Roles</h1>
                    }
                </RolesBox>
            </TopContent>
            <BottomContent>
                <ProfilePic src={pomme4} />
            </BottomContent>

        </Wrapper>
    )
}

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

    width: 30vw;
    height: 70vh;
    position: relative;
`

const ProfilePic = styled.img`
border-radius: 100%;
width: 200px;
height: auto;
`

export default ProfileInfo