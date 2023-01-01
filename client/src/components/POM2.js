import React, { useEffect, useState, useContext , useRef} from 'react'
import { CurrentUserContext } from './CurrentUserContext'
import { PeaceContext } from './PeaceContext'
import Modal from 'styled-react-modal'
import FocusLock from 'react-focus-lock'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import chordsheetjs, { HtmlTableFormatter } from 'chordsheetjs';
import ChordSheetJS from 'chordsheetjs';


const POM2 = () => {

    const [song, setSong] = useState(null) // this particular songs information 
    const [splitWords, setSplitWords] = useState(null) // split words used later
    const [splitLines, setSplitLines] = useState(null) // split lines
    const [pickingChord, setPickingChord] = useState(false) // when user is picking chord
    const [chosenRoot, setChosenRoot] = useState(null) // Root Chord chosen (Prefix of chord. ie : C, D , F# etc)
    const [chosenSuffix, setChosenSuffix] = useState(null) // suffix of chord chosen (sus, dim maj7 etc)
    const [selectedWordIndex, setSelectedWordIndex] = useState(null) // index of the word being selected 
    const [pomLyrics, setPomLyrics] = useState(null) //
    const [pomSheet, setPomSheet] = useState(null) //
    const songId = useParams().id; // params for the song 
    const [defaultLyrics, setDefaultLyrics] = useState(null) //]
    const [savedSheet, setSavedSheet] = useState(null)
    const [updatedSheet, setUpdatedSheet] = useState(false)
    const [selectedWord, setSelectedWord] = useState(null)



    

    const {
        currentUser
    } = useContext(CurrentUserContext) // current user info
    const {
        music, keys
    } = useContext(PeaceContext) // info from music theory fetch

 ///get song information
    useEffect(() => {
        fetch(`/api/get-song/${songId}`)
        .then(res => res.json())
        .then(res => {
            // console.log(res.data)
            setSong(res.data) 
            setPomLyrics(res.data.thisSong.lyrics)
            setDefaultLyrics(res.data.thisSong.lyrics.replace(/\[/g, '{c: ').replace(/]/g, '}'))
        })
    }, [])

    

// similar to lyrics reference function, the user will highlight section for musical education.




const testSong = ` {title: Let it be}
    {artist: The Beatles}
    {Chorus}
      
    Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
    [C]Whisper words of [G]wisdom, let it [F]be [C/E]   [Dm]   [C] `.substring(1);

    const formatter = new ChordSheetJS.HtmlTableFormatter();
    const proParser = new ChordSheetJS.ChordProParser();
    const cowParser = new ChordSheetJS.ChordsOverWordsParser();
    const ugParser = new ChordSheetJS.UltimateGuitarParser();
    const  [display, setDisplay] = useState(null)

    const pomFormatter = (lyrics) => {
        const pom1 = lyrics.replace(/\[/g, '{c: ').replace(/]/g, '}')
        const pom2 = proParser.parse(pom1)
        // console.log(pom2)
        const pom3 = formatter.format(pom2)
        console.log(pom1, pom2, pom3)
        return pom3
    }
    let displayedLyrics = null
    if (pomLyrics) {    
        displayedLyrics = pomFormatter(pomLyrics)
    }
    let POMSheet = null;

    // console.log(displayedLyrics)

//    console.log(defaultLyrics)

const testsong2 = `
{c: Verse 1}
Amazing[D] Grace, how s[G]weet the so[D]und,
that saved a wretch like [A7]me
I onc[D]e was lost, but n[G]ow am fo[D]und,
was blind, but [A7]now I s[D]ee.`

const [selected, setSelected] = useState(null);

const htmlFormatter = (lyrics) => {
    const pro = proParser.parse(lyrics)
    const pom = formatter.format(pro)
    return pom
}


 if (pomLyrics) {
    displayedLyrics = htmlFormatter(defaultLyrics)
 }
const words = [];
  let index = 0;
  let line = 0;
  console.log(defaultLyrics?.split("\n"))
  const testLines = testsong2?.split('\n').filter(line => line.length > 0).filter(line => !line.includes("{"))
  console.log(testLines)
  
  testLines?.forEach((lineText) => {
    line++;
    lineText.split(/\s+/g).forEach((word) => {
        
      let chord = '';
      let lyric = '';
      word.match(/{([^}]+)}|([^{}]+)/g).forEach((part) => {
        if (part.startsWith('{')) {
          chord = part.slice(1, -1);
        } else {
          lyric = part;
        }
      });
      words.push({
        index,
        line,
        chord,
        lyric,
      });
      index++;
    });
  });

console.log(words)

