
import React from 'react';
import GameScrnPresentation from './GameScrnPresentation';
import { IS_TESTING } from '../../globalVars';

// this function will return the following: 
// an object the will have the following form: 
// status: the status code of the response
// data: the questions received from the server

async function getQuestions() {
  try {
    if(IS_TESTING){
      return {

      }
    }
    // if testing then return the dummy questions to the user after 2 seconds.
  } catch (error) {
    console.error('An error has occurred in getting the questions from the server.')
  }
}

const GameScrnContainer = () => {
  // make a get request to the server to get the questions
  // simulate the get request

  return <GameScrnPresentation />;
};

export default GameScrnContainer;
