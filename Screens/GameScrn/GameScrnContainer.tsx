
import React, { useEffect } from 'react';
import GameScrnPresentation from './GameScrnPresentation';
import { useGameScrnTabStore, useQuestionsStore } from '../../zustand';
import { getQuestions } from '../../api_services/quiz/getQuestions';
import { getUserId } from '../../utils/generalFns';
import { IQuestion, TQuestionTypes } from '../../sharedInterfaces&TypesWithBackend';
import { IReturnObjOfAsyncFn } from '../../api_services/globalApiVars';
import { Storage, TStorageInstance } from '../../utils/storage';
import { IQuestionsStates } from '../../zustandStoreTypes&Interfaces';

async function getAdditionalQuestion(
  memory: TStorageInstance, 
  questions:IQuestion[], 
  questionTypes: TQuestionTypes[] 
  ): Promise<IReturnObjOfAsyncFn<[IQuestion] | null>> {
    try {
      const userId = (await getUserId()) as string;
      const isGameOn = await memory.getItem<boolean>("isGameOn") as boolean;
      console.log("isGameOn: ", isGameOn)
      const sentenceTxts = questions.map(question => question.sentence);
      const questionTypesForServer = questionTypes.length === 1 ? questionTypes : [questionTypes[Math.floor(Math.random() * questionTypes.length)]]
      const getQuestionsResult = await getQuestions<IQuestion[]>(1, questionTypesForServer, userId, sentenceTxts);
      let newQuestionArr: [IQuestion] | null = null;

      console.log("getAdditionalQuestion function call, getQuestionsResult: ", getQuestionsResult)

      // HOW TO STOP THE RECURSIVE CALL:
      // if the user reaches the end of the questions, then set 'isGameOn' in the local storage to false
      if (isGameOn && (getQuestionsResult.didErrorOccur || !getQuestionsResult?.data?.length)) {
        const getQuestionResultAfterError = await getAdditionalQuestion(memory, questions, questionTypes);
        newQuestionArr = getQuestionResultAfterError.data
      };

      if (getQuestionsResult.didErrorOccur) {
        throw new Error(`An error has occurred in getting the nex question form the server. Error message: ${getQuestionsResult.msg}`)
      }

      return { data: newQuestionArr };
    } catch (error) {
      console.error("An error has occurred in getting the next question from the server. Error message: ", error);

      return { didErrorOccur: true, data: null }
    }
  }

const GameScrnContainer = () => {
  const memory = new Storage();
  const wasSubmitBtnPressed = useGameScrnTabStore(state => state.wasSubmitBtnPressed);
  const questionTypes = useGameScrnTabStore(state => state.questionTypes);
  const questions = useQuestionsStore(state => state.questions);
  const updateQuestionsStore = useQuestionsStore(state => state.updateState);

  

  useEffect(() => {
    if (wasSubmitBtnPressed) {
      (async () => {
        try {
          const getAdditionalQuestionResult = await getAdditionalQuestion(memory, questions, questionTypes);;

          console.log("getAdditionalQuestionResult: ", getAdditionalQuestionResult);

          if (getAdditionalQuestionResult.didErrorOccur || !getAdditionalQuestionResult?.data?.length) {
            throw new Error(`${getAdditionalQuestionResult.msg} ${!getAdditionalQuestionResult?.data?.length && 'Did not receive a question from the server.'}`);
          }

          console.log("Total questions received from the server: ", getAdditionalQuestionResult.data)

          updateQuestionsStore<IQuestion[], keyof IQuestionsStates>(getAdditionalQuestionResult.data, "questions")
        } catch (error) {
          console.error("An error has occurred in getting the next question from the server. Error message: ", error);
        }
      })();
    }
  }, [wasSubmitBtnPressed])

  return <GameScrnPresentation />;
};

export default GameScrnContainer;
