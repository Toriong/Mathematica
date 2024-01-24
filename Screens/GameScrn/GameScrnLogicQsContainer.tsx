
import React, { useCallback, useEffect, useRef, useState } from 'react';
import GameScrnPresentation from './GameScrnLogicQsPresentation';
import { useApiQsFetchingStatusStore, useGameScrnTabStore, useQuestionsStore } from '../../zustand';
import { getQuestions } from '../../api_services/quiz/getQuestions';
import { getIsTValid, getUserId } from '../../utils/generalFns';
import { IQuestion, TQuestionTypes } from '../../sharedInterfaces&TypesWithBackend';
import { IReturnObjOfAsyncFn } from '../../api_services/globalApiVars';
import { Storage, TStorageInstance } from '../../utils/storage';
import { IQuestionOnClient, IQuestionsStates, TCancelTokenSource } from '../../zustandStoreTypes&Interfaces';
import { CancelTokenSource } from 'axios';
import { structuredClone } from '../../globalVars';
import { useFocusEffect } from '@react-navigation/native';

type TQuestionFromSever = { questions: [IQuestionOnClient] }

let tries = 0;

export async function getAdditionalQuestion(
  memory: TStorageInstance,
  numOfQuestionsToGet = 1,
  getAdditionalQCancelTokenSource: TCancelTokenSource,
  questions: IQuestionOnClient[],
  questionTypes: TQuestionTypes[],
): Promise<IReturnObjOfAsyncFn<[IQuestionOnClient] | null>> {
  try {
    if (!questions?.length) {
      throw new Error("No questions were received.");
    }

    const userId = (await getUserId()) as string;
    const isGameOn = await memory.getItem<boolean>("isGameOn") as boolean;
    const sentenceTxts = questions.map(question => question.sentence);
    const questionTypesForServer = (questionTypes?.length === 1) ? questionTypes : [questionTypes[Math.floor(Math.random() * questionTypes?.length)]]
    const getQuestionsResult = await getQuestions<TQuestionFromSever>(numOfQuestionsToGet, questionTypesForServer, userId, getAdditionalQCancelTokenSource, sentenceTxts);
    let newQuestionObj: TQuestionFromSever | null = getQuestionsResult.data ?? null;

    // if the user reaches the end of the questions, then set 'isGameOn' in the local storage to false
    if ((tries <= 3) && isGameOn && (getQuestionsResult.didErrorOccur || !getQuestionsResult?.data?.questions?.length)) {
      tries++
      const getQuestionResultAfterError = await getAdditionalQuestion(memory, numOfQuestionsToGet, getAdditionalQCancelTokenSource, questions, questionTypes);
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

function createGetAdditionalQuestionFn(memory: TStorageInstance, getMoreQsNum: number, cancelTokenSource: CancelTokenSource) {
  return (questions: IQuestionOnClient[], questionTypes: TQuestionTypes[]) => getAdditionalQuestion(memory, getMoreQsNum, cancelTokenSource, questions, questionTypes)
}

const GameScrnContainer = () => {
  const memory = new Storage();
  const [wasSkipBtnPressed, setWasSkipBtnPressed] = useState(false);
  const [willIncrementQIndex, setWillIncrementQIndex] = useState(false);
  const [getMoreQsNum, setWillGetMoreQsNum] = useState<number | null>(null);
  const [isUserOnLastQ, setIsUserIsOnLastQ] = useState(false);
  const wasSubmitBtnPressed = useGameScrnTabStore(state => state.wasSubmitBtnPressed);
  const questionTypes = useGameScrnTabStore(state => state.questionTypes);
  const getAdditionalQCancelTokenSource = useGameScrnTabStore(state => state.getAddtionalQCancelTokenSource);
  const willResetGetAdditionalQCancelTokenSource = useGameScrnTabStore(state => state.willResetGetAdditionalQCancelTokenSource);
  const questions = useQuestionsStore(state => state.questions);
  const questionIndex = useQuestionsStore(state => state.questionIndex);
  const updateQuestionsStore = useQuestionsStore(state => state.updateState);
  const updateGameScrnTabStore = useGameScrnTabStore(state => state.updateState);
  const updateApiQsFetchingStatusStore = useApiQsFetchingStatusStore(state => state.updateState);
  const getAdditionalQuestionFnRef = useRef<ReturnType<typeof createGetAdditionalQuestionFn> | null>(null);

  async function addNewQuestionToQuestionsArr() {
    try {
      const getAdditionalQuestionResult = await (getAdditionalQuestionFnRef.current as ReturnType<typeof createGetAdditionalQuestionFn>)(questions, questionTypes);

      console.log("getAdditionalQuestionResult: ", getAdditionalQuestionResult)

      if (getAdditionalQuestionResult.didErrorOccur || !getAdditionalQuestionResult?.data?.length) {
        throw new Error(`${getAdditionalQuestionResult.msg} ${!getAdditionalQuestionResult?.data?.length && 'Did not receive a question from the server.'}`);
      }

      const questionsUpdated = [...questions, ...getAdditionalQuestionResult.data];

      updateQuestionsStore(questionsUpdated, "questions")
      updateApiQsFetchingStatusStore("SUCCESS", "gettingQsResponseStatus");

      // if true that means the user skipped the last question of the questions array and thus no more questions to display to the user
      if (willIncrementQIndex && isUserOnLastQ) {
        console.log("The user is on the last question of the questions array...");
        updateQuestionsStore(questionIndex + 1, "questionIndex");
        updateGameScrnTabStore(true, 'isTimerOn');
        updateGameScrnTabStore(false, 'wasSubmitBtnPressed');
        setIsUserIsOnLastQ(false);
        setWillIncrementQIndex(false);
        return;
      }
    } catch (error) {
      console.error("An error has occurred in getting the next question from the server. Error message: ", error);

      if (willIncrementQIndex) {
        updateApiQsFetchingStatusStore("FAILURE", "gettingQsResponseStatus");
        updateApiQsFetchingStatusStore("submitBtnPress", "pointOfFailure")
      }
    } finally {
      setWasSkipBtnPressed(false);
      setWillGetMoreQsNum(null);
      updateGameScrnTabStore(false, 'wasSubmitBtnPressed');
      setIsUserIsOnLastQ(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      console.log("getAdditionalQuestionFnRef.current: ", getAdditionalQuestionFnRef.current)
      if (isActive && willResetGetAdditionalQCancelTokenSource) {
        getAdditionalQuestionFnRef.current = createGetAdditionalQuestionFn(memory, getMoreQsNum ?? 1, getAdditionalQCancelTokenSource);
        updateGameScrnTabStore(false, "willResetGetAdditionalQCancelTokenSource");
      }

      console.log("getAdditionalQuestionFnRef.current, what is up there: ", getAdditionalQuestionFnRef.current)

      if (isActive && (getAdditionalQuestionFnRef.current !== null) && (getMoreQsNum || wasSubmitBtnPressed || wasSkipBtnPressed)) {
        addNewQuestionToQuestionsArr();
      };

      return () => {
        isActive = false;
      };
    }, [wasSubmitBtnPressed, wasSkipBtnPressed, getMoreQsNum, willResetGetAdditionalQCancelTokenSource])
  );

  // useEffect(() => {
  //   if (willResetGetAdditionalQCancelTokenSource) {
  //     getAdditionalQuestionFnRef.current = createGetAdditionalQuestionFn(memory, getMoreQsNum ?? 1, getAdditionalQCancelTokenSource);
  //     updateGameScrnTabStore(false, "willResetGetAdditionalQCancelTokenSource");
  //   }

  //   console.log("will get questions, wasSubmitBtnPressed: ", wasSubmitBtnPressed);
  //   console.log("getAdditionalQuestion.current: ", getAdditionalQuestionFnRef.current)
  //   console.log("getAdditionalQuestion.current !== null: ", getAdditionalQuestionFnRef.current !== null)

  //   if ((getAdditionalQuestionFnRef.current !== null) && (getMoreQsNum || wasSubmitBtnPressed || wasSkipBtnPressed)) {
  //     addNewQuestionToQuestionsArr()
  //   }
  // }, [wasSubmitBtnPressed, wasSkipBtnPressed, getMoreQsNum, willResetGetAdditionalQCancelTokenSource]);

  return (
    <GameScrnPresentation
      _getMoreQsNum={[getMoreQsNum, setWillGetMoreQsNum]}
      _wasSkipBtnPressed={[wasSkipBtnPressed, setWasSkipBtnPressed]}
      _isUserOnLastQ={[isUserOnLastQ, setIsUserIsOnLastQ]}
      setWillIncrementQIndex={setWillIncrementQIndex}
    />
  )
};

export default GameScrnContainer;
