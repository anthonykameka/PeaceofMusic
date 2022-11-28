import {useContext, useState} from "react";
import Modal, {ModalProvider} from "styled-react-modal";
import FocusLock from "react-focus-lock"
import styled from "styled-components";
import GlobalStyles from "./GlobalStyles";
import { CurrentUserContext } from "./CurrentUserContext";




const EditProfile = () => {
    const tags = ["musician", "bass", "guitar", "piano", "drums", "songwriter", "producer", "poet", "fan", "educator", "transcriber", "saxophone", "clarinet", "violin", "cello"]
    const [isOpen, setIsOpen] = useState(false); // initialize modal 

    //function to toggle modal
    const toggleModal = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen)
    }

        // save info. and close modal
    const saveInfo = (e) =>  {
        e.preventDefault();
        setIsOpen(!isOpen)
    }

    const { currentUser} = useContext(CurrentUserContext)


  return (
    <>
        <Button onClick={toggleModal}>Edit Profile</Button>
        <Modal
            isOpen={isOpen}
            onEscapeKeydown={toggleModal}
            role="dialog"
            aria-modal={true}
            aria-labelledby="modal-label"
        >
            <FocusLock>
                <FormWrapper>
                    <Edit>EDIT PROFILE</Edit>
                    <LineWrap>
                        <Label>Username</Label>
                        <Value>{currentUser.username}</Value>
                    </LineWrap>
                    <LineWrap>
                        <Label>Display Name</Label>
                        <Value>
                        {
                            currentUser.displayname
                            ?currentUser.displayname
                            :"n/a"
                        }
                        </Value>
                    </LineWrap>
                    <ButtonWrapper>
                        <Close onClick={toggleModal}> Cancel</Close>
                        <Save onClick={toggleModal, saveInfo}>Save</Save>
                    </ButtonWrapper>
                </FormWrapper>
            </FocusLock>


        </Modal>
    </>
  )
}
const LineWrap = styled.div`
display: flex;
width: 50%;
justify-content: space-between

`
const Value = styled.p``
const Label = styled.label``

const ButtonWrapper = styled.div`
display:flex;
width: 100%;
justify-content: space-between;
`

const Close = styled.button``

const Save = styled.button``

const Edit = styled.h1`
`

const FormWrapper = styled.div`
background-color: var(--color-purple);
width: 20em;
height: 10em;
padding: 20px;
border-radius: 20px;
display:flex;
flex-direction: column;
align-items: center;

button{
    width: 25%
}

`


const Button = styled.button`
position: absolute;
right: 5px;
background-color: var(--color-orange)

`



export default EditProfile

