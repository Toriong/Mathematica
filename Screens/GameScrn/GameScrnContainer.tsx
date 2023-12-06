
import React, { useState, useEffect } from 'react';
import GameScrnPresentation from './GameScrnPresentation';
import { IS_TESTING } from '../../globalVars';
import testingQs from '../../testingQs.json';
import { useIsGettingReqStore, useQuestionsStore } from '../../zustand';
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
  const setQuestions = useQuestionsStore(state => state.setQuestions);
  const setTasks = useQuestionsStore(state => state.setTask);
  const updateIsGettingReqState = useIsGettingReqStore(state => state.updateState);
   
  function handleGetQuestionsSuccessfulResponse(questionsFromResponse: IQuestion[] | IQuestionsForObj) {
    if ((questionsFromResponse as IQuestionsForObj) && (questionsFromResponse as IQuestionsForObj).task) {
      return;
    }

    if(IS_TESTING){
      console.log("questionsFromResponse yo there: ", questionsFromResponse)
      setQuestions(questionsFromResponse as IQuestion[]);
      setTasks("Translate each proposition into symbolic logic.")
      updateIsGettingReqState(false, 'isGettingQs')
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

  return <GameScrnPresentation />;
};

export default GameScrnContainer;
