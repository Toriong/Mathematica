import { useEffect } from "react";
import { useApiQsFetchingStatusStore, useGameScrnTabStore, useQuestionsStore } from "../zustand";
import { Storage, TStorageInstance } from "../utils/storage";
import { IS_TESTING, TESTING_USER_ID } from "../globalVars";
import { getInitialQs } from "../api_services/quiz/getInitialQs";
import { IQuestionOnClient, TNumberToGetForEachQuestionType } from "../zustandStoreTypes&Interfaces";
import { CancelTokenSource } from "axios";
import { TQuestionTypes } from "../sharedInterfaces&TypesWithBackend";
import { sortRandomly } from "../utils/generalFns";

// NOTES: 
// CASE: when the user goes from the game screen to the main screen, clear all requests that are being made to the server (if any) from the 
// 

// function createGetAdditionalQuestionFn(memory: TStorageInstance, getMoreQsNum: number, cancelTokenSource: CancelTokenSource){
//     return (questions: IQuestionOnClient[], questionTypes: TQuestionTypes[]) => getAdditionalQuestion(memory, getMoreQsNum, cancelTokenSource, questions, questionTypes)
//   }


export function useGetInitialQs(): null {
    const memory = new Storage();
    const willGetQs = useApiQsFetchingStatusStore(state => state.willGetQs);
    const areQsReceivedForNextQuiz = useApiQsFetchingStatusStore(state => state.areQsReceivedForNextQuiz);
    const questionsForNextQuiz = useQuestionsStore(state => state.questionsForNextQuiz);
    const numberToGetForEachQuestionType = useQuestionsStore(state => state.numberToGetForEachQuestionType);
    const updateApiQsFetchingStatusStore = useApiQsFetchingStatusStore(state => state.updateState);
    const updateQuestionsStore = useQuestionsStore(state => state.updateState);
    const updateGameScrnTabStore = useGameScrnTabStore(state => state.updateState);
    const getInitialQsCancelTokenSource = useGameScrnTabStore(state => state.getInitialQsCancelTokenSource);

    useEffect(() => {
        // GOAL: insert the token for the getQuestions function in order to cancel the request.
        if (willGetQs) {
            updateApiQsFetchingStatusStore("IN_PROGRESS", "gettingQsResponseStatus");

            (async () => {
                try {
                    let userId = await memory.getItem("userId");
                    userId = IS_TESTING ? TESTING_USER_ID : userId;
                    const _numberToGetForEachQuestionType = (Object.values(numberToGetForEachQuestionType).length ? numberToGetForEachQuestionType : { predicate: 3, propositional: 3, diagrams: 3 }) as Required<TNumberToGetForEachQuestionType>
                    const response = await getInitialQs<IQuestionOnClient>(
                        userId as string,
                        getInitialQsCancelTokenSource,
                        1,
                        _numberToGetForEachQuestionType,
                        areQsReceivedForNextQuiz
                    );

                    if (response.gettingQsResponseStatus === "FAILURE") {
                        throw new Error("Failed to get the initial questions from the server.")
                    };

                    const questionsRandomlySorted = (response.questions?.length > 1) ? sortRandomly(response.questions) : response.questions;

                    if (areQsReceivedForNextQuiz) {
                        const questionsForNextQUpdated = questionsForNextQuiz?.length ? sortRandomly([...questionsForNextQuiz, ...questionsRandomlySorted]) : questionsRandomlySorted
                        updateQuestionsStore(questionsForNextQUpdated as IQuestionOnClient[], "questionsForNextQuiz")
                    } else {
                        updateQuestionsStore(questionsRandomlySorted as IQuestionOnClient[], "questions");
                        updateQuestionsStore([], "questionsForNextQuiz")
                    };

                    updateApiQsFetchingStatusStore("SUCCESS", "gettingQsResponseStatus");
                } catch (error) {
                    console.error("Failed to get questions from the server. Error message: ", error)
                    updateApiQsFetchingStatusStore("FAILURE", "gettingQsResponseStatus");
                    updateApiQsFetchingStatusStore("gettingInitialQs", "pointOfFailure");
                } finally {
                    updateApiQsFetchingStatusStore(false, "willGetQs");
                    updateApiQsFetchingStatusStore(false, "areQsReceivedForNextQuiz");
                    updateGameScrnTabStore(false, "willNotShowLoadingModal")

                }
            })();
        }
    }, [willGetQs]);

    return null;
}