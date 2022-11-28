import React from 'react'
import PomEditor from "./TextEditor/PomEditor"
import styled from "styled-components"
import GlobalStyles from './GlobalStyles'

const Journal = () => {
  return (
    <Wrapper>
        <PomWrapper>
            <PomEditor/>
        </PomWrapper>
    </Wrapper>
  )
}

const PomWrapper = styled.div`
width: 500px;
border-right: 1px solid black;
height: 1000px;
background-color:var(--color-beige) ;
`

const Wrapper = styled.div`
width: 94vw;
margin-left: auto;
background-color: var(--color-deepteal) ;
`

export default Journal