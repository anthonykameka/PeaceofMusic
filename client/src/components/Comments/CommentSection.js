import { faBorderNone } from '@fortawesome/free-solid-svg-icons';
import React from 'react'
import { useState, useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { CurrentUserContext } from '../CurrentUserContext';
import PomEditor from '../TextEditor/PomEditor';
import Comment from "./Comment"
import { MusicContext } from '../MusicContext';

const CommentSection = ({songId, params}) => {

  const {
    currentUser,
    refreshUsers,
  } = useContext(CurrentUserContext)

  const {
    refreshSongs,
    setRefreshSongs
  } = useContext(MusicContext)


  const [comments, setComments] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false)
  const [refreshComments, setRefreshComments] = useState(0) // used when the comments are needed to rerender, such as when comment is posted
  const [reference, setReference] = useState("var(--color-orange") // reference color for highlighting
  const [commentText, setCommentText] = useState(null) // state for comment text
  const commentRef = useRef(null)

// FEATURE NOT COMPLETED.. WIP //
// USER CAN HIGHLIGHT TEXT WITH COLOR OF THEIR CHOICE> THey WILL EVENTUALLY BE SAVED IN THIS STATE ASWELL AS COMMENTS NEXT TO THEIR REFERENCES.
// A + sign will be on the top right of each comment. 
// Once toggled, their references will be shown to the current user


// highlighting function.
  const handleReference = (ev) => {
    ev.preventDefault()
    let selection= window.getSelection().getRangeAt(0); 
      
      let selectedText = selection.extractContents();
      console.log(selectedText)
      let span= document.createElement("span");
      span.style.backgroundColor = reference;

      span.appendChild(selectedText);
      selection.insertNode(span);
    
  }

// color toggles.
    const handlePinkReference = (ev) => {
      ev.preventDefault();


      setReference("var(--color-darkpurple")

      
      //   // console.log(id)
      }

    const handleOrangeReference = (ev) => {
      ev.preventDefault();
      setReference("var(--color-orange")

    }

    const handleTealReference = (ev) => {
      ev.preventDefault();
      setReference("var(--color-deepteal")


    }

    // POST COMMENT TO SERVER

      const handleLeaveComment = (ev) => {
        ev.preventDefault();
        commentRef.current.value = ""
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

      


    

      // get comments 

      useEffect(() => {
        fetch(`/api/get-comments/${songId}`)
        .then(res => res.json())
        .then(res => {
          // console.log(res.data)
          setComments(res.data)
        })
  
  
      }, [params])
      

   
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
              <CommentTextarea ref={commentRef}className="comment-post"onChange={(ev) => {setCommentText(ev.target.value)}}></CommentTextarea>
            </CommentTextBox>
            <CommentToolbar>
              {
                !reference
                ?<></>
                :
                <Colors>
                  <Color style={{background: "var(--color-darkpurple)"}} onClick={handlePinkReference}></Color>
                  <Color style={{background: "var(--color-orange)"}} onClick={handleOrangeReference}></Color>
                  <Color style={{background: "var(--color-deepteal"}} onClick={handleTealReference}></Color>
                </Colors> 
              }
              <Reference onClick={handleReference}>Ref</Reference>
              <SubmitComment onClick={handleLeaveComment} className="yes">Submit</SubmitComment>
            </CommentToolbar>
          </CommentBox>
        </PostComment>
      </BoxA>
    </Wrapper>
  )

  
}

const Color = styled.div`
height: 25px;
width: 50px;
border: 1px solid white;
margin-left: 5px;
`

const Colors = styled.div`
display:flex;
width: 100px;
margin-right: 10px;
margin-top: 

`

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
width: 85px;
margin-top: 10px;
margin-right: 5px;
box-shadow: rgba(0, 0, 0, 0.12) 0 1px 1px;
transition: box-shadow .05s ease-in-out,opacity .05s ease-in-out;
border: 1px solid #2A8387;
    border-radius: 4px;
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