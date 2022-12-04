import { createContext, useState, useEffect } from "react";
export const PeaceContext = createContext();


const initialState = {
    status: "idle",
    key: null,
    roman: false,
    game: false,

};
//NOT IN USE AT THIS TIME//
const reducer = (state, action) =>
{

    switch (action.type) {
        case 'baseKey-selected': {
            return {
                ...state,
            }
        }
        case 'roman-numerals-selected': {
            return {
                ...initialState
            }
        }

        case 'newKey-selected':{
            return {
                ...state,
                status: "awaiting-response",
            }
        }

        case 'annotation-selected':{
            return {
                ...state,
                status: "error",
                error: "Please provide credit card information!"
            }
        }

        case 'game-mode':{
            return {
                ...initialState,
                status: "purchased",
            }
        }
        
        
        default:
            throw new Error(`Unrecognized action: ${action.type}`)
    }
}

export const PeaceProvider = ({ children }) => {

    const [music, setMusic] = useState(null);
    const [keys, setKeys] = useState(null);


    useEffect(() => {
        fetch (`/api/get-chords`)
        .then(res => res.json())
        .then(res => {
            setMusic(res.data[0])
            setKeys(res.data[0].keys)

        })
    },[])

   console.log(keys)



    return (
        <PeaceContext.Provider 
        value={{
            music,
            keys,
        }}
        >
            {children}
            

            </PeaceContext.Provider>
    )



}

