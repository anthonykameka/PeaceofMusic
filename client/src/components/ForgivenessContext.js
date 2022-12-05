import { createContext, useState, useEffect, useReducer} from "react";
export const ForgivenessContext = createContext();


// later to be used in the peace of music feature WIP

const reducer = (state, action) => {

    const 


}


export const ForgivenessProvider = ({ children }) => {

 
    return (
        <ForgivenessContext.Provider

        >

        {children}
        </ForgivenessContext.Provider>
    )
}