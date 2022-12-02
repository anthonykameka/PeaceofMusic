import React, { createContext, useState } from 'react';

const CommentContext = createContext(null);

export const CommentProvider = ({ children }) => {


    return (
        <CommentContext.Provider
            value={{

            }}
        >
            {children}
        </CommentContext.Provider>
    );
}
