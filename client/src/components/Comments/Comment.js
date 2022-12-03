import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {format} from 'date-fns'


const Comment = ({comment}) => {

  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch(`/api/match-user/${comment.author}`)
    .then(res => res.json())
    .then(res => setUser(res.data))
  }, [])

  console.log(comment)
  console.log(user)

  return (
    <Wrapper>
       <ScoreBox>
        <Score>{comment.score}</Score>
       </ScoreBox>
       <CommentBox>
        <AuthorPhoto src={user?.profile_picture_src}/>
        <CommentText>{comment.text}</CommentText>
       </CommentBox>
       <Date>{comment.date.slice(0, 10)}</Date>
    </Wrapper>
  )
}
const Date = styled.p`
  font-size: 14px;
  position: absolute;
  bottom: 10px;
  color: white;
  right: 10px;
  font-weight: bold;`
const AuthorPhoto = styled.img`
width: 40px;
height: 40px;
border-radius: 100%;
margin-left: 10px;


`
const CommentText = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;

  width: 275px;


`

const CommentBox = styled.div`
  display: flex;
  padding: 10px;
  display: relative;
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