const groups = words.reduce((acc, word) => {
    if (!acc[word.line]) {
      acc[word.line] = [];
    }
    if (word.chord) {
        acc[word.line].push(`[${word.chord}]${word.lyric}`);
    } else {
    acc[word.line].push(word.lyric);
  }
    return acc;

  }, {});
  
//   const groupedLines = Object.values(groups);
//   console.log(groupedLines);
console.log(groups)
console.log(testsong2)

const chordsheet = proParser.parse(Object.values(groups).map((line) => line.join(' ')).join('\n'));
console.log(chordsheet)
const formatted2 = formatter.format(chordsheet)
// subarrays?.forEach((line) => {
//     console.log(line)
// })

const handleTestClick = (ev, word, index) => {
    ev.preventDefault();

}
// const html = formatter.format(words?.map((word) => {
//     if (word.chord) {
//         return `{${word.chord}}`;
//     }
//     return word.lyric;
// }))

// console.log(html)

const tdElements = document.querySelectorAll('td');

console.log(document.querySelectorAll('td.lyrics'))

let wordCounter = 0;
        tdElements.forEach((td) => {
            td.setAttribute('data-word', wordCounter.toString());
            wordCounter++
        });

    const lines = document.getElementsByClassName("row")
    
    // if (!updatedSheet) {

    //     setTimeout(() => {
    //         for (let i = 0; i < lines.length; i++) {
            
    //             const line = lines[i]
    //             // line.id =  "l-" + i;
           
    //             // line.innerHTML = `<p id=l-${i}> ${line.textContent}</p>`
                
    //             let words = line.textContent.split(" ").filter(word => word.length > 0)
    //             line.textContent = ""
                 
    //             words.forEach((word, index) => {
    //                 const wordLink = document.createElement("span")
    //                 wordLink.id = `w-${index} l-${i}`
    //                 wordLink.className= "word"
    //                 wordLink.textContent = `${word} `
    //                 wordLink.addEventListener("click", handleWord);
    //                 line.append(wordLink)
    //             })
    
    //         }
    //             // })}
    //     }, 200)
    

    // }
    
const handleWord = (ev) => {
    console.log('Word clicked:', ev.target.textContent);
    toggleModal(ev.target.textContent)
    ev.preventDefault()
    let rawIndexes = null
    // console.log(ev.target.id)
    let indexes = (ev.target.id.split(" "))
     console.log(indexes)
    let lineIndex = indexes[1].slice(2)
    // console.log(lineIndex)
    let wordIndex = indexes[0].slice(2)
    // console.log(document.getElementById(ev.target.id))
    // console.log(wordIndex)
    setSelectedWordIndex([lineIndex, wordIndex])
    // console.log(selectedWordIndex)
    // console.log(pomLyrics)
    
        
}


 



// split the keys array [array of 12 keys] // split to aid with the styling
const keysA = keys?.slice(0, 6) 
const keysB = keys?.slice(6,12)


// initialize a list of suffixes.
let suffixes = music?.suffixes


// word click.
//see the return of the component. // each word is given a line number and a word number within that that line. A matrix to save and recall //
// although the saving is not functional as of yet, it will aid in storing and analysing the harmonic data. The first word of a line uses the ONE chord. 67% of the time.

const handleWordClick = (ev) => {
    ev.preventDefault();
    setIsOpen(true)
    let rawIndexes = null
    console.log("hi")
    console.log(ev.target.id)
    let indexes = (ev.target.id.split(" "))
     console.log(indexes)
    let lineIndex = indexes[1].slice(2)
    // console.log(lineIndex)
    let wordIndex = indexes[0].slice(2)
    // console.log(document.getElementById(ev.target.id))
    // console.log(wordIndex)
    setSelectedWordIndex([lineIndex, wordIndex])

}





const [isOpen, setIsOpen] = useState(false); // initialize modal state


   //function to toggle modal
  const toggleModal = (word) => {
    setSelectedWordIndex(word)
    setIsOpen(!isOpen)
    
}
// once modal is open, record chord click
const handleChordClick = (ev) => {
    ev.preventDefault()
    setPickingChord(true)
    setChosenRoot(ev.target.innerText)
    
}
// suffix click
const handleSuffixClick = (ev) => {
    ev.preventDefault()
    setChosenSuffix(ev.target.innerText)
}
// function to replace string at certain index
const replaceAt = (source, index, replacement) => {
    return source.substring(0, index) + replacement + source.substring(index + replacement.length) + " ";
}

// handle OK click


const [refreshPom, setRefreshPom] = useState(true)
// console.log(savedSheet)

console.log(savedSheet)
console.log(savedSheet?.split(/\r?\n/))

