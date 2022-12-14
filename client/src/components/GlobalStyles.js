import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    :root {
        --color-teal: #25A493 ;
        --font-one: "Source Sans Pro", sans-serif;
        --color-orange: #E27D60;
        --color-blue: #85DCB8;
        --color-beige: #E8A87C;
        --color-purple: #C38D9E;
        --color-deepteal: #41B3A3;
        --color-seagreen: #8bc7ba;
        --color-darkpurple: #B352B0;
        --color-black: #18191a;
        --color-darker-grey: #242526;
        --color-dark-grey: #222222;
        --color-grey: #b0b3b8;
        --color-light-grey: #e4e6eb;


        }


    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        box-sizing: border-box;
        font-size: 100%;
        vertical-align: baseline;
    }
  /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure,
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    body {
        line-height: 1;
    }
    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }

    h1 {
        font-size: 1.5em;
        font-family: 'Source Sans Pro', sans-serif; 
    }
    h2 {
        font-size: 1em;
        font-family: 'Source Sans Pro', sans-serif; 
    }

    p {
        font-family: 'Source Sans Pro', sans-serif;
    }

    button {
        font-family: 'Source Sans Pro', sans-serif;
        
        display: inline-block;
        outline: none;
        cursor: pointer;
        font-weight: 600;
        border-radius: 3px;
        padding: 12px 24px;
        border: 0;
        color: #000021;
        background: transparent;
        line-height: 1.15;
        font-size: 16px;
        :focus {
            
        }
        :hover {
            transition: all .1s ease;
            
        }
                
    }
    input {
        font-family: 'Source Sans Pro', sans-serif;
        border-radius: 2%;
        
    }

    textarea {
        font-family: 'Source Sans Pro', sans-serif;
    }

    body {
        color: white; ////////////// 
        background-color: var(--color-dark-grey); ///////
    }

     .yes{

    background-color: var(--color-deepteal);
    background-image: linear-gradient(#37ADB2, #329CA0);
    border: 1px solid #2A8387;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.12) 0 1px 1px;
    cursor: pointer;
    display: block;
    margin: 0;
    margin-top: 10px;
    outline: 0;
    padding: 11px 15px 12px;
    text-align: center;
    transition: box-shadow .05s ease-in-out,opacity .05s ease-in-out;
    touch-action: manipulation;


    &:hover {
        box-shadow: rgba(255, 255, 255, 0.3) 0 0 2px inset, rgba(0, 0, 0, 0.4) 0 1px 2px;
    text-decoration: none;
    transition-duration: .15s, .15s;
    }

    &:active {
        border: 1px solid white;
    }
        }


        .no{

        background-color: var(--color-orange);
        background-image: linear-gradient(--color-orange, --color-purple);
        border: 1px solid var(--color-dark-grey);
        border-radius: 4px;
        box-shadow: rgba(0, 0, 0, 0.12) 0 1px 1px;
        color: var(--color-dark-grey);
        cursor: pointer;
        display: block;
        margin: 0;
        outline: 0;
        padding: 11px 15px 12px;
        text-align: center;
        transition: box-shadow .05s ease-in-out,opacity .05s ease-in-out;
        touch-action: manipulation;

        margin-top: 10px;

        &:hover {
            box-shadow: rgba(255, 255, 255, 0.3) 0 0 2px inset, rgba(0, 0, 0, 0.4) 0 1px 2px;
        text-decoration: none;
        transition-duration: .15s, .15s;
        }

        &:active {
            border: 1px solid white;
        }
            }


    `