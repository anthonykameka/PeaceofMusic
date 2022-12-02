import React from "react"
import { useEffect, useRef, useState } from "react"
import {
    Editor,
    EditorState,
    RichUtils,
    convertToRaw,
    convertFromRaw,
} from "draft-js";
import ToolBar from "./ToolBar";
import styled from "styled-components";

const PomEditor = () => {
    const [editorState, setEditorState] = useState(
        EditorState.createWithContent(
            convertFromRaw({
                blocks: [
                    {
                        key: "3eesq",
                        text: "",
                        type: "unstyled",
                        depth: 0,
                        inlineStyleRanges: [
                            {
                                offset: 19,
                                length: 6,
                                style: "BOLD",
                            },
                            {
                                offset: 25,
                                length: 5,
                                style: "ITALIC",
                            },
                            {
                                offset: 30,
                                length: 8,
                                style: "UNDERLINE",
                            },
                        ],
                        entityRanges: [],
                        data: {},
                    },

                ],
                entityMap: {},
            })

        )
    );
    const editor = useRef(null);

    useEffect(() => {
        focusEditor();
    }, []);

    const focusEditor = () => {
        editor.current.focus();
    };
    const handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return true;
        }
        return false;
    };
        return (
            <EditorWrapper onClick={focusEditor}>
            <ToolBar editorState={editorState} setEditorState={setEditorState} />
            <EditorContainer>
                <Editor
                ref={editor}
                placeholder="Explore your mind..."
                handleKeyCommand={handleKeyCommand}
                editorState={editorState}
                onChange={(editorState) => {
                    const contentState = editorState.getCurrentContent();
                    console.log(convertToRaw(contentState));
                    setEditorState(editorState);
                }}
                />
            </EditorContainer>
            <Save>Save</Save>
            </EditorWrapper>
        );
}


const Save = styled.button``
const EditorWrapper = styled.div`
`

const EditorContainer = styled.div``
export default PomEditor