const handleOK =(ev) => {
    ev.preventDefault()
    setPickingChord(false) // user is done picking chord
    

    const chosenChord = (chosenRoot+chosenSuffix) // attach prefix and suffix together.
    const thisWord = selectedWordIndex[1] // get Word, within line
    const thisLine = selectedWordIndex[0] // get Line, within lyrics
    console.log(chosenChord)
    console.log("test")
  
    let currentSheet = defaultLyrics // while adding first chord, use the default lyrics that come from database.

    // if there is a saved sheet( aka user has added a chord)
    if (savedSheet) {
        currentSheet = savedSheet
    }

    console.log(currentSheet)
    let testLines = currentSheet.split(/\r?\n/)  // split lines
    let testLine = testLines[thisLine] // get selected line
    console.log(testLine)



     console.log(thisWord, thisLine)
    console.log(document.getElementById(`w-${thisWord} l-${thisLine}` ))
    // console.log(currentSheet)
    let currentSheetLines = currentSheet.split(/\r?\n/) // split lines of sheet
    console.log(currentSheetLines)
    let currentSheetLinesWithoutSpaces = currentSheetLines.filter(line => line.length>0) // remove any empty elements that seem to be created when splitting
    // console.log(currentSheetLinesWithoutSpaces)
    

     let currentSheetLinesWithoutComments = currentSheetLinesWithoutSpaces.filter(line => !line.includes("{")) // remove comments from lines to get accurate index
    //  console.log(currentSheetLines)
    // console.log(currentSheetLinesWithoutComments)

    
     
    let selectedLine = currentSheetLinesWithoutSpaces[thisLine] // get line
    console.log(selectedLine)
    // console.log(currentSheetLines)
     const indexOfWord = (currentSheetLines.findIndex(line => line === selectedLine)) // using index, find word in question that we are adding chord
    let selectedLineWords = selectedLine.split(" ") //split by words
    // console.log(selectedLineWords)
    let selectedWord = selectedLineWords[thisWord] // find word clicked using index
    // console.log(selectedWord)
    let newWord = `[${chosenChord}]${selectedWord}` // add chord to the word to meet the template
    // console.log(newWord)
     selectedLineWords[thisWord] = newWord // replace the word in the array with chord
    console.log(selectedLineWords)
    let newLine = selectedLineWords.join(" ") // take array and join to create line
     console.log(newLine)
     currentSheetLinesWithoutSpaces[indexOfWord] = newLine // replace arrayofLines with new line
    console.log(currentSheetLinesWithoutSpaces)
    
    let newSheet = currentSheetLinesWithoutSpaces.join("\n") // join array of lines and seperate with new line \n 
     console.log(newSheet)
     setSavedSheet(newSheet) // save new sheet
    // // // console.log(savedSheet)
    let newParsedSheet = proParser.parse(newSheet)
     let testdisplayedLyrics = formatter.format(newParsedSheet)
    console.log(testdisplayedLyrics)
    setPomSheet(testdisplayedLyrics)
    setUpdatedSheet(true)
    
    setTimeout(() => {

    const lyricLines = document.querySelectorAll(".row")
        lyricLines.forEach((lyric, index) => {
            console.log(lyric.innerHTML)
            const subLyrics = lyric.querySelectorAll(".lyrics")
            const line = index;
            if (subLyrics.length > 1) {
                const words = []
                
                subLyrics.forEach((lyric, index) => {
                    lyric.className = `l-${line} s-${index}`
                    const splitIndex = index;
                    console.log(lyric.innerText)
                    words.push(lyric.innerText.split(" "))
                    const wordsArray = words.flat()
                    wordsArray.forEach((word, thisIndex) => {
                
                        const wordIndex = thisIndex;
                        console.log(wordIndex)
                        console.log(splitIndex)
                        
                        const wordLink = document.createElement("span")
                        wordLink.id = `w-${thisIndex} l-${line} s-${splitIndex}`
                        console.log(`.l-${line} s-${splitIndex}`)
                        console.log(document.getElementsByClassName(`.l-${line} s-${splitIndex}`))
                        wordLink.className = "word"
                        wordLink.textContent = `${word}`
                        wordLink.addEventListener("click", handleWord);
                        console.log(wordLink)
                        
                    
                })
                

                })

                }

                
                
            })
            
        
        // for (let i = 0; i < lyricLines.length; i++) {
        
        //     const line = lines[i]
        //     console.log(line)
        //     const commentLines = line.querySelector(".comment")
        //     if (commentLines == null) {
        //         let lyrics = line.querySelectorAll(".word")
        //          console.log(lyrics)
        //         lyrics.forEach((lyric, index) =>  {
        //             console.log(line)
        //             console.log(lyric.textContent)
        //             let words = lyric.textContent.split(" ").filter(word => word.length > 0)
        //             lyric.textContent= ""
        //             console.log(words)
        //             words.forEach((word, index) => {
        //                 const wordLink = document.createElement("span")
        //                 wordLink.id = `w-${index} l-${i}`
        //                 wordLink.className= "word"
        //                 wordLink.textContent = `${word} `
        //                 console.log(wordLink)
        //                 wordLink.addEventListener("click", handleWordClick);
        //                 line.append(wordLink)
        //             })
        //         })
        //     }
        // }

    }, 200)

    setIsOpen(false)
    setSelectedWordIndex(null) // reset everything
    setChosenRoot("")
    setChosenSuffix("")
    setRefreshPom(!refreshPom) //
    
}

