import React, {useState} from 'react'
import { csv } from 'd3-request';
import word_list from "../Constants/words.json"

export default function Test() {
    const [wordLength, setLength] = useState([6])
    const [array, setArray] = useState([]);
    const [guesses, setGuesses] = useState([]);
    const [correctGuesses, setCorrectGuesses] = useState([]);
    const [alphabet, setAlphabet] = useState([]);

    const handleGenerateClick = (e) => {
        e.preventDefault();
        let full_arr = []
        let filled_arr = word_list.filter(e => (e.length == wordLength)).map(e => e)
        console.log("Filtered elements: " + filled_arr.length)
        full_arr = full_arr.concat(filled_arr)
        setArray(full_arr)
        let blank_guesses = []
        for(let i = 0; i< wordLength; i++){
            blank_guesses.push("_")
        }
        setCorrectGuesses(blank_guesses)
        setAlphabet(["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"].map(letter => ({letter, active:true})))
    }

    const handleResetClick = (e) => {
        e.preventDefault();
        setArray([])
        setGuesses([])
        setCorrectGuesses([])
        setAlphabet([])
    }

    const handleLengthChange = (e) => {
        setLength(e.target.value)
    }

    const generate_list_blob = () => {
        return(
            <div>
                <p>Please pick a number of letters to be in your word</p>
                <p style={styles.subtext}>*if you are unsure we recommend 6</p>
                <form onSubmit={(e) => {handleGenerateClick(e)}}>
                    <input type={String} value={wordLength} onChange={(e) => {handleLengthChange(e)}}></input>
                    <button onClick={(e) => {handleGenerateClick(e)}}>Generate Words</button>
                </form>
            </div>
        )
    }

    const guesses_blob = () => {
        return (<p>{guesses.map(guess=>guess)}</p>)
    }

    const filter_letter = (currentGuess) => {
            setArray(array.filter(inWord => (!inWord.includes(currentGuess))))
    }

    const alphabet_blob = (item, index) => {
        return(<p>
            {alphabet.map((letter,index) => {
                return (<button style={letter.active ? styles.activeLetter : styles.inActiveLetter} key={index} onClick={(e) => letter.active ? guess(e, letter.letter) : ""}>{letter.letter}</button>)
            })}
        </p>)
    }

    const guess = (e, currentGuess) => {
        e.preventDefault()
            setAlphabet(alphabet.map(letter => (letter.letter == currentGuess ? {...letter, active: false}:{...letter})))
            setGuesses(guesses.concat(currentGuess))
            let survivor = array.filter(inWord => (!inWord.includes(currentGuess)))
            let temp_arr = []
            if(survivor.length < 1){
             let survior_index = Math.floor(Math.random() * array.length)
             temp_arr = array.filter((e,index) => (index == survior_index))
            }
            if(array.length>1 && survivor.length >= 1){
                //Remove all w/ given letter
                filter_letter(currentGuess)
         }
         else{
             if( array[0].includes(currentGuess)){
                //correct guess
                if(array.length == 1){
                    setCorrectGuesses(correctGuesses.map((e, index) => {
                    if(array[0][index] == currentGuess)
                    {
                        return currentGuess
                    }
                    else {
                        return e
                    }
                }))
            }
            else{
                setArray(temp_arr)
                setCorrectGuesses(correctGuesses.map((e, index) => {
                    if(temp_arr[0][index] == currentGuess)
                    {
                        return currentGuess
                    }
                    else {
                        return e
                    }
                }))
            }
        }
        else {
            //Incorrect no filter guess
        }
        }
    }

    const printed_correct_guesses = () => {
        return(<div>
            {correctGuesses.map((guess, index) => <p key={index}>{guess}</p>)}
        </div>)
    }

    const reset_button = () => (<button onClick = {(e) => {handleResetClick(e)}}> Reset </button>)
    //const filled_list = (array.length ? array.map((element, index) => (<div>{element}</div>)) : <div></div>)
    const generate_list = (!array.length ? (generate_list_blob()) : (reset_button()))

  return (
    <div>
        {generate_list}
        {printed_correct_guesses()}
        {alphabet_blob()}
    </div>
  )
}

const styles = {
    subtext: {
        fontSize: "15px"
    },
    activeLetter: {
        backgroundColor: "white",
        display: "inline",
        margin: "5px"
    },
    inActiveLetter: {
        backgroundColor: "blue",
        display: "inline",
        margin: "5px"
    }
}