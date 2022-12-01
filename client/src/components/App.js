import {BrowserRouter, Routes, Route} from "react-router-dom"
import LandingPage from "./LandingPage";
import HomePage from "./HomePage";
import styled from "styled-components"
import GlobalStyles from "./GlobalStyles";
import Artists from "./Artists";
import SubmissionForm from "./SubmissionForm";
import ErrorPage from "./ErrorPage";
import ProfilePage from "./HomePage";
import Layout from "./Layout";
import { CurrentUserContext } from "./CurrentUserContext";
import { useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Journal from "./Journal";
import Transcribe from "./Transcribe";
import Songs from "./Songs"
import SongPage from "./SongPage";
import EditSongPage from "./EditSongPage";
import EditsPage from "./EditsPage";
import PeaceOfMusic from "./PeaceOfMusic";

const App = () => {

  const { user, isAuthenticated, isLoading } = useAuth0();
  const { currentUser } = useContext(CurrentUserContext)

  
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Main>
        <Routes>
          {
            !user
            ?<Route path="*" element={<LandingPage/>} />
            :
            <Route element={<Layout />}>
              <Route path="/home" element={<HomePage/>} />
              <Route path="/" element={<HomePage/>} />
              <Route path="/artists" element={<Artists/>} />
              <Route path="submit" element={<SubmissionForm/>} />
              <Route path="profile" element = {<ProfilePage/>} />
              <Route path="/error" element={<ErrorPage/>} />
              <Route path="/journal/:id" element={<Journal/>} />
              <Route path="/songs" element={<Songs/>} />
              <Route path="/songs/:id" element={<SongPage/>} />
              <Route path="/edits/song/:id" element={<EditSongPage/>} />
              <Route path="/edits" element={<EditsPage/>}/>
              <Route path ="/artists" element={<Artists/>} />
              <Route path ="/poms/:id" element={<PeaceOfMusic/>}/>
              <Route path="/transcribe/:id" element={<Transcribe/>} />
              <Route path="/pom" element={<PeaceOfMusic/>} />
            </Route>


          }
          

        </Routes>
      </Main>
    </BrowserRouter>
  );
}

const Main = styled.div``

export default App;