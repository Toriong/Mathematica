
import React, { useState, useEffect } from 'react';
import GameScrnPresentation from './GameScrnPresentation';
import { IS_TESTING } from '../../globalVars';
import testingQs from '../../testingQs.json';

// this function will return the following: 
// an object the will have the following form: 
// status: the status code of the response
// data: the questions received from the server

// GOAL: USE SWR and React Suspense FOR THIS PROJECT.


async function getQuestions(handleSuccessfulResponse?: (args?: any[] | any) => void, handleErrorResponse?: (args?: any[] | any) => void) {
  try {
    if (IS_TESTING && handleSuccessfulResponse) {
      handleSuccessfulResponse(testingQs as IQuestion[]);
      return;
    }



    // GOAL: get the questions from the API here.
  } catch (error: any) {
    if (handleErrorResponse) {
      handleErrorResponse();
    }

    return { status: error.status ?? 404, msg: error.msg ?? "Something went wrong, couldn't get the questions from the server." }
  }
}

// GOALS FOR THIS PROJECT ON THE FRONTEND: 
// use React Suspense and write a blog post about it.

// the IQuestion interace will have the following:
// _id
// task: what the user will do, this field will be optional 
// sentence: the proposition that the user will translate into
// answer: symbolic translation, will be stored into an array
// choices: what the user can choose from, this field will be optional, will have the following form below: 
// { letter: string, value: string }

interface IChoice {
  value: string
  letter: string
}

interface IQuestion {
  _id: string
  sentence: string,
  answer: string[]
  task?: string
  choices?: IChoice[]
}

interface IQuestionsForObj {
  task: string,
  questions: IQuestion[]
}



const GameScrnContainer = () => {
  const [questions, setQuestions] = useState<IQuestionsForObj | IQuestion[] | null>(null);
  // make a get request to the server to get the questions
  // simulate the get request

  // Questions will have the following form:
  //{  
  // task: what the user will do
  // questions: an array of questions that the user
  // } 

  // OR 

  // {
  // an array of questions that has the question form for the above
  // }


  function handleGetQuestionsSuccessfulResponse(questionsFromResponse: IQuestion[] | IQuestionsForObj) {
    if ((questionsFromResponse as IQuestionsForObj).task) {
      return;
    }

    setQuestions(questionsFromResponse as IQuestion[])
  }

  useEffect(() => {
    (async () => {
      if (IS_TESTING) {
        setTimeout(() => {
          getQuestions(handleGetQuestionsSuccessfulResponse);
        }, 2000);
      }
    })();
  }, []);

  return <GameScrnPresentation />;
};

export default GameScrnContainer;
