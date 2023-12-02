
import React, { useState, useEffect } from 'react';
import GameScrnPresentation from './GameScrnPresentation';
import { IS_TESTING } from '../../globalVars';
import testingQs from '../../testingQs.json';
import { useQuestionsStore } from '../../zustand';
import { IQuestion, IQuestionsForObj } from '../../zustandStoreTypes&Interfaces';

async function getQuestions(handleSuccessfulResponse?: (args?: any[] | any) => void, handleErrorResponse?: (args?: any[] | any) => void) {
  try {
    if (IS_TESTING && handleSuccessfulResponse) {
      handleSuccessfulResponse(testingQs as IQuestion[]);
      return;
    }

  } catch (error: any) {
    if (handleErrorResponse) {
      handleErrorResponse();
    }

    return { status: error.status ?? 404, msg: error.msg ?? "Something went wrong, couldn't get the questions from the server." }
  }
}

const GameScrnContainer = () => {
  const questions = useQuestionsStore(state => (state as IQuestionsForObj).questions);
  const setQuestions = useQuestionsStore(state => state.setQuestions);
 
  function handleGetQuestionsSuccessfulResponse(questionsFromResponse: IQuestion[] | IQuestionsForObj) {
    if ((questionsFromResponse as IQuestionsForObj) && (questionsFromResponse as IQuestionsForObj).task) {
      return;
    }

    if(IS_TESTING){
      setQuestions(questionsFromResponse as IQuestion[]);
      return;
    };
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

  useEffect(() => {
    console.log("questions yo there: ", questions);
  }, [questions]);

  return <GameScrnPresentation />;
};

export default GameScrnContainer;
