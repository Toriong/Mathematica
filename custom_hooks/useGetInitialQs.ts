import { useEffect } from "react";
import { useApiQsFetchingStatusStore, useGameScrnTabStore, useQuestionsStore } from "../zustand";
import { Storage } from "../utils/storage";
import { IS_TESTING, TESTING_USER_ID } from "../globalVars";
import { getInitialQs } from "../api_services/quiz/getInitialQs";
import { IQuestionOnClient, TNumberToGetForEachQuestionType } from "../zustandStoreTypes&Interfaces";

// NOTES: 
// CASE: when the user goes from the game screen to the main screen, clear all requests that are being made to the server

function getRandomIndex<TData>(arr: TData[], incorrectVal: any = undefined) {
    let randomIndex = Math.floor(Math.random() * arr.length);

    while (!(arr[randomIndex] === incorrectVal)) {
        randomIndex = Math.floor(Math.random() * arr.length)
    };

    return randomIndex
}

function sortRandomly<TData>(arr: TData[]) {
    let arrSortedRandomly = Array.from({ length: arr.length });

    arr.forEach(val => {
        const randomIndex = getRandomIndex(arrSortedRandomly);
        arrSortedRandomly[randomIndex] = val
    })
    
    return arrSortedRandomly;
};

export function useGetInitialQs(): null {
    const memory = new Storage();
    const willGetQs = useApiQsFetchingStatusStore(state => state.willGetQs);
    const areQsReceivedForNextQuiz = useApiQsFetchingStatusStore(state => state.areQsReceivedForNextQuiz);
    const questionsForNextQuiz = useQuestionsStore(state => state.questionsForNextQuiz);
    const numberToGetForEachQuestionType = useQuestionsStore(state => state.numberToGetForEachQuestionType);
    const updateApiQsFetchingStatusStore = useApiQsFetchingStatusStore(state => state.updateState);
    const updateQuestionsStore = useQuestionsStore(state => state.updateState);
    const updateGameScrnTabStore = useGameScrnTabStore(state => state.updateState);

    useEffect(() => {
        if (willGetQs) {
            updateApiQsFetchingStatusStore("IN_PROGRESS", "gettingQsResponseStatus");

            (async () => {
                try {
                    let userId = await memory.getItem("userId");
                    userId = IS_TESTING ? TESTING_USER_ID : userId;
                    if(Object.values(numberToGetForEachQuestionType).length){
                        
                    }
                    // const _numberToGetForEachQuestionType = (Object.values(numberToGetForEachQuestionType).length ? numberToGetForEachQuestionType : { predicate: 3, propositional: 3, diagrams: 3 }) as Required<TNumberToGetForEachQuestionType>
                    const response = await getInitialQs<IQuestionOnClient>(userId as string, areQsReceivedForNextQuiz, 1);

                    console.log("response.questions: ", response.questions);

                    if (response.gettingQsResponseStatus === "FAILURE") {
                        throw new Error("Failed to get the initial questions from the server.")
                    };

                    const questionsRandomlySorted = (response.questions?.length > 1) ? sortRandomly<IQuestionOnClient>(response.questions) : response.questions; 
                    console.log("areQsReceivedForNextQuiz: ", areQsReceivedForNextQuiz)
                    console.log("questionsRandomlySorted hey there: ", questionsRandomlySorted);


                    if (areQsReceivedForNextQuiz) {
                        const questionsForNextQUpdated = questionsForNextQuiz?.length ? [...questionsForNextQuiz, ...questionsRandomlySorted] : questionsRandomlySorted
                        updateQuestionsStore(questionsForNextQUpdated as IQuestionOnClient[], "questionsForNextQuiz")
                    } else {
                        updateQuestionsStore(questionsRandomlySorted as IQuestionOnClient[], "questions");
                        updateQuestionsStore([], "questionsForNextQuiz")
                    };

                    updateApiQsFetchingStatusStore("SUCCESS", "gettingQsResponseStatus");
                } catch (error) {
                    console.error("Failed to get questions from the server. Error message: ", error)
                    updateApiQsFetchingStatusStore("FAILURE", "gettingQsResponseStatus");
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