useEffect(() => {
    setSavedSheet(savedSheet)

}, [refreshPom])
// HANDLE NO CHORD
const handleNC = (ev) => {
    ev.preventDefault()
    setPickingChord(false) //toggle off
    
    const thisWord = selectedWordIndex[1] // get the index of word and line, similar to the OK function

    const thisLine = selectedWordIndex[0]
    const element = document.getElementById(`${thisWord}-${thisLine}-c`) // -c is the chord display, which are empty spaces above each word.
    const element2 = document.getElementById(`${thisWord}-${thisLine}`)
    const wordLength = element2.innerText.length // word length
    const chosenChord = ("-".repeat(wordLength))
    element.innerText = `${chosenChord}`
    setSelectedWordIndex(null)
    setChosenRoot("")
    setChosenSuffix("")
    
    toggleModal()

}


    const emptySpaceClick = (ev) => {
        ev.preventDefault();
    }



  return (
     <>
    <Wrapper>
        <SongInfoBox>
        <SongInfoSubBox>
          <AlbumCover src={song?.thisSong.albumArt}/>
          <Title>{song?.songTitle}</Title>
          <Title><span>{song?.artistName}</span></Title>

        </SongInfoSubBox>
       
      </SongInfoBox>
      
    </Wrapper>
    <Modal
                isOpen={isOpen}
                onEscapeKeydown={toggleModal}
                role="dialog"
                aria-modal={true}
                aria-labelledby="modal-label"
                transparent={true}
                >
                      <FocusLock>
                        <ModalContainer>
                            <ModalHeader>
                                <ModalTitle>Chords</ModalTitle>
                            </ModalHeader>
                            <ModalBody>
                                <ChordBase>
                                   <h2> SELECT CHORD </h2>
                                </ChordBase>
                                <Chords>
                                <ChordsA>
                                    {
                                        keysA.map(key => {

                                            return (
                                                <Chord onClick={handleChordClick}>{key}</Chord>
                                                )
                                        })
                                    }
                                 </ChordsA>
                                 <ChordsB>
                                    {
                                        keysB.map(key => {

                                            return (
                                                <Chord onClick={handleChordClick}>{key}</Chord>
                                                )
                                        })
                                    }
                                 </ChordsB>
                                 </Chords>
                                 <Suffixes>
                                    {
                                        suffixes.map(suffix => {
                                            if (suffix === "major"){
                                                suffix = "maj"
                                            }
                                            if (suffix === "minor") {
                                                suffix = "min"


                                            }
                                            return (
                                                <Suffix onClick = {handleSuffixClick}>{suffix}</Suffix>
                                                )
                                        })
                                    }
                                 </Suffixes>
                                 <ModalFooter>
                                    <ChordSelected>
                                        {chosenRoot}
                                        {chosenSuffix}
                                    </ChordSelected>
                            
                                    <NoChord onClick={handleNC}>N.C. </NoChord>
                                    <OK onClick={handleOK}>OK</OK>
                                    
                                </ModalFooter>
                            </ModalBody>

                        </ModalContainer>
                      </FocusLock>
                </Modal>
        
    <Lyrics2Wrapper>
    {
        !song? <></>
        : 

        <Lyrics2 dangerouslySetInnerHTML={{__html: formatted2}}/>
      
    }
    
       
    {/* //    : pomSheet
    //    ? <Lyrics2 dangerouslySetInnerHTML={{__html: pomSheet}}/>
    //    : <Lyrics2 dangerouslySetInnerHTML={{__html: displayedLyrics}}/>
        
        
    // : <></> */}



    
   
    </Lyrics2Wrapper>
    
   </>
   
  )
}

