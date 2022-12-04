import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {format} from 'date-fns'
import { useNavigate } from 'react-router-dom'


const Comment = ({comment}) => {

  const navigate = useNavigate();

  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch(`/api/match-user/${comment.author}`)
    .then(res => res.json())
    .then(res => setUser(res.data))
  }, [])

const handleProfileClick = (ev) => {
  ev.preventDefault();
  navigate(`/profile/${user._id}`)
}

  return (
    <Wrapper>
      {
        !user?<></>
        : 
        <>
        <ScoreBox>
        <Score>{comment.score}</Score>
        </ScoreBox>
        <CommentBox>
            <AuthorPhoto onClick={handleProfileClick}src={user?.profile_picture_src}/>
            <NameAndText>
              <UserName>{user.username}</UserName>
              <CommentText>{comment.text}</CommentText>
            </NameAndText>
        </CommentBox>
        <Date>{comment.date.slice(0, 10)}</Date>
        </>
      }
    </Wrapper>
  )
}

const NameAndText = styled.div`
display: flex;
flex-direction: column;

width: 222px;

`

const UserName = styled.p`
text-decoration: underline;
margin-left: 10px;
margin-bottom: 5px;

`
const Date = styled.p`
  font-size: 14px;
  position: absolute;
  bottom: 10px;
  color: white;
  right: 10px;
  font-weight: bold;`
const AuthorPhoto = styled.img`
width: 50px;
height: 50px;
border-radius: 100%;
margin-left: 10px;


`
const CommentText = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;

  width: 222px;


`

const CommentBox = styled.div`
  display: flex;
  padding: 10px;
  display: relative;

  align-items: center ;
  color: white;
  flex-direction: row;`

const Wrapper = styled.div`
  display: flex;
  height: 100px;
  background-color: var(--color-darkpurple);
  position: relative;
  border: 1px solid black;

`
const ScoreBox = styled.div`
  display: flex;
  flex-direction: column;
`
const Score = styled.p`
  font-size: 20px;
  font-weight: bold;
  border-right: 2px solid var(--color-deepteal);
  height: 100%;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color:white;
  `

export default Comment