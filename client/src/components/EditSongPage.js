import React from 'react'
import { useContext } from 'react';
import { MusicContext } from './MusicContext';
import { CurrentUserContext } from './CurrentUserContext';
import { useNavigate, useParams } from 'react-router-dom';

const EditSongPage = () => {

    const navigate = useNavigate();

    const {
      currentUser,
    } = useContext(CurrentUserContext)
  
    const {
      refreshSongs,
      setRefreshSongs // to refresh song list after edit or deletion
    } = useContext(MusicContext)


    const _id = useParams()
    const editId = _id.id
    console.log(editId)

  return (
    <div>EditSongPage</div>
  )
}

export default EditSongPage