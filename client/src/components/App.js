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
import Songs from "./Songs"
import SongPage from "./SongPage";
import EditSongPage from "./EditSongPage";
import EditsPage from "./EditsPage";
import PeaceOfMusic from "./PeaceOfMusic";
import ArtistPage from "./ArtistPage"
import POM from "./POM";
import POM2 from "./POM2";

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
              <Route path="/artist/:id" element={<ArtistPage/>} />
              <Route path="submit" element={<SubmissionForm/>} />
              <Route path="profile/:id" element = {<ProfilePage/>} />
              <Route path="/error" element={<ErrorPage/>} />
              <Route path="/songs" element={<Songs/>} />
              <Route path="/songs/:id" element={<SongPage/>} />
              <Route path="/edits/song/:id" element={<EditSongPage/>} />
              <Route path="/edits" element={<EditsPage/>}/>
              <Route path ="/artists" element={<Artists/>} />
              <Route path ="/poms/:id" element={<POM/>}/>
              <Route path ="/pom2/:id" element={<POM2/>}/>
              <Route path="/pom/:songId" element={<PeaceOfMusic/>} />
            </Route>


          }
          

        </Routes>
      </Main>
    </BrowserRouter>
  );
}

const Main = styled.div``



export default App;