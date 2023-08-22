'use client'
import Image from 'next/image';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import LoginButton from './signin/LoginButton';
import SignUp from './signup/SignUp';
import { useRef } from 'react';
import Player from './Player/Player';
import Artist from './Player/Artist';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Similar from './Player/Similar'
import Link from 'next/link'

// import Portal from './Portal/portal'

export default function Home() {

  const audioRef = useRef();

  const suggestions = ['Dune', 'First Flight', 'Pirates Of Carribean', 'Can you hear the music', 'Dream is collapsing'];

  const [showDiv, setShowDiv] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [filePath, setFilePath] =  useState('')
  const [prio, setPrio] = useState(1);
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('')
  const [similarSongs, setSimilarSongs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
const [timer, setTimer] = useState(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [error, setError] = useState('');
  const token = localStorage.getItem('token')

fetch('http://localhost:8080/graphql', {
  method: 'POST',
  headers: {
    Authorization: 'bearer ' + token,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `
      query {
        authentication
      }
    `,
  }),
})
.then(res=>{
  return res.json();
}).then(res => {
  console.log(res);
  if(res.erros && res.errors[0].status===420){
    setIsAuthenticated(false);
  }
  if (res.errors) {
    console.log(res.errors);
    throw new Error('User login failed');
  }
  setIsAuthenticated(true);
})
.catch(error => {
  console.error(error);
  setIsAuthenticated(false);
});

 useEffect(() => {
      // Check if localStorage token is available
      const token = localStorage.getItem('token');
    
      if (!token) {
        setTimer(setTimeout(() => {
          setIsModalOpen(true);
        }, 300)); // 5000 milliseconds (5 seconds)
      }
    
      return () => clearTimeout(timer); // Clear the timer on component unmount
    }, []);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);


    // Filter suggestions based on input value
    const filtered = suggestions.filter(suggestion =>
      suggestion.replace(/\s+/g, '').toLowerCase().includes(inputValue.replace(/\s+/g, '').toLowerCase())
    );
    setFilteredSuggestions(filtered);
  };
///////////////////////
const handleSearch = () => {
  const type = localStorage.getItem('type')
  setInputValue('')
  setPrio(0);
  setShowDiv(true); // Show the conditional div
  const graphqlQuery = {
    query: `
      query {
        musicPlayer(
          songTitle: "${inputValue}"
          currentType: "${type}"
      
        ){
          filePath
          type
          artist
          title
          similarSongs
        }
      }
    `
  };

  fetch('http://localhost:8080/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(graphqlQuery)
  })
    .then(res => {
      return res.json();
    })
    .then(resData => {
      
      console.log(resData.errors)
      if (resData.errors && resData.errors[0].status === 424) {
        throw new Error("Fetching music data failed!");
      }
      if (resData.errors) {
        // alert('failed')
        // console.log(resData.errors[0].message);
        setError(resData.errors[0].message)
        setIsErrorModalOpen(true)
        // console.log(resData.errors);
      }
      console.log("similar songs data "  +resData)
      setPrio(1);
      setFilePath(resData.data.musicPlayer.filePath)
      setArtist(resData.data.musicPlayer.artist)
      setTitle(resData.data.musicPlayer.title)
      console.log(resData.data.musicPlayer.similarSongs);
      setSimilarSongs(resData.data.musicPlayer.similarSongs)
      localStorage.setItem('type' , resData.data.musicPlayer.type)
    })
    .catch(error => {
      // console.error(error);
      // setError('User creation failed');
    });
};

const handlePlay = (event) =>{
  event.preventDefault();
  audioRef.current.play();
}

  const handlePause = (event) =>{
    event.preventDefault();
    audioRef.current.pause();
  }


  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setFilteredSuggestions([]);

  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setIsErrorModalOpen(false)
  };
  
////////////////////////////
  return (
    <>
    {/* <Portal/> */}
    {isModalOpen && !localStorage.getItem('token') && (
 <Modal isOpen={isModalOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal}>Login </ModalHeader>
        <ModalBody>
          <form>
            <label>Email:</label>
            <input
              type="email"
              // value={email}
              // onChange={(e) => setEmail(e.target.value)}
            />
            <label>Password:</label>
            <input
              type="password"
              // value={password}
              // onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeModal}>Close</Button>
        </ModalFooter>
      </Modal>
)}

       <nav className="navbar navbar-expand-lg navbar-light navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">Spoti-Clone</a>
          <div className="ml-auto">
            <LoginButton />
           { !isAuthenticated?<SignUp />:null}
          </div>
          {isAuthenticated ? (
      <Link href="/Profile"> {/* Replace "/profile" with your actual profile page URL */}
        <div className="profile">
          {localStorage.getItem('email') && localStorage.getItem('email')[0].toUpperCase()}
        </div>
      </Link>
    ) : null}
        </div>
      </nav>
      {/* <audio src={'/music/dune.mp3'} controls ></audio> */}
     
      <div>
      <div>
        <div className="theForm">
          <form>
            <input
              placeholder='Search music, album, artist'
              value={inputValue}
              onChange={handleInputChange}
            />
            <div className="btn">
              <button onClick={handleSearch} type="button">Search</button>
            </div>
            {inputValue && (
              <div className="suggestions">
                {filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
     
      {showDiv && !error && (
  <div className="conditionalDiv">
    {/* <Similar setPrio={setPrio} setFilePath={setFilePath} setArtist={setArtist} setTitle={setTitle} similarSongs={similarSongs} /> */}
    <Artist artist={artist} title={title} />
  </div>
)}

{error && isErrorModalOpen && (
  <Modal isOpen={isErrorModalOpen} toggle={closeModal}>
    <div className="error">
      {error}
    </div>
    <Button color="secondary" onClick={closeModal}>Close</Button>
  </Modal>
)}
      </div>
      {/* <button onClick={handlePlay} >play-audio</button>
      <hr/>
      {console.log("FILEPATH ======== "+filePath)}
      <button onClick={handlePause} >pause-audio</button> */}
      {!inputValue && filePath && (
        <div className="audioDiv">
          <Player  suggestions={suggestions} title={title} artist={artist} setArtist={setArtist} setTitle={setTitle} setSimilarSongs={setSimilarSongs} similarSongs={similarSongs} filePath={filePath} setPrio={setPrio} prio={prio} />
        </div>
      )}
    </>
  );
}