const Lyrics2Wrapper = styled.div`
display: flex;
justify-content: center;
align-items: center;

span {
    color: white;
    &:hover {
        color: var(--color-orange);
        cursor: pointer;
    }
}
`


const AChord = styled.span`
color: var(--color-darkpurple);
&:hover {
color: var(--color-orange)
}`

const Title = styled.h1`
font-size: 17px;
margin-top: 10px;
color: white;
span {
  font-style: italic;
}
`

const AlbumCover = styled.img`
width: 200px;
margin-top: 0%;
border: 1px solid black;
`

const SongInfoSubBox = styled.div`
background-color: var(--color-darkpurple);
width: 250px;
height: 310px;
display:flex;
flex-direction: column;
align-items: center;
border-radius: 30px;
justify-content: center;
position: absolute;
top: 100px;
left: 100px;
padding-bottom: 30px;
p, h1{
  color: white
}
`

const SongInfoBox = styled.div`
display:flex;
flex-direction: column;
align-items: center;
margin-top: 100px;
width: 200px;


`

const Info = styled.p`
`

const TitleBox = styled.div`
display:flex;
flex-direction: column;
`


const Word = styled.span`
color: white;
&:hover {
color: var(--color-orange);
cursor: pointer;
}`

const Lyrics = styled.p`
white-space: pre-wrap;
margin-left: 300px;
margin-top: 100px;
line-height: 50px;
columns: 3;

`

const Lyrics2 = styled.div`
width: 400px;

font-family: "Source Sans Pro", sans-serif;
 .comment {
    font-weight: bold;
 }

`

const LyricsWrapper = styled.div`
height: 100vh;
align-items: center;
justify-content: center;

margin-top: -100px;

`

const Wrapper = styled.div`
display:flex;
flex-direction: column;
align-items: center;
justify-content: center;
position: relative;
left: 00px;
`

const NoChord = styled.button`
  background: var(--color-orange);
  display:flex;
justify-content: center;
font-size: 20px;
height: 50px;
width: 100px;
align-items: center;
margin-left: 70px !important;`


const OK = styled.button`
display:flex;
justify-content: center;
font-size: 20px;
height: 50px;
width: 100px;
align-items: center;
margin-left: 70px !important;
background: linear-gradient(var(--color-deepteal), var(--color-darkpurple));
`

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  height: 100px;
  justify-content: center;
  `

const ChordSelected = styled.div`
display:flex;
justify-content: center;
align-items: center;
border: 1px solid var(--color-orange);
bottom: 30px;
right: 500px;
height: 70px;
width: 400px;
background-color: var(--color-deepteal);
font-size: 40px;
`

const Suffix = styled.p`
margin-left: 10px;
  font-size: 20px;
  font-weight: 600;
  width: 20%;

    &:hover {
        color: var(--color-orange);
        cursor: pointer;
    }


`
const Suffixes = styled.div`
display: grid;
width: 70%;
height: auto;
padding-bottom: 10px;
flex-direction: row;
justify-content: center;


align-items: center;
margin-top: 50px;
border-bottom: 1px solid var(--color-orange); 
grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 1em;
  grid-row-gap: 1px;



`
const ChordsB = styled.div`
  display: flex;
  flex-direction: row;`
const ChordsA = styled.div`
  display: flex;
  flex-direction: row;`
const Chord = styled.button`


  margin-left: 10px;
  font-size: 28px;
  font-weight: 600;
  width: 20%;
  color: white;

    &:hover {
        color: var(--color-orange);
        cursor: pointer;
    }
    &:focus {
        color: var(--color-orange);
        font-size: 40px;
    }
`

const Chords = styled.ul`

display: flex;
width: auto;
padding-bottom: 10px;
flex-direction: column;
justify-content: center;
align-items: center;
margin-top: 50px;

border-bottom: 1px solid var(--color-orange);
/* margin: 0 auto;
list-style-type: none;
border: 1px solid red;
height: 20%; */


`
const ChordBase = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  font-size: 25px;
  width: 75%;

  h2 {
    border-bottom: 1px solid var(--color-orange);
    text-align: center;
    padding-bottom: 10px;
    
    width: 50%;
  }
`

const ModalBody = styled.div`
  display: flex;
  align-items: center;
  height:100%;
  width: 100%;
  flex-direction: column;
  position: relative;

  .active {
    color: var(--color-orange);
  }

`

const ModalContainer = styled.div`
width: 800px;
height: 800px;
position: relative;
border: 1px solid var(--color-orange);
background-color: var(--color-dark-grey);
`

const ModalTitle = styled.h1`
text-align: center;

`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid orange;
  background-color: var(--color-darkpurple);
  justify-content: space-between;`


export default POM2