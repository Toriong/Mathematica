
import React, { useEffect, useState } from 'react';
import GameScrnPresentation from './GameScrnLogicQsPresentation';
import { useGameScrnTabStore, useQuestionsStore } from '../../zustand';
import { getQuestions } from '../../api_services/quiz/getQuestions';
import { getUserId } from '../../utils/generalFns';
import { IQuestion, TQuestionTypes } from '../../sharedInterfaces&TypesWithBackend';
import { IReturnObjOfAsyncFn } from '../../api_services/globalApiVars';
import { Storage, TStorageInstance } from '../../utils/storage';
import { IQuestionOnClient, IQuestionsStates } from '../../zustandStoreTypes&Interfaces';

type TQuestionFromSever = { questions: [IQuestionOnClient] }

async function getAdditionalQuestion(
  memory: TStorageInstance, 
  questions:IQuestionOnClient[], 
  questionTypes: TQuestionTypes[] 
  ): Promise<IReturnObjOfAsyncFn<[IQuestionOnClient] | null>> {
    try {
      const userId = (await getUserId()) as string;
      const isGameOn = await memory.getItem<boolean>("isGameOn") as boolean;
      console.log("isGameOn: ", isGameOn)
      const sentenceTxts = questions.map(question => question.sentence);
      const questionTypesForServer = questionTypes.length === 1 ? questionTypes : [questionTypes[Math.floor(Math.random() * questionTypes.length)]]
      const getQuestionsResult = await getQuestions<TQuestionFromSever>(1, questionTypesForServer, userId, sentenceTxts);
      let newQuestionObj: TQuestionFromSever | null = getQuestionsResult.data ?? null;

      console.log("getAdditionalQuestion function call, getQuestionsResult: ", getQuestionsResult)
      console.log("getQuestionsResult.didErrorOccur: ", getQuestionsResult.didErrorOccur)

      // HOW TO STOP THE RECURSIVE CALL:
      // if the user reaches the end of the questions, then set 'isGameOn' in the local storage to false
      if (isGameOn && (getQuestionsResult.didErrorOccur || !getQuestionsResult?.data?.questions?.length)) {
        const getQuestionResultAfterError = await getAdditionalQuestion(memory, questions, questionTypes);
        newQuestionObj = getQuestionResultAfterError.data ? { questions: getQuestionResultAfterError.data } : null;
      };

      if (getQuestionsResult.didErrorOccur || !newQuestionObj) {
        throw new Error(`An error has occurred in getting the next question form the server. Error message: ${getQuestionsResult.msg}`)
      }

      console.log("newQuestionObj: ", newQuestionObj)

      return { data: newQuestionObj.questions };
    } catch (error) {
      console.error("An error has occurred in getting the next question from the server. Error message: ", error);

      return { didErrorOccur: true, data: null }
    }
  }

const GameScrnContainer = () => {
  const memory = new Storage();
  const [wasSkipBtnPressed, setWasSkipBtnPressed] = useState(false);
  const wasSubmitBtnPressed = useGameScrnTabStore(state => state.wasSubmitBtnPressed);
  const questionTypes = useGameScrnTabStore(state => state.questionTypes);
  const questions = useQuestionsStore(state => state.questions);
  const updateQuestionsStore = useQuestionsStore(state => state.updateState);

  useEffect(() => {
    if (wasSubmitBtnPressed || wasSkipBtnPressed) {
      (async () => {
        try {
          const getAdditionalQuestionResult = await getAdditionalQuestion(memory, questions, questionTypes);;

          if (getAdditionalQuestionResult.didErrorOccur || !getAdditionalQuestionResult?.data?.length) {
            throw new Error(`${getAdditionalQuestionResult.msg} ${!getAdditionalQuestionResult?.data?.length && 'Did not receive a question from the server.'}`);
          }

          const questionsUpdated = [...questions, ...getAdditionalQuestionResult.data];

          updateQuestionsStore(questionsUpdated, "questions")
        } catch (error) {
          console.error("An error has occurred in getting the next question from the server. Error message: ", error);
        } finally{
          setWasSkipBtnPressed(false);
        }
      })();
    }
  }, [wasSubmitBtnPressed, wasSkipBtnPressed]);

  return <GameScrnPresentation setWasSkipBtnPressed={setWasSkipBtnPressed} />;
};

export default GameScrnContainer;
