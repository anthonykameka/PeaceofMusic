import React from 'react'
import styled from 'styled-components'
import { MusicContext } from './MusicContext'
import { useContext } from 'react'
const SubHeader = ({profileData}) => {

  const {
    featured, 
    setFeatured,
  } = useContext(MusicContext)

  const handleFeaturedClick = (ev) => {
    ev.preventDefault()
    setFeatured(true)
  }

  const handleFavoritesClick = (ev) => {
    ev.preventDefault()
    setFeatured(false)
  }


  return (
    <Wrapper>
      <Featured onClick={handleFeaturedClick} autoFocus >Featured</Featured>
      <Favorites onClick={handleFavoritesClick}>Favorites</Favorites>

    {/* <Contributions>Contributions</Contributions>
    <Annotations>Annotations</Annotations>
    <Comments>Comments</Comments> */}
    </Wrapper>
  )
}
const Featured = styled.button`
  &:focus {
    color: var(--color-orange)
  }
`
const Favorites = styled.button`
    &:focus {
    color: var(--color-orange)
  }
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