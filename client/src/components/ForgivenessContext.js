import { createContext, useState, useEffect, useReducer} from "react";
export const ForgivenessContext = createContext();




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