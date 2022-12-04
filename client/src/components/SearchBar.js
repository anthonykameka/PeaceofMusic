import React from 'react'
import { MusicContext } from './MusicContext'
import { useContext, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { BsSearch } from "react-icons/bs";
import { CurrentUserContext } from './CurrentUserContext';
import { useNavigate } from 'react-router-dom';
const SearchBar = () => {

    const navigate = useNavigate();
    const [selectedResultsIndex, setSelectedResultsIndex] = useState(0)  // This state is to be used later for the selection of the search bar results with the keyboard
    const [searchInput, setSearchInput] = useState("") //search input
    const [users, setUsers] = useState(null)
    const [result, setResult] = useState([])
    const [searching, setSearching] = useState(false)
    const searchBarRef = useRef(null)

    const {
        songs,
        artists,
        searchBarModalToggler,
        setSearchBarModalToggler,
    } = useContext(MusicContext)

    useEffect(() => {
      fetch(`/api/get-users`) 
      .then(res => res.json())
      .then(res =>  {
        setUsers(res.data)
         })

    }, [])
    



    const {allUsers} = useState(CurrentUserContext)

    // console.log(songs, allUsers, artists)



    //HANDLECHANGE FUNCTION TO UPDATE SEARCH INPUT WHILE USER TYPES INTO SEARCHBAR

  if (selectedResultsIndex > 20) {
    setSelectedResultsIndex(20);
  }

  if (selectedResultsIndex < 0) {
    setSelectedResultsIndex(0)
  }

  

  // ACTIVE WILL TOGGLE ON IF THERE IS ANY INPUT IN SEARCHBAR
  let active = false
  if (searchInput.length > 2) {
      active = true
  }
  else {
      active = false
  }
  // initialize itemNames array
  let searchItems = []
  artists && artists.forEach(artist => {
    searchItems.push(artist)
  })

  songs && songs.forEach((song => {
        searchItems.push(song.thisSong.title)
        
  }))



     // initialize Matches for search bar
     let results = []

     // logic to get results, using name array and matching to search input
    if (songs && active) {
        results = searchItems.filter(itemName => itemName.toLowerCase().includes(searchInput.toLowerCase()))
    }

    // console.log(results)
    // // if user uses multiple words in search, it splits into array of searchinputs
    const searchInputs = searchInput.split(" ")

    // // Map through search inputs and and find results. this will give us arrays of results for each search input
    const multipleResults = searchInputs.map((searchInput, index) => {
        return searchItems.filter(itemName => itemName.toLowerCase().includes(searchInput.toLowerCase()))
    })
    // // below is logic that take multiple arrays of the results and combine into 1 array. 
    const combinedResults = multipleResults.shift().filter(x => {
        return multipleResults.every(y =>  {
            return y.indexOf(x) !== -1
        })
    })
    // // limit the search results to 20. the remaining results will be triggered by a "see all" button
    const firstResults = combinedResults.slice(0, 10)


    // Before, after, and match are logic for bolding appropriate word.
    // at this time , this is only functional with THE FIRST SEARCH QUERY WORD.
    // others will not be bolded, seems like its not possible without DangerouslysetinnerHTML.
    const before = (itemName, query) => {
        let index = itemName.toLowerCase().indexOf(query.toLowerCase())
        //console.log(index)
       // console.log(itemName)
        let part = itemName.slice(0, index)
        return part
    }
    const after = (itemName, query) => {
        let index = itemName.toLowerCase().indexOf(query.toLowerCase())
        let x = itemName.slice(index)
        let part = x.slice(query.length)
        return part
    }
    const match = (itemName, query) => {
        let index = itemName.toLowerCase().indexOf(query.toLowerCase())
        let x = itemName.slice(index)
        let part = x.slice(0, query.length)
        return part
    }

    // // handler for clicking an item on results to be navigated to its details site.
    // // reset values 
    const handleSelect = (result) => {
        console.log(result)
        if (result.includes("by")) {
            const song = songs?.filter(song => song.thisSong.title === result)[0]

            navigate(`/songs/${song._id}`)
        }
        searchBarRef.current.value = "" // clear searchbar
        setSearchInput("") //clear state for search input
    }

    const handleAddSong = (ev)=> {
        ev.preventDefault();
        setSearchBarModalToggler(!searchBarModalToggler)
        searchBarRef.current.value = "" // clear searchbar
        setSearchInput("") //clear state for search input
        
    }





  return (
    <Wrapper>
        <SearchBarWrapper>
            <BsSearch style={{marginRight: "20px"}}/>
            <Search>
                <Input
                    onChange={(e)=> setSearchInput(e.target.value)}
                    ref={searchBarRef}
                    placeholder="Search..."
                    type="text"
                    onKeyDown={(ev) => { //keyboard functionality
                        switch (ev.key)  {
                        case "Enter": {
                            setSearching(true)

                            setSearchInput("")
                                handleSelect() // handler that will use current ID
                            return;
                        }
                        case "ArrowUp": {
                            setSelectedResultsIndex(selectedResultsIndex - 1)
                            return;
                        }
                        case "ArrowDown": {
                            setSelectedResultsIndex(selectedResultsIndex + 1)
                            return;
                        }
                        case "Escape": {
                            // searchBarRef.current.value = "" // clear searchbar
                            setSearchInput("")
                        }
                    }}}
                    >

                    </Input>
            </Search>
        </SearchBarWrapper>
        {
            !active
            ? <></>
            :
        
        <Results>
            {
                // logic to select different items in results. with mouse and keyboard
                // this map works through each RESULT
                firstResults.map((result, i) => {
                    
                    const index = searchItems.indexOf(result) // as we are working with the names array, we use the index of the result to the names array
                    // const id = items[index]._id // once index found, use it to find id of the item  
                    // // when result is selected it will return true if the results index(i) 
                    const isSelected =  () => {
                        if (selectedResultsIndex === i) {
                            return true
                        }
                        else {
                            return false
                        }
                    }
                    // ENTER key functionality. using the REF variable from the parent.
                    // { 
                    //     let currentName = itemNames.indexOf(combinedResults[selectedResultsIndex]) // using current index of keyboard, get name of product
                    //     let enterId = ids[currentName] //get ID using CONTEXT IDS array
                    //     thisId.current = enterId // change REF AS YOU USE KEYBOARD
                    // }

                    return (
                        <>
                        <Result
                            onClick={() => handleSelect(result)}
                            onMouseEnter={() => setSelectedResultsIndex(i)}
                            style={{
                                background: isSelected() ? 'var(--border-color)' : 'transparent',
                            }}
                            >
                                <Before>{before(result, searchInputs[0])}</Before>
                                <Match>{match(result, searchInputs[0])}</Match>
                                <After>{after(result, searchInputs[0])}</After>
                        </Result>
                        
                        </>
                    )
                    
                }
                )
            }
            <Result onClick={handleAddSong} id="cantfind">Cant find? Add Song!</Result>
        </Results>
        }
    </Wrapper>
  )
}
const SearchBarWrapper = styled.div`

width: 300px;
height: 50px;
align-items: center;
justify-content: left;
display: flex;
border-radius: 13px;
padding-left: 10px;


display:flex;

border: 1px solid var(--color-darkpurple);
`
const Match = styled.span`
    font-weight: bold;
`
const Before = styled.span`
`
const After = styled.span`
`

const Result = styled.li`
    height: 34px;
    font-size: 22px;;
    width: 100%;
    color: white;
    border: 1px solid var(--border-color);
    padding: 0px 8px;
    &:hover {
        color: var(--color-dark-grey);
        cursor: default;
    }

 
`
const Results = styled.ul`
border: 1px solid white;
z-index: 444;
#cantfind {
        background: linear-gradient(var(--color-deepteal), var(--color-darkpurple));
        color: black;
        border-top: 1px solid white;
    }
background: var(--color-darkpurple);`

const Search = styled.div`
`

const Input = styled.input`

    border: none;
    color: white;
    font-size: 20px;
    outline: none;
    margin-left: 0px;
    background: none;`

const Wrapper = styled.div`
display: flex; 
flex-direction: column;

position: absolute;
left: 400px;
top: 130px;

`

export default SearchBar