import React from 'react'
import styled from 'styled-components'
const SubHeader = ({profileData}) => {


  return (
    <Wrapper>
      <Favorites>Favorites</Favorites>

    {/* <Contributions>Contributions</Contributions>
    <Annotations>Annotations</Annotations>
    <Comments>Comments</Comments> */}
    </Wrapper>
  )
}

const Favorites = styled.button`
`
const Annotations = styled.button``
const Comments = styled.button``

const Contributions = styled.button`
`

const Mentions = styled.button``

const Wrapper = styled.div`
width: 100%;
height: 100px;
position: relative;
display: flex;
justify-content: space-evenly;
align-items: flex-end;
border-bottom: 1px solid var(--color-darkpurple);
margin-bottom: 5px;

button {
  height: 50px;
  width: 20%;
  border: none;

  font-weight: bold;
  font-size: 17px;

  color: white;
  margin-bottom: 20px;
  
  &:focus {
    border-bottom: 2px solid var(--color-deepteal) !important;
}

`

export default SubHeader