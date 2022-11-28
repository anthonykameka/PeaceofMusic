    import styled from "styled-components"
    import logo from "../assets/logosmall2.png"
    import background from "../assets/big-crowd.png"
    import { GlobalStyles } from "./GlobalStyles"
    import LoginButton from "./LoginButton"
    import LogoutButton from "./LogoutButton"
    const LandingPage = () => {



        return (
        <Wrapper >
            <Background style={{backgroundImage: `url(${background})`}}>
            <WelcomeBox>
                <Logo src={logo}/>
                <Name>PEACE OF MUSIC</Name>
                <LogBox>
                    <LoginButton/>
                    <LogoutButton/>
                </LogBox>
            </WelcomeBox>
            </Background>
        </Wrapper>
        
        );
    }

    const LogBox = styled.div`
    position: absolute;
    bottom: 10px;
    right: 20px;
    width: 95%;
    justify-content: space-between;
    display: flex;
    `

    const Name = styled.h1`
    font-size: 20px;
    color: white;
    `

    const Logo = styled.img`
    margin: 0px;

    `
    
    const Background = styled.div`
    width: 100vw;
    height: 100vh;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    `

    const WelcomeBox = styled.div`
    display: flex;
    justify-content: flex-start;
    border: 1px solid black;
    z-index: 222;
    height: 500px;
    width: 650px;
    flex-direction: column;
    border-radius: 25px;
    background-color: var(--color-teal);
    font-family: var(--font-one);
    align-items: center;
    position: relative;
    
    `
    const Wrapper = styled.div`
    height: 100vh;
    width: 100vw;
    

    `
    
    export default LandingPage;