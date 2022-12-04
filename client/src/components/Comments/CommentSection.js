import { faBorderNone } from '@fortawesome/free-solid-svg-icons';
import React from 'react'
import { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { CurrentUserContext } from '../CurrentUserContext';
import PomEditor from '../TextEditor/PomEditor';
import Comment from "./Comment"
const CommentSection = ({songId}) => {

  const {
    currentUser
  } = useContext(CurrentUserContext)

  const [comments, setComments] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false)
  const [refreshComments, setRefreshComments] = useState(0)
  // console.log(songId)

    

    // console.log(currentUser)



    // const handleReference = (ev) => {

    //   let selection= window.getSelection().getRangeAt(0);
    //   let selectedText = selection.extractContents();
    //   let span= document.createElement("span");
    //   span.style.backgroundColor = "var(--color-orange)";
    //   span.appendChild(selectedText);
    //   selection.insertNode(span);
    //   // let span = document.createElement("span")
    //   // span.backgroundColor = "var(--color--orange)"

    //   // ev.preventDefault();
    //   // const sel = window.getSelection();
    //   // if (sel.rangeCount) {
    //   //   const range = sel.getRangeAt(0);
    //   //   console.log(range)
    //   //   const cloneRange = range.cloneRange();
    //   //   console.log(cloneRange)
    //   //   range.surroundContents(span);
    //   //   sel.removeAllRanges();
    //   //   sel.addRange(range);// const text = range.toString();
    //   //   // console.log(text)
    //   //   /const text = window.getSelection().toString()/ const id = text.split(' ')[0];
    //   //   // console.log(id)
    //   }

      const handleLeaveComment = (ev) => {
        ev.preventDefault();
        const comment = {
          text: commentText,
          author: currentUser._id,
          date: new Date(),
          parentID:null,
          children: [],
          score: 0,
          target: songId

        }

        console.log(comment)
        fetch("/api/post-comment",
        {
          method: "POST",
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
          },
          body: JSON.stringify(comment)
          
      })
    
       .then(res => res.json())
       .then(res =>  {
        console.log(res.data)
        setRefreshComments(refreshComments + 1)
        document.getElementById("comment-post").reset()
       })}

      


      const [commentText, setCommentText] = useState(null)
      //console.log(comments)

      useEffect(() => {
        fetch(`/api/get-comments/${songId}`)
        .then(res => res.json())
        .then(res => {
          // console.log(res.data)
          setComments(res.data)
        })
  
  
      }, [refreshComments])
      

   
  return (
    <Wrapper>
      
     
      <FilterBox>
        <SortBy>View By</SortBy>
      </FilterBox>
      <CommentsBox>
        
        { !comments? <></>
        :
          comments.map(comment => {
            return (
              <CommentWrapper >
                <Comment comment={comment}/>
                
              </CommentWrapper>
            )
        })
      }
    
      </CommentsBox>
      <BoxA>
        {
          !comments? <></>
          :
          <NumberOfComments>
          {comments.length} Comments
          </NumberOfComments>
        }
        <PostComment>
          <CommentBox>
            <ProfilePicture src={currentUser?.profile_picture_src}></ProfilePicture>
            <CommentTextBox>
              <CommentTextarea className="comment-post"onChange={(ev) => {setCommentText(ev.target.value)}}></CommentTextarea>
            </CommentTextBox>
            <CommentToolbar><Reference>Reference</Reference><SubmitComment onClick={handleLeaveComment} className="yes">Submit</SubmitComment></CommentToolbar>
          </CommentBox>
        </PostComment>
      </BoxA>
    </Wrapper>
  )

  
}

const CommentTextBox = styled.div`
 width: 75%;
    border: none;
    outline: none;
    padding: 10px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 20px;

    height: 175px;
    background-color: var(--color-darkpurple);
    color: white;`

const CommentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Reference = styled.button`
display:none;
background-color:#87CA35;`
const ProfilePicture = styled.img`
width: 50px;
left: 30px;
border-radius: 100px;
position: absolute;
top: -10px;
`
const PostComment = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  flex-direction: column;
  position: relative;
  background: linear-gradient(var(--color-darkpurple), var(--color-orange));
  border-radius: 14px;
  padding-top: 20px;
  `

  const CommentBox = styled.form`
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
   background: transparent;
   width: 65%;
   height: 65%;
   margin: auto;
   color: white;
   font-size: 16px;
   padding:10px;
  
    `
  const SubmitComment = styled.button`
    background: var(--color-deepteal);
    `



const NewComment = styled.div`
`
const Wrapper = styled.div`
background: var(--color-deepteal);
display: flex;
flex-direction: column;
margin-top: 40px;
width: 400px;
height: 350px;
color: var(--color-dark-grey);
position: absolute;
left: 75px;
top: 800px;


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