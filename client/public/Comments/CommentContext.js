import React from "react";
import { createContext, useState } from "react";

const CommentContext = createContext(null);

export const CommentProvider = ({ children }) => {
    const [count, setCount] = useState(0);
  
  


    const [replying, setReplying] = useState(false);
  const [time, setTime] = useState("");
  const [vote, setVoted] = useState(false);
  const [score, setScore] = useState(commentData.score);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(commentData.content);
  const [deleting, setDeleting] = useState(false);

    return (
        <CommentContext.Provider
            value={{
                commentPostedTime,
            }}
        >
            {children}
        </CommentContext.Provider>
    );
}

