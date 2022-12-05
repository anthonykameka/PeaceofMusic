import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const EditsPage = () => {

    const navigate = useNavigate();

    const [edits, setEdits] = useState(null)

    useEffect(() => {
        fetch("/api/get-edits")
        .then(res => res.json())
        .then(res => {
            setEdits(res.data)
        })

    }, [])



    const handleEditClick = (id) => {
        navigate(`/edits/song/${id}`)
    }

  return (
    <Wrapper>
        { !edits? <></>
        :
        <EditList>
            {
                edits.map(edit => {
                    return(
                        <Edit onClick={() => handleEditClick(edit._id)}>{edit._id}</Edit>
                    )
                })
            }
        </EditList>
        }
        </Wrapper>
  )
}

const Wrapper = styled.div``

const EditList = styled.ul``

const Edit = styled.li``

export default EditsPage