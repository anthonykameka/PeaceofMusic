import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faAlignCenter,
    faAlignLeft,
    faAlignRight,
    faBold,
    faChevronDown,
    faChevronUp,
    faCode,
    faHighlighter,
    faItalic,
    faListOl,
    faListUl,
    faQuoteRight,
    faStrikethrough,
    faSubscript,
    faSuperscript,
    faTextWidth,
    faUnderline,
  } from "@fortawesome/free-solid-svg-icons";
import { RichUtils } from "draft-js";
import styled from "styled-components";

const ToolBar = ({ editorState, setEditorState}) => {
    const tools = [
            {
            label: "bold",
            style: "BOLD",
            icon: <FontAwesomeIcon className="toolbar-icon" icon={faBold} />,
            method: "inline",
            },
            {
            label: "italic",
            style: "ITALIC",
            icon: <FontAwesomeIcon className="toolbar-icon" icon={faItalic} />,
            method: "inline",
            },
            {
            label: "underline",
            style: "UNDERLINE",
            icon: <FontAwesomeIcon className="toolbar-icon" icon={faUnderline} />,
            method: "inline",
            },
            {
            label: "highlight",
            style: "HIGHLIGHT",
            icon: <FontAwesomeIcon className="toolbar-icon" icon={faHighlighter} />,
            method: "inline",
            },
            {
            label: "strike-through",
            style: "STRIKETHROUGH",
            icon: <FontAwesomeIcon className="toolbar-icon" icon={faStrikethrough} />,
            method: "inline",
            },
            {
            label: "Superscript",
            style: "SUPERSCRIPT",
            icon: <FontAwesomeIcon className="toolbar-icon" icon={faSuperscript} />,
            method: "inline",
            },
            {
            label: "Subscript",
            style: "SUBSCRIPT",
            icon: <FontAwesomeIcon className="toolbar-icon" icon={faSubscript} />,
            method: "inline",
            },
            {
            label: "Monospace",
            style: "CODE",
            icon: <FontAwesomeIcon className="toolbar-icon" icon={faTextWidth} transform="grow-3" />,
            method: "inline",
            },
            {
            label: "Blockquote",
            style: "blockQuote",
            icon: <FontAwesomeIcon className="toolbar-icon" icon={faQuoteRight} transform="grow-2" />,
            method: "block",
            },
            {
            label: "Unordered-List",
            style: "unordered-list-item",
            method: "block",
            icon: <FontAwesomeIcon className="toolbar-icon" icon={faListUl} transform="grow-6" />,
            },
            {
            label: "Ordered-List",
            style: "ordered-list-item",
            method: "block",
            icon: <FontAwesomeIcon className="toolbar-icon" icon={faListOl} transform="grow-6" />,
            },
            {
            label: "Code Block",
            style: "CODEBLOCK",
            icon: <FontAwesomeIcon className="toolbar-icon" icon={faCode} transform="grow-3" />,
            method: "inline",
            },
            {
            label: "Uppercase",
            style: "UPPERCASE",
            icon: <FontAwesomeIcon className="toolbar-icon" icon={faChevronUp} transform="grow-3" />,
            method: "inline",
            },
            {
            label: "lowercase",
            style: "LOWERCASE",
            icon: <FontAwesomeIcon className="toolbar-icon" icon={faChevronDown} transform="grow-3" />,
            method: "inline",
            },
            {
            label: "Left",
            style: "leftAlign",
            icon: <FontAwesomeIcon className="toolbar-icon" icon={faAlignLeft} transform="grow-2" />,
            method: "block",
            },
            {
            label: "Center",
            style: "centerAlign",
            icon: <FontAwesomeIcon className="toolbar-icon" icon={faAlignCenter} transform="grow-2" />,
            method: "block",
            },
            {
            label: "Right",
            style: "rightAlign",
            icon: <FontAwesomeIcon className="toolbar-icon" icon={faAlignRight} transform="grow-2" />,
            method: "block",
            },
            { label: "H1", style: "header-one", method: "block" },
            { label: "H2", style: "header-two", method: "block" },
            { label: "H3", style: "header-three", method: "block" },
            { label: "H4", style: "header-four", method: "block" },
            { label: "H5", style: "header-five", method: "block" },
            { label: "H6", style: "header-six", method: "block" },
        ];

        const applyStyle = (e, style, method) => {
            e.preventDefault();
            method === "block"
            ? setEditorState(RichUtils.toggleBlockType(editorState, style))
            : setEditorState(RichUtils.toggleInlineStyle(editorState, style))
        };

        const isActive = (style, method) => {
            if (method === "block") {
            const selection = editorState.getSelection();
            const blockType = editorState
                .getCurrentContent()
                .getBlockForKey(selection.getStartKey())
                .getType();
            return blockType === style;
            } else {
            const currentStyle = editorState.getCurrentInlineStyle();
            return currentStyle.has(style);
            }
        };

        return (
            <ToolBarGrid className="toolbar-grid">
              {tools.map((item, idx) => (
                <button
                  style={{
                    color: isActive(item.style, item.method)
                      ? "rgba(0, 0, 0, 1)"
                      : "rgba(0, 0, 0, 0.3)",
                  }}
                  key={`${item.label}-${idx}`}
                  title={item.label}
                  onClick={(e) => applyStyle(e, item.style, item.method)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {item.icon || item.label}
                </button>
              ))}
            </ToolBarGrid>
          );
        };

        const ToolBarGrid = styled.div`
        background-color: var(--color-deepteal);
        button {
          color: white;
        }
        `
        
        export default ToolBar;