
import React, { useEffect } from 'react';
import GameScrnPresentation from './GameScrnPresentation';
import { useGameScrnTabStore, useQuestionsStore } from '../../zustand';
import { getQuestions } from '../../api_services/quiz/getQuestions';
import { getUserId } from '../../utils/generalFns';
import { IQuestion } from '../../sharedInterfaces&TypesWithBackend';

const GameScrnContainer = () => {
  const wasSubmitBtnPressed = useGameScrnTabStore(state => state.wasSubmitBtnPressed);
  const questionTypes = useGameScrnTabStore(state => state.questionTypes); 
  const questions = useQuestionsStore(state => state.questions); 

  async function getAdditionalQuestion(){
    /*
    this function will do the following: 
    will get the questions from the server
    if it fails to get the questions, 
    try again until there is a succes or until the user answers all of the questions 
    if the user reaches the end, then show the error UI to the user.  
     */

    // NOTES: 
    // if isGameOn is false, then stop the recurion call of this function 

    //  CASE: the user answers a question, the next question was successfully received from the server.
    // GOAL: add the next question to the state of questions
    // the new question was added to the array of questions
    // the array that contains all of the questions was received from useQuestionStore.questions
    // get the array stored in useQuestionStore.questions
    // received the new question from the server
    
    

    // GOAL: call the function of getQuestions to get the questions
    // the getQuestions function is executed with the following arguments: 
    // questionsToGetNum = 1 
    // the userId = get it from the local storage 
    // sentenceTxtsOfAnsweredQuestions = an array that contains all of the sentences on the client side
    // questionTypes = an array of all the questions on the client side that the user can answer, A will be stored here
    // the array of questionTypes is retrieved from the GameScoreStoreTab, call it A
    // map through questions state, return the string stored in sentence, this will be the value that will be passed for 
    // sentenceTxtsOfAnsweredQuestions
    const userId = (await getUserId()) as string;
    const sentenceTxts = questions.map(question => question.sentence);
    const questionTypesForServer = questionTypes.length === 1 ? questionTypes : [questionTypes[Math.floor(Math.random() * questionTypes.length)]]
    const getQuestionsResult = await getQuestions<IQuestion[]>(1, questionTypesForServer, userId, sentenceTxts);
    let newQuestionArr: IQuestion[] | null = null;

    // NOTES:
    // -use local storage to check if the quiz is still going on. 
    if((getQuestionsResult.didErrorOccur || !getQuestionsResult?.data?.length)){
      const getQuestionResultAfterError = await getQuestions<IQuestion[]>(1, questionTypesForServer, userId, sentenceTxts);
    }
  }

  useEffect(() => {
    if(wasSubmitBtnPressed){
      // get the questions from the server
      // (async () => {
      //   const questions = 
      // })();
    }
  }, [wasSubmitBtnPressed])

  return <GameScrnPresentation />;
};

export default GameScrnContainer;
