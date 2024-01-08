import { useEffect } from "react";
import { useApiQsFetchingStatusStore, useQuestionsStore } from "../zustand";
import { Storage } from "../utils/storage";
import { IS_TESTING, TESTING_USER_ID } from "../globalVars";
import { getInitialQs } from "../api_services/quiz/getInitialQs";
import { IQuestionOnClient } from "../zustandStoreTypes&Interfaces";

export function useGetInitialQs(): null {
    const memory = new Storage();
    const willGetQs = useApiQsFetchingStatusStore(state => state.willGetQs);
    const areQsReceivedForNextQuiz = useApiQsFetchingStatusStore(state => state.areQsReceivedForNextQuiz);
    const updateApiQsFetchingStatusStore = useApiQsFetchingStatusStore(state => state.updateState);
    const updateQuestionsStore = useQuestionsStore(state => state.updateState);

    useEffect(() => {
        if (willGetQs) {
            updateApiQsFetchingStatusStore("IN_PROGRESS", "gettingQsResponseStatus");

            (async () => {
                try {
                    let userId = await memory.getItem("userId");
                    userId = IS_TESTING ? TESTING_USER_ID : userId;
                    console.log("getting questions from the server...")
                    const response = await getInitialQs(userId as string, areQsReceivedForNextQuiz);

                    console.log("response from server in getting the initial questions: ", response)

                    if (response.gettingQsResponseStatus === "FAILURE") {
                        throw new Error("Failed to get the initial questions from the server.")
                    }

                    if (areQsReceivedForNextQuiz) {
                        updateQuestionsStore(response.questions as IQuestionOnClient[], "questionsForNextQuiz")
                    } else {
                        updateQuestionsStore(response.questions as IQuestionOnClient[], "questions");
                    }

                    updateApiQsFetchingStatusStore("SUCCESS", "gettingQsResponseStatus");
                } catch (error) {
                    console.error("Failed to get questions from the server. Error message: ", error)
                    updateApiQsFetchingStatusStore("FAILURE", "gettingQsResponseStatus");
                } finally {
                    updateApiQsFetchingStatusStore(false, "willGetQs");
                }
            })();
        }
    }, [willGetQs]);

    return null;
}