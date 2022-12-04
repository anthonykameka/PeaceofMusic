    import styled from "styled-components"
    import logo from "../assets/logosmall2.png"
    import background from "../assets/POMbackground.png"
    import { GlobalStyles } from "./GlobalStyles"
    import LoginButton from "./LoginButton"
    import LogoutButton from "./LogoutButton"
    const LandingPage = () => {



        return (
        <Wrapper >
                            <LogBox>
                                <Login></Login>
                    <LoginButton/>

                </LogBox>
            <Background style={{backgroundImage: `url(${background})`, backgroundSize:"contain"}}>
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
    margin-left: auto;
    bottom: 700px;
    right: 1000px;
    width: 200px;
    justify-content: space-between;
    display: flex;
    align-items: center;
    position: absolute;
    `

    const Login = styled.p`
    font-size: 50px;
    font-weight: bold;
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
    display: none;
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
    height: 98vh;
    width: 95vw;
    

    `
    
    export default LandingPage;