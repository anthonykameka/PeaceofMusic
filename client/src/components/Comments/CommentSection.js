import React from 'react'
import { useState, useContext } from 'react';
import styled from 'styled-components';
import { CurrentUserContext } from '../CurrentUserContext';
import PomEditor from '../TextEditor/PomEditor';
const CommentSection = () => {

  const {
    currentUser
  } = useContext(CurrentUserContext)

  const [comments, updateComments] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false)

    // useEffect(() => {
    //   fetch(`/api/get-comments/:id`)
    //   .then(res => res.json())
    //   .then(res => {

    //     setComments(res.data)
    //   })


    // }, [])
    
    const handleLeaveComment = (ev) => {
      ev.preventDefault();

    }
    console.log(currentUser)

  return (
    <Wrapper>
      <BoxA>
        <NumberOfComments>
        ### Comments
        </NumberOfComments>
        <Comment>
          <CommentBox>
            <ProfilePicture src={currentUser.profile_picture_src}></ProfilePicture>
            <CommentTextarea></CommentTextarea>
            <CommentToolbar><SubmitComment onClick={handleLeaveComment} className="yes">Submit</SubmitComment></CommentToolbar>
          </CommentBox>
        </Comment>
      </BoxA>
      <FilterBox>
        <SortBy>View By</SortBy>
      </FilterBox>
      <CommentsBox>
        
      </CommentsBox>
    </Wrapper>
  )

  
}
const ProfilePicture = styled.img`
`
const Comment = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  flex-direction: column;
  `

  const CommentBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    `
    

  const CommentToolbar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    
  `
  const CommentTextarea = styled.textarea`
    width: 75%;
    border: none;
    outline: none;
    padding: 10px;
    font-size: 16px;
    background-color: var(--color-orange);
    `
  const SubmitComment = styled.button`
    background: var(--color-deepteal);
    `



const NewComment = styled.div`
`
const Wrapper = styled.div`
background-color: var(--color-darkpurple);
display: flex;
flex-direction: column;
margin-top: 40px;


`

const BoxA = styled.div`
display:flex;
flex-direction: column;
`

const NumberOfComments = styled.h1`
`

const LeaveComment = styled.button`
`

const FilterBox = styled.div``

const SortBy = styled.ul`
`

const CommentsBox = styled.div`
`

export default CommentSection